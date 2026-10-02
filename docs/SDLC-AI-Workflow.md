# SDLC-AI-Workflow

| # | Phase | Who or what | Input | Output |
|---|-------|-------------|-------|--------|
| 1 | Requirements | Jira (`mcp__jira`), BA/PO | Idea or request | Jira story with acceptance criteria (e.g. CCD-37) |
| 2 | Analysis and plan | Claude Code plan mode, `Plan` agent | Ticket | Implementation plan, affected files, risks |
| 3 | Development | Claude Code, `3-development-review-assistant` agent | Plan | Feature branch and code |
| 4 | Testing | Playwright | Acceptance criteria | UI tests (e.g. CCD-20), passing locally |
| 5 | Review | `/code-review`, `/security-review` | Diff | Findings fixed, or accepted with a reason |
| 6 | Commit and PR | Claude Code, `gh` | Reviewed diff | Commit `feat(CCD-xx): ...` and a PR linked to the ticket |
| 7 | Release | CI, human approval | Merged PR | Deployed build |
| 8 | Feedback | Jira comment, `/codemie-catchup` | Released change | Ticket moved to Done, docs updated |

## Flow

```
Jira ticket -> Plan -> Branch -> Code -> Playwright tests
     ^                                        |
  Feedback <- Release <- PR <- Review (code + security)
```

## Rules

- **Human gates:** a person approves the plan (phase 2), the PR merge (phase 6) and the release (phase 7). The AI never pushes or merges on its own.
- **Ticket key everywhere:** it goes in the branch name, the commit message and the PR title.
- **Dev assistant calls:** use one `--conversation-id` per task, for example `3-development-review-assistant-CCD-37`. Send the full payload in a single message, then re-fetch to verify the write.
- **Definition of done:** tests pass, review findings are resolved, the Jira ticket is transitioned and a comment is added.

## Example run (CCD-37)

```bash
# 1-2: read ticket, plan
# 3: implement
codemie assistants chat "795441d2-6958-477f-aa43-b982663a0928" \
  --conversation-id "3-development-review-assistant-CCD-37" "Implement PDF brochure download"
# 4: npx playwright test
# 5: /code-review, then /security-review
# 6: git commit -m "feat(CCD-37): generate a real PDF for Download Brochure"
# 8: transition CCD-37 to Done and add a comment
```
