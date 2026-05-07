
export interface Student {
  id?: string;
  name: string;
  email: string;
  attendance: number; // percentage
  studyHours: number;
  internalMarks: number;
  assignmentsCompleted: number;
  sleepHours: number;
  internetUsage: string; // 'High', 'Medium', 'Low'
  previousGPA: number;
  participationScore: number;
  createdAt: number;
}

export interface Prediction {
  id?: string;
  studentId: string;
  finalScore: number;
  grade: string;
  passProbability: number;
  recommendations: string[];
  confidence: number;
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'student' | 'admin';
  displayName?: string;
}

export interface Subject {
  id?: string;
  name: string;
  teacherName?: string;
  code: string;
  createdAt: number;
}
