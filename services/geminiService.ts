import { GoogleGenAI, Type } from '@google/genai';
import type { FunctionDeclaration } from '@google/genai';
import { getAttendance } from './imsService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getAttendanceFunctionDeclaration: FunctionDeclaration = {
  name: 'getAttendance',
  description: 'Fetches attendance records for a student from the IMS NSIT database.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      studentId: {
        type: Type.STRING,
        description: 'The student\'s university ID number, e.g., 2021UCA1234.',
      },
      subject: {
        type: Type.STRING,
        description: 'The specific subject to get attendance for. If omitted, returns all subjects.',
      },
    },
    required: ['studentId'],
  },
};

export const runConversation = async (prompt: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    let response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        tools: [{ functionDeclarations: [getAttendanceFunctionDeclaration] }],
      },
    });

    const functionCalls = response.functionCalls;

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === 'getAttendance') {
        // Fix: Cast arguments from the function call to their expected types to prevent type errors.
        const { studentId, subject } = call.args as { studentId: string, subject?: string };
        console.log(`Calling IMS service for student: ${studentId}, subject: ${subject || 'all'}`);
        
        const attendanceResult = await getAttendance(studentId, subject);
        
        // Send the result back to the model to generate a natural language response
        response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { text: prompt },
                    { functionCall: call },
                    {
                        functionResponse: {
                            name: 'getAttendance',
                            response: { result: attendanceResult }
                        }
                    }
                ]
            },
            config: {
                tools: [{ functionDeclarations: [getAttendanceFunctionDeclaration] }],
            },
        });
      }
    }
    
    return response.text;

  } catch (error) {
    console.error('Error in Gemini conversation:', error);
    return "I'm sorry, I encountered an error while processing your request. Please check the console for details.";
  }
};
