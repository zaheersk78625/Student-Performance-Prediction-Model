# EduPredict AI - Student Performance Analysis System

A real-time, full-stack application for predicting student performance using Gemini AI.

## Features
- **Student Dashboard**: Live tracking of GPA, attendance, and study hours.
- **AI Prediction**: Real-time grade prediction and personalized study plans powered by Gemini 1.5 Flash.
- **Admin Control**: Complete management of student records and eligibility tracking.
- **Advanced Analytics**: Interactive charts comparison of ML models and attribute correlations.
- **Real-Time Database**: Instant updates across all devices using Firebase Firestore.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Recharts, Lucide Icons, Framer Motion.
- **Backend**: Express, Node.js.
- **AI/ML**: Google Gemini AI (Generative AI SDK).
- **Database**: Firebase Firestore.
- **Auth**: Firebase Authentication.

## Database Schema (Firestore)
### `users`
- `uid`: string (Primary Key)
- `email`: string
- `displayName`: string
- `role`: 'student' | 'admin'
- `createdAt`: number

### `students`
- `id`: string (doc ID)
- `name`: string
- `attendance`: number
- `studyHours`: number
- `internalMarks`: number
- `previousGPA`: number
- `createdAt`: number

### `predictions`
- `studentId`: string (FK)
- `finalScore`: number
- `grade`: string
- `passProbability`: number
- `confidence`: number
- `recommendations`: string[]
- `timestamp`: number

## Setup
1. Configure Firebase in `firebase-applet-config.json`.
2. Ensure `GEMINI_API_KEY` is set in environment secrets.
3. Run `npm install` and `npm run dev`.
