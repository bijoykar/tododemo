package com.todoplanner.todo;

import com.todoplanner.common.ApiResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TodoDto>>> getAll(
            @AuthenticationPrincipal Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.ok(todoService.findAll(userId, status, subjectId, from, to)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TodoDto>> create(@AuthenticationPrincipal Long userId, @RequestBody TodoRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(todoService.create(userId, request)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoDto>> getById(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(todoService.findById(userId, id)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoDto>> update(@AuthenticationPrincipal Long userId, @PathVariable Long id, @RequestBody TodoRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(todoService.update(userId, id, request)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        try {
            todoService.delete(userId, id);
            return ResponseEntity.ok(ApiResponse.ok("Todo deleted"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TodoDto>> updateStatus(@AuthenticationPrincipal Long userId, @PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(todoService.updateStatus(userId, id, body.get("status"))));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/planned-date")
    public ResponseEntity<ApiResponse<TodoDto>> updatePlannedDate(@AuthenticationPrincipal Long userId, @PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            LocalDate date = body.get("plannedDate") != null ? LocalDate.parse(body.get("plannedDate")) : null;
            return ResponseEntity.ok(ApiResponse.ok(todoService.updatePlannedDate(userId, id, date)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
