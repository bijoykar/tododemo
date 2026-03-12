package com.todoplanner.todo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT t FROM Todo t LEFT JOIN FETCH t.subject WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:subjectId IS NULL OR t.subject.id = :subjectId) AND " +
           "(:from IS NULL OR t.plannedDate >= :from OR (t.plannedDate IS NULL AND t.dueDate >= :from)) AND " +
           "(:to IS NULL OR t.plannedDate <= :to OR (t.plannedDate IS NULL AND t.dueDate <= :to))")
    List<Todo> findWithFilters(
            @Param("status") Todo.Status status,
            @Param("subjectId") Long subjectId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    @Modifying
    @Transactional
    @Query("UPDATE Todo t SET t.subject = NULL WHERE t.subject.id = :subjectId")
    void clearSubjectId(@Param("subjectId") Long subjectId);

    long countBySubjectId(Long subjectId);

    @Modifying
    @Transactional
    @Query("UPDATE Todo t SET t.status = 'NEEDS_REVIEW' WHERE t.status IN ('TODO', 'IN_PROGRESS') AND t.dueDate < :today")
    int archiveOverdueTodos(@Param("today") LocalDate today);
}
