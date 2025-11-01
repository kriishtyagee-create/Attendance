
import type { AttendanceRecord } from '../types';

// Mock database
const attendanceData: Record<string, AttendanceRecord[]> = {
  '2021UCA1234': [
    { subject: 'Data Structures', attended: 35, total: 40, percentage: 87.5 },
    { subject: 'Algorithms', attended: 38, total: 42, percentage: 90.4 },
    { subject: 'Database Management', attended: 30, total: 40, percentage: 75.0 },
    { subject: 'Operating Systems', attended: 25, total: 38, percentage: 65.8 },
    { subject: 'Discrete Mathematics', attended: 40, total: 42, percentage: 95.2 },
  ],
  '2021UIT5678': [
    { subject: 'Data Structures', attended: 39, total: 40, percentage: 97.5 },
    { subject: 'Algorithms', attended: 41, total: 42, percentage: 97.6 },
    { subject: 'Database Management', attended: 38, total: 40, percentage: 95.0 },
    { subject: 'Operating Systems', attended: 37, total: 38, percentage: 97.3 },
    { subject: 'Discrete Mathematics', attended: 35, total: 42, percentage: 83.3 },
  ],
};

// This function simulates an API call to a real IMS database.
export const getAttendance = async (
  studentId: string,
  subject?: string
): Promise<AttendanceRecord[] | AttendanceRecord | { error: string }> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  // New: Validate the format of the student ID
  const idRegex = /^\d{4}[A-Z]{3}\d{4}$/i;
  if (!idRegex.test(studentId)) {
    return { error: `Invalid Student ID format. Please use the format like '2021UCA1234'.` };
  }
  
  // New: Simulate a specific server error for demonstration
  if (studentId.toUpperCase() === '2021ERR0000') {
      return { error: `A database connection error occurred. Please try again later.` };
  }

  const studentRecords = attendanceData[studentId.toUpperCase()];

  if (!studentRecords) {
    return { error: `No attendance records found for student ID '${studentId}'. Please check the ID and try again.` };
  }

  if (subject) {
    const subjectRecord = studentRecords.find(
      record => record.subject.toLowerCase() === subject.toLowerCase()
    );
    if (!subjectRecord) {
      return { error: `Subject '${subject}' not found for student '${studentId}'. Make sure the subject name is correct.` };
    }
    return subjectRecord;
  }

  return studentRecords;
};
