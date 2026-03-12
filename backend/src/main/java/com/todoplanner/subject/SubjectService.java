package com.todoplanner.subject;

import com.todoplanner.todo.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final TodoRepository todoRepository;

    public SubjectService(SubjectRepository subjectRepository, TodoRepository todoRepository) {
        this.subjectRepository = subjectRepository;
        this.todoRepository = todoRepository;
    }

    public List<Subject> findAll() {
        return subjectRepository.findAll();
    }

    public Subject create(String name, String color) {
        if (subjectRepository.existsByName(name)) {
            throw new IllegalArgumentException("Subject name already exists");
        }
        Subject subject = new Subject();
        subject.setName(name);
        subject.setColor(color);
        return subjectRepository.save(subject);
    }

    public Subject update(Long id, String name, String color) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found"));
        subject.setName(name);
        subject.setColor(color);
        return subjectRepository.save(subject);
    }

    @Transactional
    public void delete(Long id) {
        subjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found"));
        todoRepository.clearSubjectId(id);
        subjectRepository.deleteById(id);
    }

    public long countTodosBySubject(Long subjectId) {
        return todoRepository.countBySubjectId(subjectId);
    }
}
