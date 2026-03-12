package com.todoplanner.todo;

import com.todoplanner.auth.User;
import com.todoplanner.auth.UserRepository;
import com.todoplanner.subject.Subject;
import com.todoplanner.subject.SubjectRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {

    private final TodoRepository todoRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public TodoService(TodoRepository todoRepository, SubjectRepository subjectRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public List<TodoDto> findAll(Long userId, String status, Long subjectId, LocalDate from, LocalDate to) {
        Todo.Status statusEnum = null;
        if (status != null && !status.isEmpty()) {
            statusEnum = Todo.Status.valueOf(status.toUpperCase());
        }
        return todoRepository.findWithFilters(userId, statusEnum, subjectId, from, to)
                .stream().map(TodoDto::from).collect(Collectors.toList());
    }

    public TodoDto findById(Long userId, Long id) {
        Todo todo = todoRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));
        return TodoDto.from(todo);
    }

    public TodoDto create(Long userId, TodoRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Todo todo = new Todo();
        todo.setUser(user);
        applyRequest(userId, todo, request);
        return TodoDto.from(todoRepository.save(todo));
    }

    public TodoDto update(Long userId, Long id, TodoRequest request) {
        Todo todo = todoRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));
        applyRequest(userId, todo, request);
        return TodoDto.from(todoRepository.save(todo));
    }

    public TodoDto updateStatus(Long userId, Long id, String status) {
        Todo todo = todoRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));
        Todo.Status newStatus = Todo.Status.valueOf(status.toUpperCase());
        todo.setStatus(newStatus);
        if (newStatus == Todo.Status.DONE && todo.getCompletedAt() == null) {
            todo.setCompletedAt(LocalDateTime.now());
        } else if (newStatus != Todo.Status.DONE) {
            todo.setCompletedAt(null);
        }
        return TodoDto.from(todoRepository.save(todo));
    }

    public TodoDto updatePlannedDate(Long userId, Long id, LocalDate plannedDate) {
        Todo todo = todoRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));
        todo.setPlannedDate(plannedDate);
        return TodoDto.from(todoRepository.save(todo));
    }

    public void delete(Long userId, Long id) {
        todoRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));
        todoRepository.deleteById(id);
    }

    private void applyRequest(Long userId, Todo todo, TodoRequest request) {
        if (request.getTitle() != null) todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setDueDate(request.getDueDate());
        todo.setPlannedDate(request.getPlannedDate());
        todo.setEstimatedEffort(request.getEstimatedEffort());

        if (request.getPriority() != null) {
            todo.setPriority(Todo.Priority.valueOf(request.getPriority().toUpperCase()));
        }
        if (request.getStatus() != null) {
            Todo.Status newStatus = Todo.Status.valueOf(request.getStatus().toUpperCase());
            if (newStatus == Todo.Status.DONE && todo.getCompletedAt() == null) {
                todo.setCompletedAt(LocalDateTime.now());
            } else if (newStatus != Todo.Status.DONE) {
                todo.setCompletedAt(null);
            }
            todo.setStatus(newStatus);
        }
        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new IllegalArgumentException("Subject not found"));
            todo.setSubject(subject);
        } else {
            todo.setSubject(null);
        }
    }
}
