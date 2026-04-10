# Implementation Workflow — How We Work With Claude Code

Đây là quy trình làm việc chuẩn cho dự án này. Mỗi developer (và Claude) phải follow workflow này.

---

## Workflow Nhận Task Mới

```
1. Đọc requirements (docs/specs/) + design (docs/Designs/)
        │
        ▼
2. Tạo/cập nhật Implementation Plan (docs/plans/)
   → claude --permission-mode plan "Tạo plan cho [feature]"
   → Human review, correct, approve
   → Lưu file plan, set status = APPROVED
        │
        ▼
3. Bắt đầu session có tên
   → claude -n "PLAN-00X-[feature-name]"
   → "Implement theo plan tại docs/plans/PLAN-00X.md. Bắt đầu Task 1"
        │
        ▼
4. Implement từng task
   → Checkpoints tự động sau mỗi prompt (Esc+Esc để rewind nếu cần)
   → Security-check skill tự kích hoạt khi code auth/
   → Hooks tự format TypeScript sau mỗi file write
        │
        ▼
5. Viết tests
   → "/write-tests" hoặc nhờ test-engineer subagent
        │
        ▼
6. Review trước khi commit
   → "/review-pr" để code-reviewer subagent kiểm tra
   → Sửa issues tìm thấy
        │
        ▼
7. Commit & Push
   → "/commit" để tạo conventional commit message
   → Hook tự chạy lint + tests trước khi push
        │
        ▼
8. Update plan status → DONE
```

---

## Git Branch Strategy

```
main
└── feat/PLAN-001-backend-foundation
└── feat/PLAN-002-auth
└── feat/PLAN-005-frontend-setup
...
```

**Naming convention**: `feat/PLAN-00X-short-description`

---

## Commit Convention

Format: `type(scope): description`

| Type | Khi nào dùng |
|------|-------------|
| `feat` | Thêm feature mới |
| `fix` | Sửa bug |
| `test` | Thêm/sửa tests |
| `refactor` | Refactor không thay đổi behaviour |
| `docs` | Cập nhật documentation |
| `chore` | Setup, config, tooling |

**Scope**: `auth`, `dashboard`, `orders`, `frontend`, `backend`, `docs`

**Examples**:
```
feat(auth): add JWT login endpoint with 15min access token
fix(orders): correct pagination offset calculation
test(dashboard): add unit tests for computeStats service
docs(plans): approve PLAN-002 auth implementation
```

---

## Khi Nào Dùng Công Cụ Nào

| Tình huống | Làm gì |
|-----------|--------|
| Nhận task mới, chưa biết bắt đầu | `claude --permission-mode plan` |
| Muốn thử 2 cách implement | Dùng Checkpoints (Esc+Esc để rewind) |
| Cần commit | Gõ `/commit` |
| Trước khi tạo PR | Gõ `/review-pr` |
| Có bug không fix được sau 15 phút | Nhờ `debugger` subagent |
| Cần viết tests | Nhờ `test-engineer` subagent |
| Đang code auth/security code | `security-check` skill tự kích hoạt |
| Requirements thay đổi | Update plan file → commit → code |

---

## Cấu Trúc Claude Code

```
.claude/
├── CLAUDE.md (= project memory, tự động load mỗi session)
├── skills/
│   ├── commit/SKILL.md
│   ├── review-pr/SKILL.md
│   ├── debug/SKILL.md
│   ├── write-tests/SKILL.md
│   └── security-check/SKILL.md
├── agents/
│   ├── code-reviewer.md
│   ├── test-engineer.md
│   └── debugger.md
└── settings.json (hooks config)
```

---

## Definition of Done

Một task được coi là DONE khi:
- [ ] Code implement đúng requirements
- [ ] Unit tests viết và pass
- [ ] `/review-pr` không còn CRITICAL hoặc HIGH issues
- [ ] Lint pass (`npm run lint`)
- [ ] Manual test trên local browser
- [ ] Plan file updated: status → DONE
