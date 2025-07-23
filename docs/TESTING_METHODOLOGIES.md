# Testing Methodologies & Strategy

## Project Overview
This document outlines the comprehensive testing strategy for the Monkey LoveStack portfolio website - a Next.js 15 application with TypeScript, Supabase database integration, authentication systems, and complex business logic.

## Testing Philosophy

### Core Principles
- **Test Pyramid**: Focus on unit tests (fast, isolated), integration tests (API/database), and targeted E2E tests
- **Test-Driven Development**: Write tests before or alongside feature development
- **Coverage Goals**: Aim for 80%+ code coverage on critical business logic
- **Real-World Testing**: Use realistic test data and scenarios that mirror production usage
- **Fast Feedback**: Tests should run quickly in development and CI/CD

### Risk-Based Testing Priorities
1. **Critical Path**: Authentication, project management, client data, payment processing
2. **High Risk**: Database operations, API security, role-based access control
3. **Medium Risk**: UI components, form validation, data display
4. **Low Risk**: Static content, styling, non-critical features

## Testing Framework Stack

### Primary Testing Tools
- **Jest**: Unit and integration test runner
- **React Testing Library**: Component testing with user-centric approach
- **Playwright**: End-to-end testing for critical user flows
- **MSW (Mock Service Worker)**: API mocking for isolated component tests
- **@supabase/gotrue-js**: Authentication testing utilities

### Supporting Tools
- **@testing-library/jest-dom**: Enhanced DOM assertions
- **@testing-library/user-event**: Realistic user interaction simulation
- **jest-environment-jsdom**: Browser-like environment for React tests
- **ts-jest**: TypeScript support in Jest
- **@playwright/test**: Modern E2E testing framework

## Test Categories & Structure

### 1. Unit Tests (`__tests__/unit/`)
**Target**: Individual functions, utilities, hooks, and isolated logic
**Location**: Co-located with source files or in dedicated test directories
**Coverage**: 90%+ for utility functions and business logic

```
src/
├── utils/
│   ├── supabase.ts
│   └── __tests__/
│       └── supabase.test.ts
├── lib/
│   ├── server-database.ts
│   └── __tests__/
│       └── server-database.test.ts
```

**Test Examples**:
- Supabase client configuration
- Database query builders
- Utility functions (date formatting, validation)
- Custom React hooks
- Type guards and transformations

### 2. Integration Tests (`__tests__/integration/`)
**Target**: API routes, database operations, and service integrations
**Location**: `__tests__/integration/` directory
**Coverage**: 85%+ for all API endpoints

```
__tests__/
└── integration/
    ├── api/
    │   ├── auth.test.ts
    │   ├── projects.test.ts
    │   ├── clients.test.ts
    │   └── dashboard.test.ts
    └── database/
        ├── projects.test.ts
        └── clients.test.ts
```

**Test Examples**:
- API route handlers with real database calls
- Authentication flows
- Role-based access control
- Database triggers and RLS policies
- Email integration (mocked external services)

### 3. Component Tests (`__tests__/components/`)
**Target**: React components with realistic user interactions
**Location**: Co-located with components
**Coverage**: 75%+ for interactive components

```
src/components/
├── dashboard/
│   ├── CreateProjectModal.tsx
│   └── __tests__/
│       └── CreateProjectModal.test.tsx
└── Navigation.tsx
    └── __tests__/
        └── Navigation.test.tsx
```

**Test Examples**:
- Form submissions and validation
- Modal interactions
- Navigation and routing
- Conditional rendering based on user roles
- Theme switching and responsive behavior

### 4. End-to-End Tests (`e2e/`)
**Target**: Complete user workflows and critical business processes
**Location**: `e2e/` directory in project root
**Coverage**: Key user journeys only

```
e2e/
├── auth/
│   ├── login.spec.ts
│   └── signup.spec.ts
├── dashboard/
│   ├── project-management.spec.ts
│   └── client-management.spec.ts
└── public/
    └── contact-form.spec.ts
```

**Test Examples**:
- User registration and login flows
- Complete project creation workflow
- Client management and team assignments
- Invoice generation and payment tracking
- Dashboard navigation and data visualization

## Database Testing Strategy

### Test Database Setup
- **Separate Test Database**: Isolated Supabase project for testing
- **Schema Migrations**: Automated schema setup and teardown
- **Test Data Seeding**: Consistent, realistic test datasets
- **Transaction Rollback**: Clean state between tests

