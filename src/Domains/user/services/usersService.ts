const API_BASE_URL = 'http://localhost:3000';

export interface UpdateProfileData {
  status?: string;
  major?: string;
  personal_info_json?: string;
}

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
