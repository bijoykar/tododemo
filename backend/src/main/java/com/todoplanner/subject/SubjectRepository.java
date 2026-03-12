package com.todoplanner.subject;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByUserId(Long userId);
    boolean existsByNameAndUserId(String name, Long userId);
    Optional<Subject> findByIdAndUserId(Long id, Long userId);
}