### Database Test Patterns
```typescript
// Example: Project creation integration test
describe('Project API', () => {
  beforeEach(async () => {
    await seedTestDatabase();
  });
  
  afterEach(async () => {
    await cleanupTestDatabase();
  });
  
  it('should create project with client assignment', async () => {
    // Test implementation
  });
});
```

### Row Level Security (RLS) Testing
- Test user isolation and data access permissions
- Verify admin vs client vs team member access levels
- Test data leakage prevention across client companies

## Authentication Testing

### Session Management Tests
- Token refresh and expiration handling
- Multi-provider authentication (email/password, Google OAuth)
- Session persistence across browser sessions
- Logout and session cleanup

### Role-Based Access Control
- Admin-only endpoints and UI components
- Client data isolation
- Team member permissions
- Route protection and redirects

### Mocking Authentication
```typescript
// Mock authenticated user for component tests
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'admin'
};

jest.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({ user: mockUser, loading: false })
}));
```

## API Testing Strategy

### Request/Response Testing
- HTTP status codes and error handling
- Request validation and sanitization
- Response format consistency
- Rate limiting and security headers

### External Service Mocking
- Gmail API for contact form emails
- OpenAI API for chat assistant
- GitHub API for repository integration
- Payment processing services (future)

### API Test Structure
```typescript
describe('POST /api/projects', () => {
  it('should create project with valid data', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${testToken}`)
      .send(validProjectData)
      .expect(201);
    
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: validProjectData.name,
      status: 'planning'
    });
  });
});
```

## Test Data Management

### Test Data Strategy
- **Factories**: Generate consistent test objects
- **Fixtures**: Static test data for complex scenarios
- **Cleanup**: Automated test data removal
- **Isolation**: No test interdependencies

### Test Data Factories
```typescript
// Example: Project factory
export const createTestProject = (overrides = {}) => ({
  name: 'TEST_Sample Project',
  description: 'Test project description',
  status: 'planning',
  start_date: '2024-01-01',
  client_company_id: 'test-company-id',
  ...overrides
});
```

## Performance Testing

### Load Testing Considerations
- Database query performance under load
- API response times with realistic data volumes
- Memory usage and leak detection
- Concurrent user simulation

### Performance Benchmarks
- API endpoints: < 200ms response time
- Database queries: < 100ms for simple operations
- Page load times: < 2s initial load, < 500ms navigation
- Build and test execution: < 5 minutes total

## Continuous Integration Strategy

### GitHub Actions Workflow
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run Unit Tests
        run: npm run test:unit
      - name: Run Integration Tests
        run: npm run test:integration
      - name: Run E2E Tests
        run: npm run test:e2e
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
```

### Test Environment Setup
- Automated test database provisioning
- Environment variable management
- Parallel test execution
- Artifact collection (screenshots, logs)

## Testing Commands & Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:components": "jest --testPathPattern=components",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

### Jest Configuration
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Install and configure testing dependencies
- [ ] Set up Jest and React Testing Library
- [ ] Create test database configuration
- [ ] Implement basic test utilities and factories
- [ ] Write first unit tests for utility functions

### Phase 2: Core Testing (Week 2)
- [ ] API route integration tests
- [ ] Authentication and authorization tests
- [ ] Database operation tests
- [ ] Basic component tests for critical UI

### Phase 3: Comprehensive Coverage (Week 3)
- [ ] Complete component test suite
- [ ] Advanced integration scenarios
- [ ] Error handling and edge cases
- [ ] Performance and load testing

### Phase 4: E2E & CI/CD (Week 4)
- [ ] Playwright E2E test setup
- [ ] Critical user flow tests
- [ ] GitHub Actions CI/CD pipeline
- [ ] Coverage reporting and quality gates

## Success Metrics

### Coverage Targets
- **Unit Tests**: 90%+ for utilities and business logic
- **Integration Tests**: 85%+ for API endpoints
- **Component Tests**: 75%+ for interactive components
- **E2E Tests**: 100% coverage of critical user flows

### Quality Gates
- All tests must pass before merge
- No decrease in overall coverage
- Performance benchmarks maintained
- Security tests pass for authentication flows

## Maintenance Strategy

### Regular Testing Activities
- Weekly test suite review and updates
- Monthly performance benchmark analysis
- Quarterly testing strategy review
- Annual testing tool evaluation

### Test Debt Management
- Regular refactoring of test code
- Removal of obsolete tests
- Update tests with feature changes
- Documentation updates

---

**Next Steps**: Review this strategy with the development team and begin Phase 1 implementation with foundational testing setup.