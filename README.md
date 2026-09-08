<div align="center">

# Draw.together

Collaborative workspace for projects, documents, files, and whiteboards.

[Open the live app](https://draw-together-dusky.vercel.app/)

</div>

## Overview

Draw.together is a full-stack Next.js application for organizing project work in one place. Users can create projects, manage files, edit documents, and save whiteboard drawings.

## Features

- Email and password authentication with JWT cookies
- Project and file management
- Document editing with Editor.js
- Whiteboard drawing with Excalidraw
- MongoDB persistence through Mongoose
- PDF and ZIP export for file content
- Protected dashboard and workspace routes
- Responsive interface built with Tailwind CSS

## Tech Stack

- Next.js 15 with the App Router
- React 19 and TypeScript
- MongoDB Atlas and Mongoose
- JWT and bcryptjs authentication
- Tailwind CSS 4
- Editor.js and Excalidraw
- Vercel deployment

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas account, or a local MongoDB instance for development

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/sumit9596/draw_together.git
cd draw_together
npm install
```

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/drawtogether
JWT_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

If the MongoDB password contains special characters, URL-encode them. For example, `@` becomes `%40`.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |

## Deployment

The application can be deployed directly to Vercel:

1. Import the GitHub repository into Vercel.
2. Keep the framework preset as **Next.js**.
3. Add these environment variables for Production, Preview, and Development:

   ```env
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-production-secret
   NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
   ```

4. Deploy the project.
5. After deployment, verify registration, login, project creation, and data persistence.

For MongoDB Atlas, create a database user and configure the Network Access IP list so Vercel can connect. Never commit `.env.local` or expose database credentials in source control.

## Project Structure

```text
app/          Pages, layouts, UI components, and API routes
components/   Shared UI components
lib/          Authentication, database, and utility helpers
models/       Mongoose models for users, projects, and files
public/       Static assets
types/        TypeScript declarations
```

## Security Notes

- Use a unique, long `JWT_SECRET` in production.
- Rotate database credentials if they are ever exposed.
- Keep `.env.local` private; it is excluded by `.gitignore`.
- Use the deployed HTTPS URL for `NEXT_PUBLIC_APP_URL` in Vercel.
