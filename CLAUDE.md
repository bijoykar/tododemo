# CLAUDE.md — TodoPlanner

This file provides project context, architecture guidance, and coding conventions for AI assistants working on this codebase.

---

## Project Overview

**TodoPlanner** is a student-focused task planner running on a local XAMPP stack. The primary mental model is a **weekly calendar view** — todos live on days, not just a flat list. A Kanban board is the secondary execution view for tracking work-in-progress status.

The core problem it solves: students lose track of deadlines because there is no bridge between "what I need to do" and "when I will do it."

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS — runs on `http://localhost:3000` |
| Backend | Spring Boot (Java) — runs on `http://localhost:8080` |
| Database | MySQL via XAMPP |
| Auth | Spring Security + JWT (access token 15 min + refresh token 7 days) |

**CORS:** Spring Boot permanently allows `http://localhost:3000`. All React API calls go to `http://localhost:8080/api/**`.

---

## Running the Project

### Backend (Spring Boot)
```bash
# From the backend/ directory
./mvnw spring-boot:run
# or
mvn spring-boot:run
```
Backend starts on **port 8080**.

### Frontend (React)
```bash
# From the frontend/ directory
npm install
npm run dev
```
Frontend starts on **port 3000**.

### Database
Start MySQL via the XAMPP Control Panel. The schema is bootstrapped automatically by Spring Boot (`spring.jpa.hibernate.ddl-auto=update`).

---



---

## Coding Conventions

- **Backend:** Follow standard Spring Boot layered conventions. Use `ApiResponse<T>` as the standard response wrapper for all endpoints. Keep controllers thin — business logic goes in service classes.
- **Frontend:** Prefer functional components with hooks. Use Zustand stores for global state. Keep API calls isolated inside `src/api/`. Component files use PascalCase; utility files use camelCase.
- **CSS:** Tailwind utility classes only. No custom CSS files unless absolutely necessary.
- **Dates:** Always use `date-fns` for date arithmetic and formatting. Never use raw `new Date()` math.
- **Error handling:** All API errors should surface as a `react-hot-toast` notification. Never `console.error` silently.

---
## Git Commit
After each feature is completed , commit the changes with ADO#{feature No} pattern with good commit message
##Prompt
Add all user provided promt is a file

