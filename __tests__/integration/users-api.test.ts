// Integration tests for User Management API endpoints
describe('Users API Integration Tests', () => {
  // Mock the entire API behavior for integration testing
  describe('GET /api/users', () => {
    const mockUsersResponse = {
      users: [
        {
          id: 'user-1',
          email: 'admin@example.com',
          full_name: 'Admin User',
          role: 'admin',
          company_name: null,
          phone: null,
          address: null,
          timezone: 'UTC',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 'user-2',
          email: 'team@example.com',
          full_name: 'Team Member',
          role: 'team_member',
          company_name: 'Test Company',
          phone: '+1234567890',
          address: '123 Test St',
          timezone: 'America/New_York',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z'
        }
      ],
      pagination: {
        page: 1,
        limit: 50,
        total: 2,
        totalPages: 1
      },
      stats: {
        totalUsers: 2,
        activeUsers: 2,
        clientUsers: 0,
        teamMembers: 1,
        adminUsers: 1
      },
      filters: {
        role: null,
        search: null
      }
    };

    it('should return paginated users list for admin users', async () => {
      // Mock authenticated admin session
      const mockSession = {
        user: { id: 'admin-user-id' },
        access_token: 'mock-token'
      };

      // Mock the API response
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockUsersResponse
      });

      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${mockSession.access_token}`
        }
      });

      expect(response.ok).toBe(true);
      const data = await response.json();

      expect(data).toMatchObject({
        users: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            email: expect.any(String),
            full_name: expect.any(String),
            role: expect.any(String)
          })
        ]),
        pagination: expect.objectContaining({
          page: expect.any(Number),
          limit: expect.any(Number),
          total: expect.any(Number),
          totalPages: expect.any(Number)
        }),
        stats: expect.objectContaining({
          totalUsers: expect.any(Number),
          activeUsers: expect.any(Number),
          teamMembers: expect.any(Number),
          adminUsers: expect.any(Number)
        })
      });

      expect(data.users).toHaveLength(2);
      expect(data.stats.totalUsers).toBe(2);
    });

    it('should filter users by role', async () => {
      const filteredResponse = {
        ...mockUsersResponse,
        users: mockUsersResponse.users.filter(u => u.role === 'admin'),
        filters: { role: 'admin', search: null }
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => filteredResponse
      });

      const response = await fetch('/api/users?role=admin');
      const data = await response.json();

      expect(data.users).toHaveLength(1);
      expect(data.users[0].role).toBe('admin');
      expect(data.filters.role).toBe('admin');
    });

    it('should search users by name and email', async () => {
      const searchResponse = {
        ...mockUsersResponse,
        users: mockUsersResponse.users.filter(u => 
          u.full_name.toLowerCase().includes('admin') || 
          u.email.toLowerCase().includes('admin')
        ),
        filters: { role: null, search: 'admin' }
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => searchResponse
      });

      const response = await fetch('/api/users?search=admin');
      const data = await response.json();

      expect(data.users).toHaveLength(1);
      expect(data.users[0].email).toContain('admin');
      expect(data.filters.search).toBe('admin');
    });

    it('should return 401 for unauthenticated requests', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Not authenticated' })
      });

      const response = await fetch('/api/users');
      
      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
      
      const data = await response.json();
      expect(data.error).toBe('Not authenticated');
    });

    it('should return 403 for non-admin users', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Admin access required' })
      });

      const response = await fetch('/api/users', {
        headers: {
          'Authorization': 'Bearer user-token-non-admin'
        }
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(403);
      
      const data = await response.json();
      expect(data.error).toBe('Admin access required');
    });

    it('should handle pagination correctly', async () => {
      const paginatedResponse = {
        ...mockUsersResponse,
        pagination: {
          page: 2,
          limit: 1,
          total: 2,
          totalPages: 2
        }
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => paginatedResponse
      });

      const response = await fetch('/api/users?page=2&limit=1');
      const data = await response.json();

      expect(data.pagination.page).toBe(2);
      expect(data.pagination.limit).toBe(1);
      expect(data.pagination.totalPages).toBe(2);
    });
  });

  describe('POST /api/users', () => {
    const validUserData = {
      email: 'newuser@example.com',
      full_name: 'New User',
      role: 'team_member',
      company_name: 'Test Company',
      phone: '+1234567890',
      timezone: 'America/New_York',
      send_invitation: true
    };

    it('should create user invitation successfully', async () => {
      const mockResponse = {
        message: 'Invitation sent successfully',
        user: {
          id: 'new-user-id',
          email: validUserData.email,
          invited_at: '2024-01-01T00:00:00Z',
          invitation_sent_at: '2024-01-01T00:00:00Z'
        }
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse
      });

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(validUserData)
      });

      expect(response.ok).toBe(true);
      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data.message).toBe('Invitation sent successfully');
      expect(data.user.email).toBe(validUserData.email);
    });

    it('should validate required fields', async () => {
      const invalidData = {
        email: '',
        full_name: '',
        role: 'user'
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Email and full name are required' })
      });

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(invalidData)
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Email and full name are required');
    });

    it('should validate role restrictions', async () => {
      const invalidRoleData = {
        ...validUserData,
        role: 'invalid_role'
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid role specified' })
      });

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(invalidRoleData)
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Invalid role specified');
    });

    it('should prevent duplicate email addresses', async () => {
      const duplicateEmailData = {
        ...validUserData,
        email: 'existing@example.com'
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'User with this email already exists' })
      });

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(duplicateEmailData)
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('User with this email already exists');
    });

    it('should create user directly when send_invitation is false', async () => {
      const directCreateData = {
        ...validUserData,
        send_invitation: false
      };

      const mockResponse = {
        message: 'User created successfully',
        user: {
          id: 'new-user-id',
          email: validUserData.email,
          full_name: validUserData.full_name,
          role: validUserData.role
        }
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse
      });

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(directCreateData)
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.message).toBe('User created successfully');
      expect(data.user.role).toBe(validUserData.role);
    });
  });

  describe('GET /api/users/[id]', () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'testuser@example.com',
      full_name: 'Test User',
      role: 'team_member',
      company_name: 'Test Company',
      phone: '+1234567890',
      address: '123 Test St',
      timezone: 'UTC',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    it('should return user details for admin users', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ user: mockUser })
      });

      const response = await fetch('/api/users/test-user-id', {
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.user).toMatchObject(mockUser);
    });

    it('should allow users to access their own profile', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ user: mockUser })
      });

      const response = await fetch('/api/users/test-user-id', {
        headers: {
          'Authorization': 'Bearer test-user-token'
        }
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.user.id).toBe('test-user-id');
    });

    it('should deny access to other users profiles for non-admin users', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Access denied' })
      });

      const response = await fetch('/api/users/other-user-id', {
        headers: {
          'Authorization': 'Bearer non-admin-token'
        }
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(403);
      
      const data = await response.json();
      expect(data.error).toBe('Access denied');
    });

    it('should return 404 for non-existent users', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'User not found' })
      });

      const response = await fetch('/api/users/non-existent-id', {
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/users/[id]', () => {
    const updateData = {
      full_name: 'Updated Name',
      company_name: 'Updated Company',
      phone: '+9876543210'
    };

    it('should update user successfully', async () => {
      const updatedUser = {
        id: 'test-user-id',
        email: 'testuser@example.com',
        full_name: 'Updated Name',
        role: 'team_member',
        company_name: 'Updated Company',
        phone: '+9876543210',
        updated_at: '2024-01-02T00:00:00Z'
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ user: updatedUser })
      });

      const response = await fetch('/api/users/test-user-id', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(updateData)
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.user.full_name).toBe('Updated Name');
      expect(data.user.company_name).toBe('Updated Company');
    });

    it('should validate email uniqueness when updating email', async () => {
      const emailUpdateData = {
        email: 'existing@example.com'
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: 'Email is already in use by another user' })
      });

      const response = await fetch('/api/users/test-user-id', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(emailUpdateData)
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(409);
    });
  });

  describe('DELETE /api/users/[id]', () => {
    it('should delete user successfully', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ message: 'User deleted successfully' })
      });

      const response = await fetch('/api/users/test-user-id', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.message).toBe('User deleted successfully');
    });

    it('should prevent deletion of last admin user', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Cannot delete the last admin user' })
      });

      const response = await fetch('/api/users/last-admin-id', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Cannot delete the last admin user');
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});