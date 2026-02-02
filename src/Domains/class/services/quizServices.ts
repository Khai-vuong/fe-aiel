import type { Quiz } from '../types';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Try several likely endpoints and response shapes to fetch quizzes for a class.
 * Returns an array of Quiz or throws an error if none of the endpoints succeed.
 */
export const getQuizzesByClassId = async (classId: string): Promise<Quiz[]> => {
  if (!classId) return [];

  const attempts = [
    `/api/quizzes/class/${encodeURIComponent(classId)}`,
    `/quizzes/class/${encodeURIComponent(classId)}`,
    `/api/quizzes?classId=${encodeURIComponent(classId)}`,
    `/quizzes?classId=${encodeURIComponent(classId)}`,
  ];

  for (const path of attempts) {
    try {
      const res = await fetch(`${API_BASE_URL}${path}`);
      if (!res.ok) continue;
      const json = await res.json().catch(() => null);
      if (!json) continue;

      // Common response shapes: array, { data: [] }, { quizzes: [] }
      if (Array.isArray(json)) return json as Quiz[];
      if (Array.isArray(json.data)) return json.data as Quiz[];
      if (Array.isArray(json.quizzes)) return json.quizzes as Quiz[];

      // If the response is an object with a single array value, try to extract it
      const possible = Object.values(json).find(v => Array.isArray(v));
      if (Array.isArray(possible)) return possible as Quiz[];

      // If none match but object has fields of a single quiz, return it wrapped
      if (json && typeof json === 'object' && json.qid) return [json as Quiz];
    } catch (err) {
      // Try next endpoint
      // eslint-disable-next-line no-console
      console.warn('getQuizzesByClassId attempt failed for', path, err);
    }
  }

  // If we reach here, no endpoint returned usable data
  throw new Error('Failed to fetch quizzes for class');
};
