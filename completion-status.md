# TodoPlanner — Feature Completion Status

**Last Updated:** 2026-03-12

---

## Summary

| Status | Count |
|--------|-------|
| ✅ Completed | 8 |
| 🔄 In Progress | 0 |
| ⏳ Pending | 0 |

---

## Feature Details

| # | Feature | Status | Commit | Details |
|---|---------|--------|--------|---------|
| F1 | Project Scaffolding & Infrastructure | ✅ Complete | ADO#1 | Spring Boot 3.2 + Maven, CORS, ApiResponse<T>, HealthController, Vite+React18, Tailwind, all npm packages, base routing |
| F2 | Authentication (PIN + JWT) | ✅ Complete | ADO#2 | UserConfig entity, JwtUtil (15min access / 7d refresh), AuthService (bcrypt, token rotation), AuthController (5 endpoints), JwtAuthFilter, SecurityConfig, PinLogin UI, authStore, ProtectedRoute, axios 401 interceptor |
| F3 | Subject CRUD | ✅ Complete | ADO#3 | Subject entity + CRUD, cascade NULL on delete, SubjectManager modal w/ color picker, SubjectChip badge |
| F4 | Todo CRUD | ✅ Complete | ADO#4 | Todo entity (all SPEC fields), TodoRepository (JPQL filters), TodoService (completedAt on DONE), 7 REST endpoints, TodoDrawer slide-in w/ all fields + conflict warning, PriorityBadge |
| F5 | Weekly View | ✅ Complete | ADO#5 | useWeek hook (date-fns), 7-column desktop grid, mobile scroll-snap, DayCell, draggable TodoCard (@dnd-kit), QuickAddBar (Enter to create), drag→PATCH planned-date optimistic, amber conflict badge |
| F6 | Kanban Board | ✅ Complete | ADO#6 | 4-column desktop DnD, KanbanColumn + KanbanCard, drag→PATCH status optimistic, NEEDS_REVIEW→TODO opens drawer, mobile tab layout |
| F7 | Midnight Auto-Archive | ✅ Complete | ADO#7 | ScheduledTasks @Scheduled(cron "0 1 0 * * *"), archiveOverdueTodos JPQL update, KanbanPage toast on NEEDS_REVIEW count |
| F8 | Mobile Polish | ✅ Complete | ADO#8 | TouchSensor on all DnD, weekly mobile scroll-snap, loading spinners, empty states w/ icons, keyboard arrow nav |

---

## Verification Checklist

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

## How to Run

### 1. Start MySQL (XAMPP Control Panel)

### 2. Backend
```bash
cd backend
./mvnw spring-boot:run
# → http://localhost:8080
```

### 3. Frontend
```bash
cd frontend
npm run dev
# → http://localhost:3000
```
