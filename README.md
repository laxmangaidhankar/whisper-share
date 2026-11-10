# WhisperShare

WhisperShare is a React/Vite and Express/PostgreSQL application for sharing a
file once with a short access code. The current production-oriented feature is
**Instant Share**. Files are encrypted in the browser before upload, stored as
ciphertext, and consumed after one successful retrieval.

> **Current status:** Instant Share is implemented. The Rooms experience is a
> disabled prototype and must not be treated as production-secure.

## Features

- Browser-side AES-GCM-256 file encryption using the Web Crypto API.
- HKDF-SHA-256 derivation of encryption and claim secrets.
- Six-character access codes using an unambiguous alphabet.
- PostgreSQL storage for encrypted file bytes and protocol metadata.
- HMAC-hashed access-code storage on the server.
- One-time, atomic file consumption.
- Four-hour logical share expiry.
- Filename sanitization and MIME-type validation before download.
- Helmet security headers, CORS configuration, JSON limits, and multipart
  upload validation.
- React UI for upload, code copying, access, automatic download, and error
  handling.

## Architecture

```text
client/  React + Vite frontend
server/  Express API + PostgreSQL persistence
server/migrations/  PostgreSQL schema migrations
```

### Client

- `client/src/main.jsx` mounts the application.
- `client/src/app/App.jsx` defines browser routes.
- `client/src/pages/` contains page-level screens.
- `client/src/components/` contains reusable UI.
- `client/src/hooks/useInstantUpload.js` owns the Instant Share workflow.
- `client/src/services/instantShareApi.js` calls the backend API.
- `client/src/utils/instantShareCrypto.js` implements encryption, key
  derivation, metadata packing, and decryption.
- `client/src/constants/instantShare.js` contains protocol constants and
  frontend limits.

### Server

- `server/server.js` connects to PostgreSQL and starts Express.
- `server/src/app.js` configures middleware, routes, and health checks.
- `server/src/routes/instantShare.routes.js` maps API endpoints.
- `server/src/controllers/` translates HTTP requests into service calls.
- `server/src/services/instantShare.service.js` validates protocol data and
  enforces one-time retrieval.
- `server/src/services/accessCode.service.js` generates and HMAC-hashes codes.
- `server/src/repositories/` contains parameterized PostgreSQL queries.
- `server/src/middlewares/upload.middleware.js` handles in-memory multipart
  uploads.

## Instant Share flow

### Upload

1. The user selects a file in the browser.
2. The browser rejects files larger than 25 MiB.
3. The browser generates a six-character access code.
4. The code and a random 16-byte salt are used to derive an AES-GCM key and a
   claim token.
5. The browser packs file metadata and file bytes, then encrypts the payload
   with a random 12-byte IV.
6. The browser uploads the ciphertext, code, salt, IV, and claim-token hash.
7. The server HMAC-hashes the code and stores the ciphertext and metadata.
8. The server returns the code and expiry timestamp.

The plaintext file and derived AES key are not intentionally uploaded to the
API.

### Retrieval

1. The recipient enters the access code.
2. The client requests the share salt and IV.
3. The client derives the same encryption key and claim token.
4. The client sends the claim token to the content endpoint.
5. PostgreSQL atomically verifies and deletes the share.
6. The server returns ciphertext.
7. The browser decrypts, validates metadata, and downloads the file.

Because deletion occurs before the response is sent, an interrupted download
can consume the share.

## Routes

The API base path is `/api/v1`.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Reports that the API process is running. |
| `POST` | `/instant-share/upload` | Stores an encrypted multipart upload. |
| `GET` | `/instant-share/:code` | Returns salt, IV, scheme, and expiry. |
| `GET` | `/instant-share/:code/content` | Verifies the claim token, consumes the share, and returns ciphertext. |

The upload endpoint expects:

- `encryptedFile`: encrypted file multipart field
- `accessCode`: six-character code
- `salt`: 16 bytes in standard Base64
- `iv`: 12 bytes in standard Base64
- `claimTokenHash`: 64 lowercase hexadecimal characters

