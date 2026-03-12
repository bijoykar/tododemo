package com.todoplanner.auth;

import com.todoplanner.common.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String pin = body.get("pin");

        if (username == null || username.isBlank()) return ResponseEntity.badRequest().body(ApiResponse.error("Username is required"));
        if (pin == null || pin.length() < 4) return ResponseEntity.badRequest().body(ApiResponse.error("PIN must be at least 4 characters"));

        try {
            Map<String, Object> result = authService.register(username, email, pin);
            return ResponseEntity.ok(ApiResponse.ok(result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(
            @RequestBody Map<String, String> body,
            HttpServletResponse response) {
        String username = body.get("username");
        String pin = body.get("pin");

        if (username == null || username.isBlank()) return ResponseEntity.badRequest().body(ApiResponse.error("Username is required"));
        if (pin == null || pin.isBlank()) return ResponseEntity.badRequest().body(ApiResponse.error("PIN is required"));

        try {
            Map<String, Object> result = authService.login(username, pin, response);
            return ResponseEntity.ok(ApiResponse.ok(result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, String>>> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {
        if (refreshToken == null) return ResponseEntity.status(401).body(ApiResponse.error("No refresh token"));
        try {
            String accessToken = authService.refresh(refreshToken, response);
            return ResponseEntity.ok(ApiResponse.ok(Map.of("accessToken", accessToken)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            @AuthenticationPrincipal Long userId,
            HttpServletResponse response) {
        authService.logout(userId, response);
        return ResponseEntity.ok(ApiResponse.ok("Logged out"));
    }
}
