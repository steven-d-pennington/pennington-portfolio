// Test database utilities for setup, cleanup, and mocking
import { createClient } from '@supabase/supabase-js';

// Test Supabase client (uses test environment variables)
export const testSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Database cleanup utilities
export async function cleanupTestData() {
  try {
    // Clean up in reverse order of dependencies to avoid foreign key conflicts
    
    // Clean up time entries
    await testSupabase
      .from('time_entries')
      .delete()
      .like('description', 'TEST_%');
    
    // Clean up project members
    await testSupabase
      .from('project_members')
      .delete()
      .in('project_id', 
        testSupabase.from('projects').select('id').like('name', 'TEST_%')
      );
    
    // Clean up project updates
    await testSupabase
      .from('project_updates')
      .delete()
      .like('title', 'TEST_%');
    
    // Clean up invoice line items
    await testSupabase
      .from('invoice_line_items')
      .delete()
      .in('invoice_id',
        testSupabase.from('invoices').select('id').like('invoice_number', 'TEST_%')
      );
    
    // Clean up invoices
    await testSupabase
      .from('invoices')
      .delete()
      .like('invoice_number', 'TEST_%');
    
    // Clean up projects
    await testSupabase
      .from('projects')
      .delete()
      .like('name', 'TEST_%');
    
    // Clean up client contacts
    await testSupabase
      .from('client_contacts')
      .delete()
      .like('full_name', 'TEST_%');
    
    // Clean up client companies
    await testSupabase
      .from('client_companies')
      .delete()
      .like('company_name', 'TEST_%');
    
    // Clean up test user profiles
    await testSupabase
      .from('user_profiles')
      .delete()
      .like('full_name', 'TEST_%');
    
    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
    throw error;
  }
}

// Database seeding for integration tests
export async function seedTestDatabase() {
  try {
    await cleanupTestData(); // Clean first
    
    // Create test admin user
    const { data: adminUser } = await testSupabase
      .from('user_profiles')
      .insert({
        id: 'test-admin-user',
        email: 'test-admin@example.com',
        full_name: 'TEST_Admin User',
        role: 'admin'
      })
      .select()
      .single();
    
    // Create test regular user
    const { data: regularUser } = await testSupabase
      .from('user_profiles')
      .insert({
        id: 'test-regular-user',
        email: 'test-user@example.com',
        full_name: 'TEST_Regular User',
        role: 'user'
      })
      .select()
      .single();
    
    // Create test client company
    const { data: clientCompany } = await testSupabase
      .from('client_companies')
      .insert({
        company_name: 'TEST_Integration Company',
        industry: 'Technology',
        email: 'contact@test-integration.example.com',
        status: 'active'
      })
      .select()
      .single();
    
    // Create owner contact for the company
    const { data: ownerContact } = await testSupabase
      .from('client_contacts')
      .insert({
        client_company_id: clientCompany.id,
        full_name: 'TEST_Company Owner',
        email: 'owner@test-integration.example.com',
        role: 'owner',
        is_primary_contact: true,
        can_manage_team: true
      })
      .select()
      .single();
    
    // Update company with owner contact ID
    await testSupabase
      .from('client_companies')
      .update({ owner_contact_id: ownerContact.id })
      .eq('id', clientCompany.id);
    
    // Create test project
    const { data: project } = await testSupabase
      .from('projects')
      .insert({
        name: 'TEST_Integration Project',
        description: 'Project for integration testing',
        status: 'active',
        start_date: '2024-01-01',
        estimated_hours: 100,
        hourly_rate: 125.00,
        client_company_id: clientCompany.id
      })
      .select()
      .single();
    
    // Add project member
    await testSupabase
      .from('project_members')
      .insert({
        project_id: project.id,
        user_id: adminUser.id,
        role: 'lead',
        can_track_time: true,
        can_view_financials: true
      });
    
    return {
      adminUser,
      regularUser,
      clientCompany,
      ownerContact,
      project
    };
    
  } catch (error) {
    console.error('❌ Error seeding test database:', error);
    throw error;
  }
}

// Mock Supabase responses for unit tests
export class MockSupabaseClient {
  private mockData: Record<string, any[]> = {};
  private mockErrors: Record<string, any> = {};

  setMockData(table: string, data: any[]) {
    this.mockData[table] = data;
  }

  setMockError(operation: string, error: any) {
    this.mockErrors[operation] = error;
  }

  from(table: string) {
    return new MockSupabaseQuery(table, this.mockData, this.mockErrors);
  }

  auth = {
    getSession: jest.fn().mockResolvedValue({
      data: { session: null },
      error: null
    }),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } }
    }))
  };
}

class MockSupabaseQuery {
  private table: string;
  private mockData: Record<string, any[]>;
  private mockErrors: Record<string, any>;
  private filters: Array<{ column: string; operator: string; value: any }> = [];
  private selectFields = '*';
  private singleResult = false;

  constructor(table: string, mockData: Record<string, any[]>, mockErrors: Record<string, any>) {
    this.table = table;
    this.mockData = mockData;
    this.mockErrors = mockErrors;
  }

  select(fields = '*') {
    this.selectFields = fields;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }

  like(column: string, pattern: string) {
    this.filters.push({ column, operator: 'like', value: pattern });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ column, operator: 'in', value: values });
    return this;
  }

  single() {
    this.singleResult = true;
    return this;
  }

  insert(data: any) {
    // Mock insert - return the data with an ID
    const result = Array.isArray(data) 
      ? data.map(item => ({ ...item, id: `mock-id-${Math.random()}` }))
      : { ...data, id: `mock-id-${Math.random()}` };
    
    return Promise.resolve({
      data: result,
      error: this.mockErrors['insert'] || null,
      count: Array.isArray(result) ? result.length : 1,
      status: this.mockErrors['insert'] ? 400 : 201,
      statusText: this.mockErrors['insert'] ? 'Bad Request' : 'Created',
    });
  }

  update(data: any) {
    return Promise.resolve({
      data: this.applyFilters(),
      error: this.mockErrors['update'] || null,
      count: 1,
      status: this.mockErrors['update'] ? 400 : 200,
      statusText: this.mockErrors['update'] ? 'Bad Request' : 'OK',
    });
  }

  delete() {
    return Promise.resolve({
      data: null,
      error: this.mockErrors['delete'] || null,
      count: 1,
      status: this.mockErrors['delete'] ? 400 : 204,
      statusText: this.mockErrors['delete'] ? 'Bad Request' : 'No Content',
    });
  }

  // Simulate query execution for select operations
  then(resolve: (value: any) => void) {
    const result = {
      data: this.applyFilters(),
      error: this.mockErrors[this.table] || null,
      count: this.mockData[this.table]?.length || 0,
      status: this.mockErrors[this.table] ? 400 : 200,
      statusText: this.mockErrors[this.table] ? 'Bad Request' : 'OK',
    };

    resolve(result);
    return this;
  }

  catch(reject: (error: any) => void) {
    return this;
  }

  private applyFilters() {
    let data = this.mockData[this.table] || [];
    
    // Apply filters
    for (const filter of this.filters) {
      data = data.filter(item => {
        const value = item[filter.column];
        switch (filter.operator) {
          case 'eq':
            return value === filter.value;
          case 'like':
            return value && value.includes(filter.value.replace('%', ''));
          case 'in':
            return filter.value.includes(value);
          default:
            return true;
        }
      });
    }
    
    return this.singleResult ? data[0] || null : data;
  }
}

export const createMockSupabaseClient = () => new MockSupabaseClient();