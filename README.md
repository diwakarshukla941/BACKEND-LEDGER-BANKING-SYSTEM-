# Backend Ledger

Backend Ledger is a simple banking backend built with Node.js, Express, and MongoDB. It handles user authentication, account creation, balance tracking through ledger entries, fund transfers, and email notifications.

## What This Project Does

- User registration, login, and logout
- JWT-based authentication
- One account per user
- Balance calculation from ledger records
- Money transfer between accounts
- Email notifications using Gmail OAuth2

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT
- bcryptjs
- Nodemailer

## Local Setup

1. Clone the repository.
2. Open the project folder.
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file from `.env.example`.

PowerShell:

```powershell
Copy-Item .env.example .env
```

5. Fill in the `.env` values.
6. Start the server:

```bash
npm run dev
```

The API will run on `http://localhost:3000` unless you change `PORT`.

## Required Environment Variables

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/backend-ledger
JWT_SECRET=replace_with_a_long_random_secret
EMAIL_USER=yourname@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
```

## What Each Env Variable Means

| Variable | Why it is needed | Where to get it |
|---|---|---|
| `PORT` | Port used by the Express server | Set it yourself, for example `3000` |
| `MONGO_URL` | Connects the app to MongoDB | MongoDB Atlas -> Database -> Connect -> Drivers, or your local MongoDB URL |
| `JWT_SECRET` | Signs and verifies JWT tokens | Generate it yourself as a random secret |
| `EMAIL_USER` | Gmail address used to send emails | Your Gmail account |
| `CLIENT_ID` | Google OAuth client ID for Gmail | Google Cloud Console -> APIs & Services -> Credentials |
| `CLIENT_SECRET` | Google OAuth client secret for Gmail | Google Cloud Console -> APIs & Services -> Credentials |
| `REFRESH_TOKEN` | Lets Nodemailer send Gmail without logging in each time | Generate it from OAuth 2.0 Playground after authorizing Gmail access |

## How To Get Each Value

### 1. MONGO_URL

If you are using MongoDB Atlas:

1. Create a MongoDB Atlas project and cluster.
2. Open your cluster.
3. Click `Connect`.
4. Choose `Drivers`.
5. Copy the connection string.
6. Replace username, password, and database name.

Example:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/backend-ledger
```

If you are using local MongoDB:

```env
MONGO_URL=mongodb://127.0.0.1:27017/backend-ledger
```

### 2. JWT_SECRET

Create any long random secret.

Example command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Gmail OAuth Values

You need these three values for email:

- `CLIENT_ID`
- `CLIENT_SECRET`
- `REFRESH_TOKEN`

You also need:

- `EMAIL_USER`

### 4. Steps To Create Google OAuth Credentials

1. Open Google Cloud Console.
2. Create a new project.
3. Go to `APIs & Services`.
4. Open `Library`.
5. Search for `Gmail API`.
6. Enable `Gmail API`.
7. Open `OAuth consent screen`.
8. Configure the app name and email.
9. Go to `Credentials`.
10. Click `Create Credentials`.
11. Choose `OAuth client ID`.
12. Create the client and copy:

- `CLIENT_ID`
- `CLIENT_SECRET`

### 5. Steps To Create REFRESH_TOKEN

1. Open OAuth 2.0 Playground.
2. Click the settings icon.
3. Enable `Use your own OAuth credentials`.
4. Paste your `CLIENT_ID` and `CLIENT_SECRET`.
5. In the scopes box, add:

```text
https://mail.google.com/
```

6. Click `Authorize APIs`.
7. Sign in with the same Gmail account as `EMAIL_USER`.
8. Click `Exchange authorization code for tokens`.
9. Copy the refresh token.
10. Paste it into:

```env
REFRESH_TOKEN=your_google_oauth_refresh_token
```

## Run Commands

```bash
npm install
npm run dev
npm start
```

## Notes

- Keep `.env` private.
- Never push `CLIENT_SECRET`, `REFRESH_TOKEN`, or `JWT_SECRET` to GitHub.
- Use `.env.example` as the safe template for sharing the project.
