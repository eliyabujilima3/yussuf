# Portfolio Backend API

A simple Flask API for handling contact form submissions stored in SQLite. This backend works without a paid cloud database and can run on Render.

## Quick Start

### 1. Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the App
```bash
python app.py
```

Server runs on `http://localhost:5000`

## API Endpoints

### POST /api/contact
Submit a contact form
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

### GET /api/contact/all
Get all contact submissions (admin only)

### GET /api/health
Health check endpoint

## Notes

 On Render, local file storage is ephemeral; saved messages may be lost when the service is redeployed.

## Deployment to Render

1. Push backend to GitHub
2. Connect GitHub repo to Render
3. Deploy from Render

## Frontend Integration

```javascript
const response = await fetch('https://your-api.render.com/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Your Name',
    email: 'your@email.com',
    message: 'Your message'
  })
});
```

If you deploy the frontend on Vercel, set `window.API_BASE` in `frontend/html.html` and `frontend/admin.html` to your backend URL.

Update the CORS origins in `app.py` with your Vercel domain.

## Admin Page

Visit `frontend/admin.html` to view saved messages and reply to them.
The admin page calls `/api/contact/all` and `/api/contact/reply`.

## Optional email replies

To send reply notifications by email, configure SMTP environment variables in Render or `.env`:
```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_USE_TLS=True
EMAIL_FROM=your-email@example.com
```
