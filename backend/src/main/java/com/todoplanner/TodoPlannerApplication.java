package com.todoplanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TodoPlannerApplication {
    public static void main(String[] args) {
        SpringApplication.run(TodoPlannerApplication.class, args);
    }
}
