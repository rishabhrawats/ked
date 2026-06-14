# KED Production Platform

KED is a moderated marketplace for women-led businesses. The production stack is:

- React 18 + Vite frontend hosted under `/ked-shop/`
- FastAPI API hosted under `/ked-shop/api/`
- MongoDB database `ked_prod`
- Nginx TLS termination and static asset delivery
- PM2-supervised Uvicorn workers on `127.0.0.1:8016`
- Local uploads under `/var/lib/ked/uploads`

## Roles and Workflow

- Visitors browse published sellers, products, services, workshops, and posts.
- Sellers apply with email/password and require Super Admin approval.
- Approved sellers manage only their own profile, products, services, and posts.
- New and edited content remains pending until Super Admin publishes it.
- Product and service inquiries are saved before opening a seller-specific WhatsApp conversation.
- Super Admin manages seller status, profiles, listings, posts, inquiries, and platform settings.

## Local Verification

```bash
cd frontend
npm install
npm run build
npm audit --omit=dev

cd ..
python -m venv .venv
.venv/Scripts/python -m pip install -r backend/requirements.txt
PYTHONPATH=backend .venv/Scripts/python -m pytest backend/test_security.py -q
```

On Linux, replace `.venv/Scripts/python` with `.venv/bin/python`.

## Backend Environment

Copy `backend/.env.example` to `backend/.env`. Required production values:

- `JWT_SECRET`: cryptographically random value with at least 32 characters
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: used only by `bootstrap.py`
- `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, `PUBLIC_PREFIX`, and `UPLOAD_DIR`

Run `python bootstrap.py` to create/update the first Super Admin and import the editable starter catalog. The command is idempotent.

## Production Operations

- Current release: `/opt/ked/current`
- Frontend web root: `/var/www/ked-shop`
- Backend process: `pm2 status ked-backend`
- Health endpoint: `https://edigital-prod.cloud/ked-shop/api/health`
- Nginx validation: `nginx -t`
- Logs: `pm2 logs ked-backend`

Before every release, retain the previous frontend symlink target, backend source, Nginx configuration, MongoDB dump, and `/var/lib/ked/uploads`. Roll back by restoring those artifacts, restarting `ked-backend`, validating Nginx, and reloading it.
