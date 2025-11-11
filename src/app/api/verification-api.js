// app/api/verification-api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class VerificationAPI {
  /**
   * Verify user authentication
   */
  async verifyUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-gym-access`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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