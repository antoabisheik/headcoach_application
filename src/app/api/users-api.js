// app/api/users-api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sbackend.duckdns.org/api';

class UsersAPI {
  /**
   * Get all users from gyms
   */
  async getUsers(organizationId, gymIds) {
    try {
      console.log('========================================');
      console.log(' FETCHING USERS');
      console.log('========================================');
      console.log('Organization ID (type):', organizationId, `(${typeof organizationId})`);
      console.log('Gym IDs:', gymIds);
      console.log('Gym IDs (stringified):', JSON.stringify(gymIds));
      
      let url = `${API_BASE_URL}/admin/users?organizationId=${organizationId}`;
      
      if (gymIds && gymIds.length > 0) {
        const gymIdsJson = JSON.stringify(gymIds);
        url += `&gymIds=${encodeURIComponent(gymIdsJson)}`;
      }
      
      console.log('Full URL:', url);
      console.log('========================================');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const result = await response.json();
      console.log('Success! Result:', result);
      console.log('Users data:', result.data);
      console.log('========================================\n');
      
      return result.data;
    } catch (error) {
      console.error(' FETCH USERS ERROR:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  /**
   * Get all trainers from gyms
   */
  async getTrainers(organizationId, gymIds) {
    try {
      console.log('========================================');
      console.log('FETCHING TRAINERS');
      console.log('========================================');
      console.log('Organization ID (type):', organizationId, `(${typeof organizationId})`);
      console.log('Gym IDs:', gymIds);
      
      let url = `${API_BASE_URL}/admin/trainers?organizationId=${organizationId}`;
      
      if (gymIds && gymIds.length > 0) {
        const gymIdsJson = JSON.stringify(gymIds);
        url += `&gymIds=${encodeURIComponent(gymIdsJson)}`;
      }
      
      console.log('Full URL:', url);
      console.log('========================================');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch trainers');
      }

      const result = await response.json();
      console.log('Success! Trainers:', result.data.length);
      console.log('========================================\n');
      
      return result.data;
    } catch (error) {
      console.error('FETCH TRAINERS ERROR:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(organizationId, gymId, userData) {
    try {
      console.log('========================================');
      console.log('CREATING USER');
      console.log('========================================');
      console.log('Organization ID:', organizationId, `(${typeof organizationId})`);
      console.log('Gym ID:', gymId);
      console.log('User Data:', userData);
      console.log('========================================');
      
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
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

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to create user');
      }

      const result = await response.json();
      console.log('User created successfully!');
      console.log('Result:', result);
      console.log('========================================\n');
      
      return result.data;
    } catch (error) {
      console.error('CREATE USER ERROR:', error);
      throw error;
    }
  }

  // Keep other methods the same...
  async updateUser(userId, organizationId, gymId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
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
      console.error(' Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId, organizationId, gymId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}?organizationId=${organizationId}&gymId=${gymId}`,
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
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async assignTrainer(userId, organizationId, gymId, trainerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/assign-trainer`, {
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
      console.error('Error assigning trainer:', error);
      throw error;
    }
  }
}

export default new UsersAPI();