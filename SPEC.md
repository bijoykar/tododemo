# TodoPlanner — Product & Technical Specification

## Context

A student-focused task planner built on a local XAMPP stack. The student's core failure mode is losing track of deadlines and having no bridge between "what I need to do" and "when I will do it." This app solves that by making the **weekly view the primary mental model** — todos live on a calendar, not just a list. The Kanban board is a secondary execution tool for tracking work-in-progress status.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS (port 3000) |
| Backend | Spring Boot (Java, port 8080) |
| Database | MySQL via XAMPP |
| Auth | Spring Security + JWT (access + refresh token) |
| Deployment | Separate servers, CORS permanently configured |

**CORS config:** Spring Boot allows `http://localhost:3000`. React calls `http://localhost:8080/api/**`.

---

## 2. User Model

- **Single user** — one account per install
- **PIN/password auth** — user sets a PIN on first run
- PIN stored as **bcrypt hash** in DB
- Spring Security issues **JWT access token (15 min)** + **refresh token (7 days)**
- JWT stored in `localStorage`; refresh token stored in `httpOnly` cookie
- On 401, React intercepts and calls `/api/auth/refresh` automatically

---

## 3. Data Model

### `todos` table

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT PK | Auto-increment |
| `title` | VARCHAR(255) | Required |
| `description` | TEXT | Nullable |
| `due_date` | DATE | The actual deadline |
| `planned_date` | DATE | When student plans to work on it (set by weekly drag) |
| `priority` | ENUM('HIGH','MEDIUM','LOW') | Manual, defaults to MEDIUM |
| `status` | ENUM('TODO','IN_PROGRESS','NEEDS_REVIEW','DONE') | Default: TODO |
| `subject_id` | BIGINT FK | Nullable → "Uncategorized" |
| `estimated_effort` | VARCHAR(20) | e.g. "30min", "2h" — free text |
| `completed_at` | DATETIME | Set when status → DONE |
| `created_at` | DATETIME | Auto |
| `updated_at` | DATETIME | Auto |

### `subjects` table

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT PK | Auto-increment |
| `name` | VARCHAR(100) | Required, unique |
| `color` | VARCHAR(7) | Hex color e.g. `#3B82F6` |
| `created_at` | DATETIME | Auto |

**Subject deletion rule:** Set `subject_id = NULL` on all related todos → they appear as "Uncategorized".

### `user_config` table (single row)

| Column | Type | Notes |
|---|---|---|
| `id` | INT PK | Always 1 |
| `pin_hash` | VARCHAR(255) | Bcrypt |
| `refresh_token_hash` | VARCHAR(255) | For refresh token rotation |

---

## 4. Backend Architecture

**Package structure (feature-based within layered pattern):**

```
com.todoplanner
├── auth/
│   ├── AuthController
│   ├── AuthService
│   └── JwtUtil
├── todo/
│   ├── TodoController
│   ├── TodoService
│   └── TodoRepository
├── subject/
│   ├── SubjectController
│   ├── SubjectService
│   └── SubjectRepository
├── config/
│   ├── SecurityConfig
│   ├── CorsConfig
│   └── ScheduledTasks   ← midnight archive job
└── common/
    └── ApiResponse<T>   ← standard response wrapper
```

**Midnight job (Spring `@Scheduled`):**
Every day at 00:01, find all todos where `status IN ('TODO','IN_PROGRESS') AND due_date < CURDATE()` → set `status = 'NEEDS_REVIEW'`.

---

## 5. REST API Endpoints

### Auth
- `POST /api/auth/login` — `{ pin }` → `{ accessToken, user }`
- `POST /api/auth/refresh` — uses httpOnly cookie → `{ accessToken }`
- `POST /api/auth/logout` — clears refresh token

### Todos
- `GET /api/todos` — query params: `status`, `subjectId`, `from` (date), `to` (date)
- `POST /api/todos` — create
- `GET /api/todos/{id}` — single todo
- `PUT /api/todos/{id}` — full update
- `PATCH /api/todos/{id}/status` — `{ status }` — drag between columns
- `PATCH /api/todos/{id}/planned-date` — `{ plannedDate }` — weekly drag
- `DELETE /api/todos/{id}`

### Subjects
- `GET /api/subjects`
- `POST /api/subjects`
- `PUT /api/subjects/{id}`
- `DELETE /api/subjects/{id}` — cascades to NULL on todos

---

## 6. Frontend Architecture

```
src/
├── api/          ← axios instance + interceptors (token refresh)
├── components/
│   ├── auth/     ← PinLogin
│   ├── weekly/   ← WeeklyView, DayCell, TodoCard (draggable)
│   ├── kanban/   ← KanbanBoard, KanbanColumn, KanbanCard
│   ├── todos/    ← QuickAddBar, TodoDrawer (slide-in editor)
│   ├── subjects/ ← SubjectManager modal
│   └── common/   ← Navbar, PriorityBadge, SubjectChip
├── pages/
│   ├── WeeklyPage    ← primary view
│   └── KanbanPage    ← secondary view
├── hooks/        ← useTodos, useSubjects, useWeek
├── store/        ← Zustand or React Context
└── utils/        ← date helpers, conflict detection
```

