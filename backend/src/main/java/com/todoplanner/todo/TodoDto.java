package com.todoplanner.todo;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TodoDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private LocalDate plannedDate;
    private String priority;
    private String status;
    private Long subjectId;
    private String subjectName;
    private String subjectColor;
    private String estimatedEffort;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TodoDto from(Todo todo) {
        TodoDto dto = new TodoDto();
        dto.id = todo.getId();
        dto.title = todo.getTitle();
        dto.description = todo.getDescription();
        dto.dueDate = todo.getDueDate();
        dto.plannedDate = todo.getPlannedDate();
        dto.priority = todo.getPriority().name();
        dto.status = todo.getStatus().name();
        if (todo.getSubject() != null) {
            dto.subjectId = todo.getSubject().getId();
            dto.subjectName = todo.getSubject().getName();
            dto.subjectColor = todo.getSubject().getColor();
        }
        dto.estimatedEffort = todo.getEstimatedEffort();
        dto.completedAt = todo.getCompletedAt();
        dto.createdAt = todo.getCreatedAt();
        dto.updatedAt = todo.getUpdatedAt();
        return dto;
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDate getDueDate() { return dueDate; }
    public LocalDate getPlannedDate() { return plannedDate; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
    public Long getSubjectId() { return subjectId; }
    public String getSubjectName() { return subjectName; }
    public String getSubjectColor() { return subjectColor; }
    public String getEstimatedEffort() { return estimatedEffort; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
