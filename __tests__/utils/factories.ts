// Test data factories for creating consistent test objects
import { UserProfile, ClientCompany, ClientContact, Project, TimeEntry } from '@/types/database';

export const createTestUser = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  id: 'test-user-' + Math.random().toString(36).substr(2, 9),
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: null,
  role: 'user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createTestAdmin = (overrides: Partial<UserProfile> = {}): UserProfile => 
  createTestUser({ 
    role: 'admin', 
    full_name: 'Test Admin',
    email: 'admin@example.com',
    ...overrides 
  });

export const createTestClientCompany = (overrides: Partial<ClientCompany> = {}): ClientCompany => ({
  id: 'test-company-' + Math.random().toString(36).substr(2, 9),
  company_name: 'TEST_Sample Company',
  industry: 'Technology',
  website: 'https://test-sample.example.com',
  address: '123 Test Street, Test City, TC 12345',
  phone: '+1 (555) 123-4567',
  email: 'contact@test-sample.example.com',
  billing_address: '123 Test Street, Test City, TC 12345',
  tax_id: 'TEST-123456789',
  status: 'active',
  owner_contact_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createTestClientContact = (overrides: Partial<ClientContact> = {}): ClientContact => ({
  id: 'test-contact-' + Math.random().toString(36).substr(2, 9),
  client_company_id: 'test-company-123',
  full_name: 'TEST_John Doe',
  email: 'john.doe@test-sample.example.com',
  phone: '+1 (555) 123-4567',
  title: 'CEO',
  department: 'Executive',
  role: 'owner',
  is_primary_contact: true,
  can_manage_team: true,
  notes: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createTestProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'test-project-' + Math.random().toString(36).substr(2, 9),
  name: 'TEST_Sample Project',
  description: 'A test project for automated testing purposes',
  status: 'planning',
  start_date: '2024-01-01',
  end_date: '2024-06-30',
  estimated_hours: 160,
  hourly_rate: 125.00,
  fixed_price: null,
  github_repo_url: 'https://github.com/test/test-project',
  github_repo_name: 'test-project',
  github_default_branch: 'main',
  client_id: null, // Legacy field
  client_company_id: 'test-company-123',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createTestTimeEntry = (overrides: Partial<TimeEntry> = {}): TimeEntry => ({
  id: 'test-time-entry-' + Math.random().toString(36).substr(2, 9),
  project_id: 'test-project-123',
  user_id: 'test-user-123',
  hours_worked: 8.0,
  description: 'TEST_Development work on sample feature',
  entry_type: 'development',
  is_billable: true,
  hourly_rate: 125.00,
  date_worked: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

// Test form data factories
export const createTestProjectFormData = (overrides = {}) => ({
  name: 'TEST_New Project',
  description: 'Test project description',
  status: 'planning',
  start_date: '2024-01-01',
  end_date: '2024-06-30',
  estimated_hours: '160',
  hourly_rate: '125.00',
  client_company_id: 'test-company-123',
  github_repo_url: 'https://github.com/test/new-project',
  ...overrides,
});

export const createTestClientCompanyFormData = (overrides = {}) => ({
  company_name: 'TEST_New Company',
  industry: 'Technology',
  website: 'https://test-new.example.com',
  address: '456 New Street, New City, NC 67890',
  phone: '+1 (555) 987-6543',
  email: 'info@test-new.example.com',
  owner_full_name: 'TEST_Jane Smith',
  owner_email: 'jane.smith@test-new.example.com',
  owner_phone: '+1 (555) 987-6544',
  owner_title: 'Founder',
  ...overrides,
});

// Mock API responses
export const mockSupabaseSuccess = <T>(data: T) => ({
  data,
  error: null,
  count: Array.isArray(data) ? data.length : 1,
  status: 200,
  statusText: 'OK',
});

export const mockSupabaseError = (message: string, code = 'PGRST116') => ({
  data: null,
  error: {
    message,
    code,
    details: 'Test error details',
    hint: 'Test error hint',
  },
  count: 0,
  status: 400,
  statusText: 'Bad Request',
});

// Authentication test helpers
export const mockAuthenticatedUser = createTestAdmin();

export const mockAuthSession = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: mockAuthenticatedUser.id,
    email: mockAuthenticatedUser.email,
    email_confirmed_at: new Date().toISOString(),
    phone_confirmed_at: null,
    confirmed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: {
      provider: 'email',
      providers: ['email'],
    },
    user_metadata: {},
    aud: 'authenticated',
    role: 'authenticated',
  },
};

// Component test helpers
export const renderWithAuth = (component: React.ReactElement, userOverrides = {}) => {
  const testUser = { ...mockAuthenticatedUser, ...userOverrides };
  
  // This would be used with a custom render function that provides AuthContext
  return {
    user: testUser,
    // Additional test utilities can be added here
  };
};