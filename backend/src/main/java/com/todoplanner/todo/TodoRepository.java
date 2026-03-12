package com.todoplanner.todo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT t FROM Todo t LEFT JOIN FETCH t.subject LEFT JOIN FETCH t.user WHERE " +
           "t.user.id = :userId AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:subjectId IS NULL OR t.subject.id = :subjectId) AND " +
           "(:from IS NULL OR COALESCE(t.plannedDate, t.dueDate) >= :from) AND " +
           "(:to IS NULL OR COALESCE(t.plannedDate, t.dueDate) <= :to)")
    List<Todo> findWithFilters(
            @Param("userId") Long userId,
            @Param("status") Todo.Status status,
            @Param("subjectId") Long subjectId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    Optional<Todo> findByIdAndUserId(Long id, Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE Todo t SET t.subject = NULL WHERE t.subject.id = :subjectId")
    void clearSubjectId(@Param("subjectId") Long subjectId);

    long countBySubjectId(Long subjectId);
    long countBySubjectIdAndUserId(Long subjectId, Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE Todo t SET t.status = 'NEEDS_REVIEW' WHERE t.status IN ('TODO', 'IN_PROGRESS') AND t.dueDate < :today")
    int archiveOverdueTodos(@Param("today") LocalDate today);
}
