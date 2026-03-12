package com.todoplanner.auth;

import com.todoplanner.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @GetMapping("/users/pending")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPendingUsers() {
        List<Map<String, Object>> users = userRepository.findByStatus(User.Status.PENDING).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PatchMapping("/users/{id}/approve")
    public ResponseEntity<ApiResponse<Map<String, Object>>> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(User.Status.APPROVED);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok("User approved", toDto(user)));
    }

    @PatchMapping("/users/{id}/reject")
    public ResponseEntity<ApiResponse<Map<String, Object>>> rejectUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(User.Status.REJECTED);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok("User rejected", toDto(user)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted"));
    }

    private Map<String, Object> toDto(User user) {
        return Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail() != null ? user.getEmail() : "",
            "role", user.getRole().name(),
            "status", user.getStatus().name(),
            "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        );
    }
}
