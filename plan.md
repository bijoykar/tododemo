# TodoPlanner — Feature-by-Feature Development Plan

## Context
The TodoPlanner project has complete documentation (SPEC.md, CLAUDE.md) but zero application code. The project needs to be built from scratch: a Spring Boot backend + React/Tailwind frontend, backed by MySQL on XAMPP. This plan breaks development into 8 discrete features (F1–F8), following the MVP-first order defined in SPEC.md Section 12.

---

## Current State
- No `backend/` or `frontend/` directories exist yet (F1 partially started)
- Git repo initialized with one commit on `master`
- Tracking files created: `prompts.md`, `completion-status.md`

---

## Build Order

```
F1 (Infra) → F2 (Auth) → F3 (Subjects) → F4 (Todo CRUD)
     → F5 (Weekly View) → F6 (Kanban) → F7 (Archive Job) → F8 (Mobile Polish)
```

---

## Feature Breakdown

### F1 — Project Scaffolding & Infrastructure
**Commit:** `ADO#1 F1: scaffold backend and frontend, CORS, ApiResponse, base routing`

**Backend (`backend/`):**
- [x] `pom.xml` — Maven deps: spring-web, spring-security, spring-data-jpa, mysql-connector, jjwt, lombok, validation
- [x] `application.properties` — datasource (XAMPP MySQL), ddl-auto=update, port 8080, JWT config
- [x] `TodoPlannerApplication.java` — main class with `@EnableScheduling`
- [x] `common/ApiResponse.java` — generic response wrapper `ApiResponse<T>` with `ok()` / `error()` statics
- [x] `config/CorsConfig.java` — allow `http://localhost:3000` permanently
- [x] `config/HealthController.java` — `GET /api/health` → `{ "status": "ok" }`

**Frontend (`frontend/`):**
- [ ] Vite + React scaffold with Tailwind CSS
- [ ] Install: `axios`, `zustand`, `react-router-dom`, `date-fns`, `react-hot-toast`, `react-hook-form`, `@dnd-kit/core`, `@dnd-kit/sortable`
- [ ] `src/api/axiosInstance.js` — base axios instance with interceptor scaffold
- [ ] Router: `/` → `/weekly`, `/login`, `/weekly`, `/kanban` routes (placeholder pages)
- [ ] Base layout shell with Navbar placeholder

---

### F2 — Authentication (PIN + JWT)
**Commit:** `ADO#2 F2: PIN auth, JWT access+refresh tokens, protected routes`

**Backend:**
- [ ] `auth/UserConfig.java` — entity (`user_config` table, id always = 1)
- [ ] `auth/UserConfigRepository.java`
- [ ] `auth/JwtUtil.java` — sign/verify JWT (access 15 min, refresh 7 days)
- [ ] `auth/AuthService.java` — bcrypt PIN hash/verify, token generation, refresh rotation, cookie management
- [ ] `auth/AuthController.java`:
  - `GET /api/auth/status` → `{ status: "setup_required" | "ready" }`
  - `POST /api/auth/setup` — first-run PIN setup
  - `POST /api/auth/login` — `{ pin }` → `{ accessToken }`
  - `POST /api/auth/refresh` — reads httpOnly cookie → new `{ accessToken }`
  - `POST /api/auth/logout` — clears refresh token
- [ ] `config/SecurityConfig.java` — permit `/api/auth/**` + `/api/health`, JWT filter on all others

**Frontend:**
- [ ] `src/api/auth.js` — login, refresh, logout, status API calls
- [ ] `src/store/authStore.js` — Zustand store for auth state
- [ ] `src/components/auth/PinSetup.jsx` — first-run PIN setup form
- [ ] `src/components/auth/PinLogin.jsx` — PIN input form → POST login → store token
- [ ] Axios interceptor: 401 → call refresh → retry original request
- [ ] `src/components/common/ProtectedRoute.jsx` — redirect to `/login` if no valid token
- [ ] First-run detection via `GET /api/auth/status`

---

### F3 — Subject CRUD
**Commit:** `ADO#3 F3: subject CRUD, SubjectManager modal, SubjectChip component`

**Backend:**
- [ ] `subject/Subject.java` — entity (`subjects` table)
- [ ] `subject/SubjectRepository.java`
- [ ] `subject/SubjectService.java` — CRUD + cascade NULL on delete
- [ ] `subject/SubjectController.java`:
  - `GET /api/subjects`
  - `POST /api/subjects` — `{ name, color }`
  - `PUT /api/subjects/{id}`
  - `DELETE /api/subjects/{id}` — sets `subject_id = NULL` on related todos

**Frontend:**
- [ ] `src/api/subjects.js`
- [ ] `src/store/subjectsStore.js` — Zustand
- [ ] `src/components/subjects/SubjectManager.jsx` — modal: table + name input + color picker
- [ ] `src/components/common/SubjectChip.jsx` — colored pill badge

---

### F4 — Todo CRUD
**Commit:** `ADO#4 F4: todo CRUD, TodoDrawer with all fields, PriorityBadge`

