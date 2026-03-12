package com.todoplanner.auth;

import com.todoplanner.common.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserConfigRepository userConfigRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserConfigRepository userConfigRepository, JwtUtil jwtUtil) {
        this.userConfigRepository = userConfigRepository;
        this.jwtUtil = jwtUtil;
    }

    public boolean isSetupRequired() {
        return userConfigRepository.findById(1L).isEmpty();
    }

    public void setupPin(String pin) {
        if (!isSetupRequired()) {
            throw new IllegalStateException("Setup already completed");
        }
        UserConfig config = new UserConfig();
        config.setId(1L);
        config.setPinHash(passwordEncoder.encode(pin));
        userConfigRepository.save(config);
    }

    public String login(String pin, HttpServletResponse response) {
        UserConfig config = userConfigRepository.findById(1L)
                .orElseThrow(() -> new IllegalStateException("Setup not completed"));

        if (!passwordEncoder.matches(pin, config.getPinHash())) {
            throw new IllegalArgumentException("Invalid PIN");
        }

        String refreshToken = jwtUtil.generateRefreshToken();
        config.setRefreshTokenHash(passwordEncoder.encode(refreshToken));
        userConfigRepository.save(config);

        setRefreshCookie(response, refreshToken);
        return jwtUtil.generateAccessToken();
    }

    public String refresh(String refreshToken, HttpServletResponse response) {
        UserConfig config = userConfigRepository.findById(1L)
                .orElseThrow(() -> new IllegalStateException("Not configured"));

        if (config.getRefreshTokenHash() == null ||
            !passwordEncoder.matches(refreshToken, config.getRefreshTokenHash())) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        // Rotate refresh token
        String newRefreshToken = jwtUtil.generateRefreshToken();
        config.setRefreshTokenHash(passwordEncoder.encode(newRefreshToken));
        userConfigRepository.save(config);

        setRefreshCookie(response, newRefreshToken);
        return jwtUtil.generateAccessToken();
    }

    public void logout(HttpServletResponse response) {
        userConfigRepository.findById(1L).ifPresent(config -> {
            config.setRefreshTokenHash(null);
            userConfigRepository.save(config);
        });
        clearRefreshCookie(response);
    }

    private void setRefreshCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
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
