
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Student, Prediction, Subject } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const studentService = {
  async addStudent(student: Student) {
    const path = 'students';
    try {
      return await addDoc(collection(db, path), {
        ...student,
        createdAt: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateStudent(id: string, updates: Partial<Student>) {
    const path = `students/${id}`;
    try {
      await updateDoc(doc(db, 'students', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  listenStudents(callback: (students: Student[]) => void, emailFilter?: string) {
    const path = 'students';
    let q = query(collection(db, path), orderBy('createdAt', 'desc'));
    
    if (emailFilter) {
      q = query(collection(db, path), where('email', '==', emailFilter), orderBy('createdAt', 'desc'));
    }
    
    return onSnapshot(q, (snapshot) => {
      const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      callback(students);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async savePrediction(prediction: Prediction) {
    const path = 'predictions';
    try {
      return await addDoc(collection(db, path), prediction);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getStudentLatestPrediction(studentId: string) {
    const path = 'predictions';
    try {
      const q = query(
        collection(db, path), 
        where('studentId', '==', studentId),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Prediction;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  // Subject Management
  async addSubject(subject: Omit<Subject, 'id'>) {
    const path = 'subjects';
    try {
      return await addDoc(collection(db, path), subject);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateSubject(id: string, updates: Partial<Subject>) {
    const path = `subjects/${id}`;
    try {
      await updateDoc(doc(db, 'subjects', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteSubject(id: string) {
    const path = `subjects/${id}`;
    try {
      await deleteDoc(doc(db, 'subjects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  listenSubjects(callback: (subjects: Subject[]) => void) {
    const path = 'subjects';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const subjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
      callback(subjects);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  }
};
