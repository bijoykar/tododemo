package com.todoplanner.config;

import com.todoplanner.todo.TodoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);
    private final TodoRepository todoRepository;

    public ScheduledTasks(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Scheduled(cron = "0 1 0 * * *")
    public void archiveOverdueTodos() {
        int count = todoRepository.archiveOverdueTodos(LocalDate.now());
        log.info("Midnight archive: {} todos moved to NEEDS_REVIEW", count);
    }
}
