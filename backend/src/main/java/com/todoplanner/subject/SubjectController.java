package com.todoplanner.subject;

import com.todoplanner.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Subject>>> getAll(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(subjectService.findAll(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Subject>> create(@AuthenticationPrincipal Long userId, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(subjectService.create(userId, body.get("name"), body.get("color"))));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Subject>> update(@AuthenticationPrincipal Long userId, @PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(subjectService.update(userId, id, body.get("name"), body.get("color"))));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> delete(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        try {
            long affected = subjectService.countTodosBySubject(userId, id);
            subjectService.delete(userId, id);
            return ResponseEntity.ok(ApiResponse.ok(Map.of("deletedId", id, "affectedTodos", affected)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
