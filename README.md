# QueueCare

QueueCare is a single-clinic token booking and queue management app. The frontend and backend run as separate applications and communicate over HTTP.

## Project layout

- `frontend/` — React, Vite, and TypeScript patient/staff web app.
- `backend/` — FastAPI service and future database/authentication code.
- `docs/REQUIREMENTS_SETUP.md` — product and deployment requirements.
- `docs/UI_UX_PLAN.md` — proposed experience and visual direction.

## Prerequisites

- Node.js 20.19+ (or 22.12+) and npm.
- Python 3.11+.
- Supabase credentials are not needed for the current starter screens. They will be needed when authentication/database integration is implemented.

## Configure local development

Copy each example file to `.env` in its own application folder and adjust values if needed. Local defaults work without Supabase:

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

Local `.env`, `.env.local`, `.env.development`, `.env.production`, and `.envrc` files are ignored by Git, including inside `frontend/` and `backend/`. Only blank `.env.example` templates are intended to be committed. Do not use `git add -f` for local environment files, and do not put private credentials in `frontend/.env`; variables prefixed with `VITE_` are public in the browser bundle. Git ignore rules do not untrack a file that was committed earlier, so check `git status` before pushing.

## Run the backend

In PowerShell, from the repository root:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Health endpoint: `http://127.0.0.1:8000/api/v1/health`  
Interactive API docs: `http://127.0.0.1:8000/docs`

## Run the frontend

Open a second PowerShell terminal from the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). The starter page checks the backend health endpoint and displays whether it is reachable.

## Start both automatically in VS Code

Open the repository folder in VS Code. The workspace task in `.vscode/tasks.json` starts the frontend and backend when the folder opens. On the first open, VS Code may ask whether to allow automatic tasks; choose **Allow** for this workspace. Two task terminals remain open while the servers run. Stop each server with `Ctrl+C` in its terminal, or use **Tasks: Terminate Task** from the Command Palette.

The first automatic start creates the backend virtual environment and installs its requirements. Later starts reuse the environment and reinstall only if `backend/requirements.txt` changes. The frontend uses `npm ci` only when `frontend/node_modules` is missing.

## Production separation

- Deploy `frontend/` as the Vercel project root. Set `VITE_API_BASE_URL` to the deployed FastAPI URL.
- Deploy `backend/` as the Render service root. Build/install from `requirements.txt`; start with `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (Render supplies `PORT`).
- Set backend `CORS_ALLOWED_ORIGINS` to the exact frontend origin, such as `https://your-site.vercel.app`.
- Add secrets only to the backend hosting environment or Supabase dashboard. Do not use service-role or database credentials in Vite variables.

The current starter does not yet connect to Supabase or implement bookings, staff roles, or queue operations.