**Backend:**
- [ ] `todo/Todo.java` — entity (`todos` table, all columns per SPEC)
- [ ] `todo/TodoRepository.java` — JPA with filter queries
- [ ] `todo/TodoService.java` — CRUD, status transitions, `completed_at` on DONE
- [ ] `todo/TodoController.java`:
  - `GET /api/todos?status=&subjectId=&from=&to=`
  - `POST /api/todos`
  - `GET /api/todos/{id}`
  - `PUT /api/todos/{id}`
  - `DELETE /api/todos/{id}`
  - `PATCH /api/todos/{id}/status` — `{ status }`
  - `PATCH /api/todos/{id}/planned-date` — `{ plannedDate }`

**Frontend:**
- [ ] `src/api/todos.js`
- [ ] `src/store/todosStore.js` — Zustand
- [ ] `src/components/todos/TodoDrawer.jsx` — slide-in right panel, all fields, auto-save on blur
- [ ] `src/components/common/PriorityBadge.jsx` — HIGH=red, MEDIUM=amber, LOW=slate

---

### F5 — Weekly View
**Commit:** `ADO#5 F5: WeeklyView, DayCell, draggable TodoCard, QuickAddBar, conflict warning`

**Frontend only** (no new backend endpoints):
- [ ] `src/hooks/useWeek.js` — week start/end, prev/next navigation via `date-fns`
- [ ] `src/pages/WeeklyPage.jsx` — 7-column grid, week nav arrows + "Today" button
- [ ] `src/components/weekly/DayCell.jsx` — day column with todo cards + quick-add input
- [ ] `src/components/weekly/TodoCard.jsx` — draggable via `@dnd-kit`, shows title/priority/subject/due date/conflict badge
- [ ] `src/components/weekly/QuickAddBar.jsx` — Enter → creates todo → optimistic insert → opens drawer
- [ ] Drag between day columns → `PATCH /api/todos/{id}/planned-date` → optimistic update
- [ ] Conflict warning: amber badge if `plannedDate > dueDate`

---

### F6 — Kanban Board
**Commit:** `ADO#6 F6: KanbanBoard, 4 columns, drag-to-status, mobile tab layout`

**Frontend only** (no new backend endpoints):
- [ ] `src/pages/KanbanPage.jsx` — 4 columns: TODO, IN_PROGRESS, NEEDS_REVIEW, DONE
- [ ] `src/components/kanban/KanbanColumn.jsx` — column header + card list
- [ ] `src/components/kanban/KanbanCard.jsx` — title, priority, subject chip, due date, card menu
- [ ] Drag between columns → `PATCH /api/todos/{id}/status` → optimistic update
- [ ] NEEDS_REVIEW → TODO drag: opens TodoDrawer to pick new `due_date`
- [ ] Mobile (< 768px): single-column list + status filter tabs at top

---

### F7 — Midnight Auto-Archive (Needs Review Job)
**Commit:** `ADO#7 F7: midnight NEEDS_REVIEW archive job, login-time stale detection`

**Backend:**
- [ ] `config/ScheduledTasks.java` — `@Scheduled(cron = "0 1 0 * * *")` daily at 00:01
- [ ] Query: `UPDATE todos SET status = 'NEEDS_REVIEW' WHERE status IN ('TODO','IN_PROGRESS') AND due_date < CURDATE()`

**Frontend:**
- [ ] On login: fetch NEEDS_REVIEW count → show badge on Kanban nav link if > 0
- [ ] Toast notification if any todos moved since last session

---

### F8 — Mobile Weekly View & Polish
**Commit:** `ADO#8 F8: mobile touch drag, weekly day scroll, polish and empty states`

**Frontend:**
- [ ] Touch drag support: add `TouchSensor` with activation constraints to `@dnd-kit`
- [ ] Weekly view mobile (< 768px): horizontal scroll snap (1 day at a time)
- [ ] Day indicator dots: small dot below date if todos exist on that day
- [ ] Loading skeletons on data fetch
- [ ] Empty states for days/columns with no todos
- [ ] Keyboard shortcuts: arrow keys for week navigation

---

## Verification Checklist (End-to-End)

- [ ] First run: setup PIN → redirected to `/weekly`
- [ ] Create todo via quick-add in a day cell → appears on that day
- [ ] Open card → drawer slides in → edit → changes persist on refresh
- [ ] Drag todo to different day → `planned_date` updates → warning if past due
- [ ] Subject created with color → chip appears on cards
- [ ] Delete subject → todos show as "Uncategorized"
- [ ] Todo overdue at midnight → status becomes `NEEDS_REVIEW`
- [ ] Drag NEEDS_REVIEW to DONE → `completed_at` set
- [ ] JWT expires → auto-refresh → user stays logged in
- [ ] Mobile < 768px: Kanban shows tabs; weekly view scrollable
- [ ] CORS: React on 3000 calls Spring Boot on 8080 with no console errors

---

## Tech Stack Reference

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS (port 3000) |
| Backend | Spring Boot 3.2 (Java 17, port 8080) |
| Database | MySQL via XAMPP |
| Auth | Spring Security + JWT (access 15 min + refresh 7 days) |
| State | Zustand |
| DnD | @dnd-kit/core + @dnd-kit/sortable |
| Forms | React Hook Form |
| Dates | date-fns |
| HTTP | axios |
| Toasts | react-hot-toast |