The content endpoint expects the derived claim token in the
`X-Share-Token` header.

## Database

The `instant_shares` table stores:

| Column | Purpose |
|---|---|
| `id` | UUID primary key |
| `access_code_hash` | Unique HMAC-SHA-256 lookup value |
| `encrypted_file` | AES-GCM ciphertext |
| `salt` | HKDF salt |
| `iv` | AES-GCM initialization vector |
| `claim_token_hash` | One-time claim authorization value |
| `created_at` | Creation timestamp |
| `expires_at` | Four-hour logical expiry |

The original filename and MIME type are currently stored as fixed encrypted
upload metadata (`encrypted.bin` and `application/octet-stream`); the actual
download metadata is validated from the encrypted payload in the browser.

## Local development

### Prerequisites

- Node.js with npm
- PostgreSQL
- A browser with Web Crypto support

### Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Configure the server

Create `server/.env` with deployment-specific values:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://username:password@localhost:5432/whispershare
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_PRODUCTION=http://localhost:5173
ACCESS_CODE_HMAC_SECRET=replace-with-a-long-random-secret
MAX_UPLOAD_SIZE=100000000
```

Never commit real credentials. The server requires `DATABASE_URL` and
`ACCESS_CODE_HMAC_SECRET` at startup.

### Run migrations

```bash
cd server
npm run migrate:up
```

### Start the API

```bash
cd server
npm run dev
```

The API listens on `http://localhost:3000` by default.

### Configure and start the client

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Then run:

```bash
cd client
npm run dev
```

The Vite development server normally runs on `http://localhost:5173`.

## Available scripts

### Client

```bash
npm run dev       # Start Vite development server
npm run build     # Create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

### Server

```bash
npm start         # Start the API
npm run dev       # Start with nodemon
npm run migrate:up
npm run migrate:down
npm run migrate:create
```

The server test script is currently a placeholder and exits with an error.

## Security model and limitations

The server stores encrypted file bytes and does not normally receive plaintext
file content or the derived AES key. However, the current design sends the raw
access code to the server during upload, and the six-character code is also
used as key material. Therefore:

- Anyone who obtains the code can derive the claim token and encryption key.
- A database or ciphertext leak allows offline guessing of the short code.
- A compromised server, proxy, logger, runtime, or administrator could capture
  the code during upload.
- PostgreSQL backups, WAL, replicas, and already-downloaded files may outlive
  logical share deletion.
- The server currently has no route-level rate limiting.
- Multer can allocate up to the configured default of 100 MiB in memory,
  although the application-level file limit is about 25 MiB plus overhead.
- Expired-row cleanup is implemented but is not started by `server.js`.

For a stronger end-to-end design, generate an independent random 128-bit or
256-bit file key in the browser and keep it out of server requests, preferably
in a URL fragment. Use the short code only as a rate-limited access mechanism.
See [SECURITY.md](./SECURITY.md) for the full review and remediation plan.

## Rooms prototype

Rooms routes are present in the UI, but the feature is disabled through
`ROOM_FEATURE_AVAILABLE = false`. The prototype uses local browser state,
`localStorage`, and same-origin `BroadcastChannel` communication. It does not
provide server authorization, cross-device persistence, or production-grade
network encryption.

Do not enable Rooms for real sensitive data until it is redesigned and
security-tested.

## Operational checklist

- Use HTTPS in every non-local environment.
- Store secrets in deployment secret management, not source control.
- Rotate the database password and HMAC secret if exposure is suspected.
- Configure an explicit CORS allowlist.
- Add rate limits for lookup, claim, and upload endpoints.
- Align multipart and application upload limits.
- Start and monitor expired-share cleanup.
- Define database backup, WAL, replica, and retention policies.
- Add integration tests for malformed inputs, expiry, concurrent claims, and
  tampered ciphertext.
- Run client lint and build checks before deployment.

