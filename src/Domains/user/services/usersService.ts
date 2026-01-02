import type { RegisterRequestData, RegisterResponse, UpdateProfileData } from '../types';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Register a new user
 */
export const registerUser = async (
  data: RegisterRequestData
): Promise<RegisterResponse> => {
  const res = await fetch(`${API_BASE_URL}/users/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === 400) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }
    throw new Error('Failed to register user');
  }

  return res.json();
};

/**
 * Fetch user profile
 */
export const getUserProfile = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch profile');
  }

  return res.json();
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  uid: string,
  token: string,
  data: UpdateProfileData
) => {
  const res = await fetch(`${API_BASE_URL}/users/update/${uid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update profile');
  }

  return res.json();
};
