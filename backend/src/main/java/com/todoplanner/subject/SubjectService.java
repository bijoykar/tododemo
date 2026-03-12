package com.todoplanner.subject;

import com.todoplanner.auth.User;
import com.todoplanner.auth.UserRepository;
import com.todoplanner.todo.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public SubjectService(SubjectRepository subjectRepository, TodoRepository todoRepository, UserRepository userRepository) {
        this.subjectRepository = subjectRepository;
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    public List<Subject> findAll(Long userId) {
        return subjectRepository.findByUserId(userId);
    }

    public Subject create(Long userId, String name, String color) {
        if (subjectRepository.existsByNameAndUserId(name, userId)) {
            throw new IllegalArgumentException("Subject name already exists");
        }
        User user = userRepository.findById(userId).orElseThrow();
        Subject subject = new Subject();
        subject.setName(name);
        subject.setColor(color);
        subject.setUser(user);
        return subjectRepository.save(subject);
    }

    public Subject update(Long userId, Long id, String name, String color) {
        Subject subject = subjectRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found"));
        subject.setName(name);
        subject.setColor(color);
        return subjectRepository.save(subject);
    }

    @Transactional
    public void delete(Long userId, Long id) {
        Subject subject = subjectRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found"));
        todoRepository.clearSubjectId(id);
        subjectRepository.deleteById(id);
    }

    public long countTodosBySubject(Long userId, Long subjectId) {
        return todoRepository.countBySubjectIdAndUserId(subjectId, userId);
    }
}
