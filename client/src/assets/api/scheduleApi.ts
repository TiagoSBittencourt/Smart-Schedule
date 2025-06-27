import type { Subject, Availability, GeneratedSchedule } from '../types';

const API_URL = 'http://127.0.0.1:5000'; // Flask backend URL

interface GeneratePlanPayload {
  subjects: Omit<Subject, 'id'>[]; // Backend do not need 'id'
  availability: Availability;
}

export const generateSchedule = async (payload: GeneratePlanPayload): Promise<GeneratedSchedule> => {
  const response = await fetch(`${API_URL}/api/generate-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Fail to generate schedule.');
  }

  return response.json();
};