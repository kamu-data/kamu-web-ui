---
name: kamu-ui-github-operations
description: Working with GitHub from Kamu Web UI sessions through the `gh` CLI — PR descriptions, editing PR and issue titles, descriptions and labels, taking screenshots of the real app and attaching them, and the known `gh` failures with their workarounds. Use before any `gh` command that creates or changes a PR or issue, before adding screenshots to a PR, and whenever a `gh` command fails unexpectedly.
---

# GitHub Operations

Use the `gh` CLI. Pushing needs the user's approval for that step
([AGENTS.md, "Hard rules"](../../../AGENTS.md#hard-rules)). Editing a PR or issue other than the
one the session is working on (a merged PR, someone else's issue) is outward-facing too: ask first.

## Known failures and workarounds

| Symptom | Cause | Workaround |
|---|---|---|
| `gh pr edit` fails with `GraphQL: Projects (classic) is being deprecated … (repository.pullRequest.projectCards)` | `gh pr edit` reads the PR's classic project cards, which GitHub's API now refuses; the edit is never sent | Use the REST API, below. `gh pr create` and `gh pr view` are not affected |

### Editing a PR or issue through the REST API

Write the new body to a file in the scratchpad, then send it with `-F body=@<file>`, which avoids
shell quoting of Markdown:

```bash
gh pr view <number> --json body -q .body > <scratchpad>/pr_body.md   # reading still works
# edit the file
gh api -X PATCH repos/kamu-data/kamu-web-ui/pulls/<number> -F body=@<scratchpad>/pr_body.md -q .body
```

The same endpoint takes `-f title=…`. Issues use `repos/kamu-data/kamu-web-ui/issues/<number>`,
which also serves PRs for labels and assignees. `-q .body` prints the body GitHub stored, so the
edit is checked in the same call.

## PR descriptions

Start with `Closes #<issue>` and, when the UI needs an unreleased backend change, the kamu-cli PR
it depends on; such a PR is opened with `--draft` and stays a draft until that change is released.
Then a `### Changes` list and, for visible changes, `### Screenshots`.

When the backend PR changes behaviour while the UI PR is open, re-check the UI against the new
build, and update the description, the screenshots and the issue to match.

## Screenshots

### Taking them

Screenshots show the real app against a real backend, never mocks. Run a kamu-cli build that has
the backend change ([DEVELOPER.md](../../../DEVELOPER.md#running-with-local-gql-server)) in a
scratch workspace and `npm start`, then prepare the state through GraphQL rather than by clicking:

- A single-tenant workspace has the account `kamu` with password `kamu.dev`; the access token
  comes from `mutation { auth { login(loginMethod: PASSWORD, loginCredentialsJson: "{\"login\":\"kamu\",\"password\":\"kamu.dev\"}") { accessToken } } }`.
- Without Puppeteer or Playwright, drive headless Chrome over the DevTools protocol
  (`google-chrome --headless=new --remote-debugging-port=9222`, and Node's built-in `WebSocket`):
  open a target, load the app origin, set `localStorage` key `access_token` (`AppValues.LOCAL_STORAGE_ACCESS_TOKEN`)
  to the token, navigate to the page, wait for it to render, then `Page.captureScreenshot`.
  `Runtime.evaluate` of `document.body.innerText` gives the rendered text to check before looking
  at the image.
- Read each image before attaching it, and stop the servers and Chrome afterwards.

### Attaching them

Images in a PR description or comment are GitHub user attachments, the same as an image dragged
into the web editor. Never commit them, push a branch or open a PR to host them, host them in a
gist, or link them through `raw.githubusercontent.com`: such hosts outlive the PR and clutter the
repository.

Upload each image; the call answers `201` with `{"url": "https://github.com/user-attachments/assets/…"}`:

```bash
curl -s -X POST "https://uploads.github.com/user-attachments/assets?name=shot.png&content_type=image/png&repository_id=$(gh api repos/kamu-data/kamu-web-ui --jq .id)" \
  -H "Authorization: Bearer $(gh auth token)" -H "Accept: application/json" \
  --data-binary @shot.png
```

The upload needs only the repository, not the PR, so upload first and put each `url` into the body
file as a Markdown image with alt text before `gh pr create --body-file`. For an existing PR,
update the body through the REST API, above. To replace a screenshot, upload the new one and
swap the URL in the body.

`gh` 2.99 and later also take `--attach 'path/to/image.png#Alt text'` on `pr create`, `pr edit`
and `pr comment`, but `pr edit` still hits the classic Projects failure. The upload route is the
one verified here.

## Adding to this skill

Add a row to the table when a `gh` command fails in a way that will recur, with the exact error
text so the next session can match it, and the workaround that was verified.
