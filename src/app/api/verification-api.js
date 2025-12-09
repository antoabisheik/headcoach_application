// app/api/verification-api.js
import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sbackend.duckdns.org/api';

class VerificationAPI {
  /**
   * Get Firebase ID token for authenticated user
   */
  async getAuthToken() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    return await user.getIdToken();
  }

  /**
   * Verify user authentication
   */
  async verifyUser() {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${API_BASE_URL}/auth/verify-user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify user');
      }

      return data;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  }

  /**
   * Verify user has gym access
   */
  async verifyGymAccess() {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${API_BASE_URL}/auth/verify-gym-access`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok && response.status !== 403) {
        throw new Error(data.error || 'Failed to verify gym access');
      }

      return data;
    } catch (error) {
      console.error('Error verifying gym access:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Try to get token, but don't fail if user is already logged out
      let token = null;
      try {
        token = await this.getAuthToken();
      } catch (e) {
        console.log('No token available for logout');
      }

      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to logout');
      }

      return data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
}

export default new VerificationAPI();