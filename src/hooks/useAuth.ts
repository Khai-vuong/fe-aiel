import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
      setUser({ username });
    } else {
      setUser(null);
    }
  }, []);

  return { user };
}
