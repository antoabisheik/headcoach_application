// app/api/users-api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class UsersAPI {
  /**
   * Get all users from gyms
   */
  async getUsers(organizationId, gymIds) {
    try {
      console.log('🔵 API Call - getUsers:');
      console.log('  Organization ID:', organizationId);
      console.log('  Gym IDs:', gymIds);
      
      let url = `${API_BASE_URL}/api/admin/users?organizationId=${organizationId}`;
      
      if (gymIds && gymIds.length > 0) {
        const gymIdsJson = JSON.stringify(gymIds);
        url += `&gymIds=${encodeURIComponent(gymIdsJson)}`;
        console.log('  URL:', url);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('  Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('  Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const result = await response.json();
      console.log('  Result:', result);
      
      return result.data;
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get all trainers from gyms
   */
  async getTrainers(organizationId, gymIds) {
    try {
      console.log('🔵 API Call - getTrainers:');
      console.log('  Organization ID:', organizationId);
      console.log('  Gym IDs:', gymIds);
      
      let url = `${API_BASE_URL}/api/admin/trainers?organizationId=${organizationId}`;
      
      if (gymIds && gymIds.length > 0) {
        const gymIdsJson = JSON.stringify(gymIds);
        url += `&gymIds=${encodeURIComponent(gymIdsJson)}`;
        console.log('  URL:', url);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('  Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('  Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch trainers');
      }

      const result = await response.json();
      console.log('  Result:', result);
      
      return result.data;
    } catch (error) {
      console.error('❌ Error fetching trainers:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(organizationId, gymId, userData) {
    try {
      console.log('🔵 API Call - createUser');
      
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          organizationId,
          gymId,
          userData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(userId, organizationId, gymId, userData) {
    try {
      console.log('🔵 API Call - updateUser:', userId);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          organizationId,
          gymId,
          userData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(userId, organizationId, gymId) {
    try {
      console.log('🔵 API Call - deleteUser:', userId);
      
      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}?organizationId=${organizationId}&gymId=${gymId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Assign or remove trainer from user
   */
  async assignTrainer(userId, organizationId, gymId, trainerId) {
    try {
      console.log('🔵 API Call - assignTrainer:', userId, trainerId);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/assign-trainer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          organizationId,
          gymId,
          trainerId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign trainer');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('❌ Error assigning trainer:', error);
      throw error;
    }
  }
}

export default new UsersAPI();