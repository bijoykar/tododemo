package com.todoplanner.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> register(String username, String email, String pin) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (email != null && !email.isBlank() && userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setUsername(username.trim());
        user.setEmail(email != null && !email.isBlank() ? email.trim() : null);
        user.setPinHash(passwordEncoder.encode(pin));

        // First user becomes ADMIN and is auto-approved
        boolean isFirstUser = userRepository.count() == 0;
        if (isFirstUser) {
            user.setRole(User.Role.ADMIN);
            user.setStatus(User.Status.APPROVED);
        }

        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("status", isFirstUser ? "approved" : "pending");
        result.put("isAdmin", isFirstUser);
        return result;
    }

    public Map<String, Object> login(String username, String pin, HttpServletResponse response) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or PIN"));

        if (!passwordEncoder.matches(pin, user.getPinHash())) {
            throw new IllegalArgumentException("Invalid username or PIN");
        }
        if (user.getStatus() == User.Status.PENDING) {
            throw new IllegalStateException("Your account is pending admin approval");
        }
        if (user.getStatus() == User.Status.REJECTED) {
            throw new IllegalStateException("Your account has been rejected");
        }

        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        user.setRefreshTokenHash(passwordEncoder.encode(refreshToken));
        userRepository.save(user);

        setRefreshCookie(response, refreshToken);
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getUsername(), user.getRole().name());

        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", accessToken);
        result.put("username", user.getUsername());
        result.put("role", user.getRole().name());
        result.put("userId", user.getId());
        return result;
    }

    public String refresh(String refreshToken, HttpServletResponse response) {
        Long userId = jwtUtil.getUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRefreshTokenHash() == null ||
                !passwordEncoder.matches(refreshToken, user.getRefreshTokenHash())) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String newRefreshToken = jwtUtil.generateRefreshToken(user.getId());
        user.setRefreshTokenHash(passwordEncoder.encode(newRefreshToken));
        userRepository.save(user);

        setRefreshCookie(response, newRefreshToken);
        return jwtUtil.generateAccessToken(user.getId(), user.getUsername(), user.getRole().name());
    }

    public void logout(Long userId, HttpServletResponse response) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setRefreshTokenHash(null);
            userRepository.save(user);
        });
        clearRefreshCookie(response);
    }

    private void setRefreshCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
