package com.todoplanner.subject;

import com.todoplanner.common.ApiResponse;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponse<List<Subject>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(subjectService.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Subject>> create(@RequestBody Map<String, String> body) {
        try {
            Subject subject = subjectService.create(body.get("name"), body.get("color"));
            return ResponseEntity.ok(ApiResponse.ok(subject));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Subject>> update(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            Subject subject = subjectService.update(id, body.get("name"), body.get("color"));
            return ResponseEntity.ok(ApiResponse.ok(subject));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> delete(@PathVariable Long id) {
        try {
            long affected = subjectService.countTodosBySubject(id);
            subjectService.delete(id);
            return ResponseEntity.ok(ApiResponse.ok(Map.of("deletedId", id, "affectedTodos", affected)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