**Routing:**
- `/` → redirect to `/weekly`
- `/weekly` → WeeklyPage (primary)
- `/kanban` → KanbanPage
- `/login` → PinLogin (if no valid token)

---

## 7. Weekly View (Primary)

- **7-day horizontal grid** (Mon–Sun of current week)
- Each day column contains **draggable todo cards** positioned by `planned_date` (falls back to `due_date` if `planned_date` is null)
- **Week navigation:** prev/next week arrows + "Today" button
- **Drag to reschedule:** Updates `planned_date` via `PATCH /api/todos/{id}/planned-date`
- **Conflict warning:** If `planned_date > due_date`, show an inline amber warning badge on the card ("Planned after due date")
- **Inline quick-add:** Text input at the top of each day column. Type title → Enter → creates todo with that day as `planned_date` and `due_date`. Opens drawer for more fields.
- Cards show: title, priority badge (color-coded dot), subject chip (colored), due date if different from planned date

---

## 8. Kanban View (Secondary)

**4 columns (desktop):**

```
| TO DO | IN PROGRESS | NEEDS REVIEW | DONE |
```

- Drag-and-drop between columns updates `status`
- **Needs Review** column is auto-populated by the midnight job (also on login if date has changed)
- Exit paths from **Needs Review**: drag to TO DO (reschedule intent) | drag to DONE | delete from card menu
- When rescheduling from Needs Review, drawer opens to pick a new `due_date`

**Mobile layout (< 768px):** Auto-detect via Tailwind `md:` breakpoint → switches to **single-column list with status filter tabs** at top: `To Do | In Progress | Needs Review | Done`

---

## 9. Todo Capture & Edit

**Quick-add bar (top of weekly day cell or kanban column):**
- Always-visible text input
- Press Enter → creates todo with title + inferred date context
- New card appears immediately (optimistic update)

**Slide-in drawer (right side, opens on card click):**
- Fields: Title, Description (textarea), Due Date, Planned Date, Priority (HIGH/MED/LOW segmented control), Subject (dropdown with color dots), Estimated Effort (free text), Status
- Auto-save on field blur OR explicit Save button
- Delete button at bottom (with confirmation)
- Conflict warning shown inline if `planned_date > due_date`

---

## 10. Subject Management

- Accessible via a gear/settings icon → **SubjectManager modal**
- Table of subjects: name, color swatch, edit/delete per row
- Create row: name input + color picker (Tailwind palette presets)
- Delete: confirm dialog warns "X todos will become Uncategorized"
- "Uncategorized" is a virtual subject (not in DB), shown for `subject_id = NULL` todos

---

## 11. Priority System

- Manual only: HIGH (red) / MEDIUM (amber) / LOW (slate)
- Displayed as a colored dot/badge on cards in both views
- No auto-sorting by priority — user controls order within columns via drag

---

## 12. MVP (Phase 1) — Build This First

Ship in this order to validate the core loop:

1. **Auth** — PIN setup screen on first run, JWT login, protected routes
2. **Todo CRUD** — create, read, update, delete with all fields
3. **Weekly View** — 7-day grid, cards, drag-to-reschedule, conflict warning
4. **Subject CRUD** — basic management modal

---

## 13. Full Vision (Phase 2)

Add after MVP is stable:

1. **Kanban board** — 4-column drag-and-drop, mobile tabs
2. **Midnight auto-archive** — Spring `@Scheduled` job for Needs Review
3. **Needs Review column** — with reschedule/done/delete exit paths
4. **Mobile weekly view** — touch-optimized drag (consider `@dnd-kit` for touch support)

---

## 14. Key Libraries

| Purpose | Library |
|---|---|
| Drag and drop | `@dnd-kit/core` + `@dnd-kit/sortable` (touch + mouse support) |
| HTTP client | `axios` with interceptor for token refresh |
| Date handling | `date-fns` |
| State management | Zustand (lightweight, no boilerplate) |
| Form handling | React Hook Form |
| Notifications/toasts | `react-hot-toast` |

---

## 15. Verification Checklist (End-to-End Testing)

- [ ] First run: setup PIN → redirected to `/weekly`
- [ ] Create todo via quick-add in a day cell → appears on that day
- [ ] Open todo card → drawer slides in → edit fields → changes persist on refresh
- [ ] Drag todo to different day → `planned_date` updates → warning shown if past due date
- [ ] Subject created with color → color appears on todo chip in weekly view
- [ ] Delete subject → related todos show as "Uncategorized"
- [ ] Todo with `due_date` yesterday at midnight (or manual trigger) → status becomes `NEEDS_REVIEW`
- [ ] From Kanban: drag NEEDS_REVIEW card to DONE → `completed_at` is set
- [ ] JWT expires → React auto-refreshes token → user stays logged in
- [ ] Mobile (< 768px): Kanban shows tabs not columns; weekly view scrollable
- [ ] CORS: React on 3000 successfully calls Spring Boot on 8080 with no console errors
