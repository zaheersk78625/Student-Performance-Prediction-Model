import { GoogleGenAI, Type } from "@google/genai";
import { Student, Prediction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function predictPerformance(student: Student): Promise<Prediction> {
  const prompt = `
    Analyze this student's data and predict their performance:
    - Attendance: ${student.attendance}%
    - Study Hours/Day: ${student.studyHours}
    - Internal Marks (out of 100): ${student.internalMarks}
    - Assignments Completed: ${student.assignmentsCompleted}/10
    - Sleep Hours: ${student.sleepHours}
    - Internet Usage: ${student.internetUsage}
    - Previous GPA: ${student.previousGPA}
    - Class Participation: ${student.participationScore}/10
    
    Provide the prediction in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            finalScore: { type: Type.NUMBER, description: "Predicted final percentage" },
            grade: { type: Type.STRING, description: "Letter grade (A+, A, B, C, D, F)" },
            passProbability: { type: Type.NUMBER, description: "Probability of passing (0-1)" },
            confidence: { type: Type.NUMBER, description: "Model confidence percentage (0-100)" },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 actionable study improvements"
            }
          },
          required: ["finalScore", "grade", "passProbability", "confidence", "recommendations"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      ...result,
      studentId: student.id || 'new',
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Prediction Error:", error);
    throw error;
  }
}

export async function getStudyRecommendations(student: Student, prediction: Prediction) {
  const prompt = `
    Student predicted for ${prediction.grade} grade.
    Previous GPA: ${student.previousGPA}.
    Weakness context: ${student.attendance < 75 ? 'Low attendance' : ''} ${student.studyHours < 4 ? 'Low study hours' : ''}.
    Suggest specific areas of improvement and target study hours.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert academic counselor. Provide concise, encouraging advice."
    }
  });
  
  return response.text;
}
