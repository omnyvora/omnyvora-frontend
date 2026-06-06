# Project Context — Omnyvora

## Stack
- Python 3.13 · Django 5.2 · DRF 3.16 · PostgreSQL (psycopg3) · Redis · Celery
- JWT via `djangorestframework-simplejwt` (token rotation + blacklist enabled)
- Docker Compose (local: `docker-compose.local.yml`, prod: `docker-compose.prod.yml`)
- Venv: `C:\Users\abdul_m1\Softvence\VENVS\omnyvora\venv`
- Django config package: `my_django/`

## Architecture
Microservice-ready monolith. Each domain = one future microservice.
Request flow: `View → Service → Selector → DB` — never break this chain.
Cross-domain rule: call selectors, never import foreign models.

## Domain Map
```
shared/
  auth/          User model (email-based), JWT register/login/logout/password
  profiles/      Profile (1-to-1 User) — avatar, phone, dob, bio
  otp/           OTP dispatch + verification (registration, password_reset)
  notifications/ In-app notifications per user
  emails/        Email dispatch (Celery tasks)
  logs/          SystemLog model + logging middleware
core/            BaseModel (soft-delete), pagination, response helpers, utils
my_test/         Dev/smoke-test endpoints + Postman files
my_django/       Settings, urls, wsgi, asgi, env_config, celery
```

## Live API Endpoints  `/v1/`
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/` | — | Health report |
| POST | `/v1/otp/get-otp/` | — | purpose: registration / password_reset |
| POST | `/v1/auth/register/` | — | Requires valid OTP |
| POST | `/v1/auth/login/` | — | Returns access + refresh |
| POST | `/v1/auth/logout/` | ✓ | Blacklists refresh token |
| POST | `/v1/auth/token/refresh/` | — | |
| POST | `/v1/auth/token/verify/` | — | |
| GET  | `/v1/auth/verify/` | ✓ | Returns user info |
| POST | `/v1/auth/password/change/` | ✓ | |
| POST | `/v1/auth/password/reset/` | — | Requires OTP |
| GET/PATCH | `/v1/profiles/me/` | ✓ | Get / update own profile |
| GET  | `/v1/notifications/` | ✓ | Paginated list |
| GET  | `/v1/notifications/unread-count/` | ✓ | |
| PATCH | `/v1/notifications/read-all/` | ✓ | |
| PATCH | `/v1/notifications/<id>/read/` | ✓ | |

## Key Models
| Model | App | Notable fields |
|-------|-----|----------------|
| User | shared.auth | email (USERNAME_FIELD), first_name, last_name |
| Profile | shared.profiles | user (O2O), avatar, phone, date_of_birth, bio |
| Notification | shared.notifications | user (FK), title, body, is_read, read_at |
| SystemLog | shared.logs | full structured log with actor, traceback, metadata |

## INSTALLED_APPS order (Shared group)
`shared.auth` → `shared.profiles` → `shared.otp` → `shared.emails` → `shared.notifications` → `shared.logs`

## Conventions
- Services: verb-first (`create_profile`, `update_profile`)
- Selectors: noun/getter (`get_profile_by_user`)
- Responses: always `success_response()` / `error_response()` from `core.utils.response`
- Pagination: `StandardPagination` from `core.utils.pagination` (page_size=50)
- All models inherit `BaseModel` (soft-delete via `deleted_at`)
- App label must differ from name where collision exists (e.g. `label = "authentication"`)

## Postman Files
`my_test/postman/`
- `Omnyvora_API.postman_collection.json`
- `Omnyvora_Localhost.postman_environment.json` — base_url: localhost:8000
- `Omnyvora_BPS.postman_environment.json` — base_url: update to real BPS URL

## Environment Variables (key ones)
`ACCESS_TOKEN_LIFETIME_MINUTES` · `REFRESH_TOKEN_LIFETIME_HOURS`
`OTP_LENGTH` · `OTP_EXPIRY_MINUTES` · `GET_OTP_THROTTLE_RATE_PER_DAY`
`LOGIN_THROTTLE_RATE_PER_MINUTE` · `REGISTER_THROTTLE_RATE_PER_MINUTE`
`DB_*` · `REDIS_URL` · `EMAIL_*`

## Docker
- Container name (web): `dt_web`
- Run migrations: `docker exec dt_web python manage.py migrate`
- Entrypoint auto-runs `makemigrations` + `migrate` when `RUN_MIGRATIONS=1`

## Current State
- Core shared infrastructure complete and working
- `shared/profiles` added — migration generated, needs `docker exec dt_web python manage.py migrate`
- No business domains created yet (accounts, billing, orders, etc.)
- Next: define business domains based on product requirements
