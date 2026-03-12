package com.todoplanner.auth;

import com.todoplanner.common.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, String>>> status() {
        String status = authService.isSetupRequired() ? "setup_required" : "ready";
        return ResponseEntity.ok(ApiResponse.ok(Map.of("status", status)));
    }

    @PostMapping("/setup")
    public ResponseEntity<ApiResponse<String>> setup(@RequestBody Map<String, String> body) {
        String pin = body.get("pin");
        if (pin == null || pin.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("PIN is required"));
        }
        authService.setupPin(pin.trim());
        return ResponseEntity.ok(ApiResponse.ok("PIN setup complete"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(
            @RequestBody Map<String, String> body,
            HttpServletResponse response) {
        String pin = body.get("pin");
        if (pin == null || pin.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("PIN is required"));
        }
        try {
            String accessToken = authService.login(pin.trim(), response);
            return ResponseEntity.ok(ApiResponse.ok(Map.of("accessToken", accessToken)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, String>>> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {
        if (refreshToken == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("No refresh token"));
        }
        try {
            String accessToken = authService.refresh(refreshToken, response);
            return ResponseEntity.ok(ApiResponse.ok(Map.of("accessToken", accessToken)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok(ApiResponse.ok("Logged out"));
    }
}
