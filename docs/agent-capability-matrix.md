# QA Automation Framework — Agent Capability Matrix

## Agent Capabilities

| Task                     | Healer | Planner | Generator | API Testing | Manual Testing | Code Reviewer |
|--------------------------|--------|---------|-----------|-------------|----------------|---------------|
| Debug failing tests      | ✅     | ❌      | ❌        | ❌          | ❌             | ❌            |
| Create test plans        | ❌     | ✅      | ❌        | ❌          | ❌             | ❌            |
| Write test specs         | ❌     | ❌      | ✅        | ❌          | ❌             | ❌            |
| Scaffold API tests       | ❌     | ❌      | ❌        | ✅          | ❌             | ❌            |
| Generate manual checklists | ❌   | ❌      | ❌        | ❌          | ✅             | ❌            |
| Review test code         | ✅*    | ❌      | ❌        | ❌          | ❌             | ✅            |
| Suggest fixes            | ✅     | ❌      | ❌        | ❌          | ❌             | ✅            |
| Apply fixes              | ✅     | ❌      | ❌        | ❌          | ❌             | ✅*           |
| Cross-browser testing    | ✅     | ✅      | ✅        | ❌          | ❌             | ❌            |
| Performance analysis     | ❌     | ✅      | ✅        | ❌          | ✅             | ❌            |
| Accessibility audit      | ❌     | ✅      | ✅        | ❌          | ✅             | ✅            |

* Can review and optionally fix with explicit user permission

---

## Time Savings by Agent

| Task                           | Manual Time | With Agent | Savings |
|--------------------------------|-------------|------------|---------|
| Debug + fix failing test       | 30-60 min   | 5-10 min   | 85-90%  |
| Create test plan               | 1-2 hours   | 10-15 min  | 90%     |
| Write test specs               | 2-3 hours   | 30-45 min  | 80%     |
| Scaffold API tests             | 1-2 hours   | 15-30 min  | 80%     |
| Code review audit              | 45-90 min   | 5-10 min   | 85%     |
| Create manual checklist        | 2-3 hours   | 5-10 min   | 95%     |
| Full test suite (plan → code → review) | 8-12 hours | 1-2 hours | 85% |

---

## Where to Find Agents/Skills
- **Chatmodes**: `.github/chatmodes/`
- **Skills**: `.github/skills/`
- **Documentation**: `docs/`
