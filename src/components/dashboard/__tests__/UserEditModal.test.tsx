import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserEditModal from '../UserEditModal';

// Mock user data
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: null,
  role: 'team_member' as const,
  company_name: 'Test Company',
  phone: '+1234567890',
  address: '123 Test Street',
  timezone: 'America/New_York',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

describe('UserEditModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <UserEditModal
        user={mockUser}
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText('Edit User')).not.toBeInTheDocument();
  });

  it('should not render when user is null', () => {
    render(
      <UserEditModal
        user={null}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText('Edit User')).not.toBeInTheDocument();
  });

  it('should render with user data when open', () => {
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByText(`User ID: ${mockUser.id}`)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.full_name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.company_name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.phone)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.address)).toBeInTheDocument();
  });

  it('should show account creation and update dates', () => {
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByText(/Last Updated:/)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // The close button doesn't have a label, so we find it by its position/structure
    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should update form fields when user types', async () => {
    const user = userEvent.setup();
    
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.type(fullNameInput, 'Updated Name');

    expect(fullNameInput).toHaveValue('Updated Name');
  });

  it('should handle role selection', async () => {
    const user = userEvent.setup();
    
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const roleSelect = screen.getByLabelText(/role/i);
    await user.selectOptions(roleSelect, 'admin');

    expect(roleSelect).toHaveValue('admin');
  });

  it('should handle timezone selection', async () => {
    const user = userEvent.setup();
    
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const timezoneSelect = screen.getByLabelText(/timezone/i);
    await user.selectOptions(timezoneSelect, 'Europe/London');

    expect(timezoneSelect).toHaveValue('Europe/London');
  });

  it('should show error for missing required fields', async () => {
    const user = userEvent.setup();
    
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Clear required fields by removing the required attribute temporarily
    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
    const fullNameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    
    // Remove required attribute to bypass HTML5 validation
    emailInput.removeAttribute('required');
    fullNameInput.removeAttribute('required');
    
    await user.clear(emailInput);
    await user.clear(fullNameInput);

    const submitButton = screen.getByRole('button', { name: /update user/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email and full name are required')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with updated data on successful submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);
    
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Update some fields
    const fullNameInput = screen.getByLabelText(/full name/i);
    const companyInput = screen.getByLabelText(/company name/i);
    
    await user.clear(fullNameInput);
    await user.type(fullNameInput, 'Updated User');
    await user.clear(companyInput);
    await user.type(companyInput, 'Updated Company');

    const submitButton = screen.getByRole('button', { name: /update user/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(mockUser.id, {
        email: mockUser.email,
        full_name: 'Updated User',
        role: mockUser.role,
        company_name: 'Updated Company',
        phone: mockUser.phone,
        address: mockUser.address,
        timezone: mockUser.timezone
      });
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void;
    mockOnSubmit.mockImplementation(() => new Promise(resolve => {
      resolveSubmit = resolve;
    }));
    
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /update user/i });
    await user.click(submitButton);

    expect(screen.getByText('Updating...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Resolve the promise to end loading state
    resolveSubmit!();
    
    await waitFor(() => {
      expect(screen.getByText('Update User')).toBeInTheDocument();
    });
  });

  it('should handle submission errors', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockRejectedValue(new Error('Update failed'));
    
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /update user/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to update user. Please try again.')).toBeInTheDocument();
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should show avatar when user has avatar_url', () => {
    const userWithAvatar = {
      ...mockUser,
      avatar_url: 'https://example.com/avatar.jpg'
    };

    render(
      <UserEditModal
        user={userWithAvatar}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const avatar = screen.getByAltText('User avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', userWithAvatar.avatar_url);
    expect(screen.getByText(/Avatar management is handled through/)).toBeInTheDocument();
  });

  it('should populate form with user data when user prop changes', () => {
    const { rerender } = render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const newUser = {
      ...mockUser,
      full_name: 'Different User',
      email: 'different@example.com'
    };

    rerender(
      <UserEditModal
        user={newUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByDisplayValue('Different User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('different@example.com')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(
      <UserEditModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Check for proper form labels
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();

    // Check for required field indicators (asterisks in labels)
    expect(screen.getByText('Email Address *')).toBeInTheDocument();
    expect(screen.getByText('Full Name *')).toBeInTheDocument();
    expect(screen.getByText('Role *')).toBeInTheDocument();
  });

  it('should handle empty/null user fields gracefully', () => {
    const incompleteUser = {
      ...mockUser,
      company_name: null,
      phone: null,
      address: null,
      timezone: null
    };

    render(
      <UserEditModal
        user={incompleteUser}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Should render without errors and show empty inputs
    expect(screen.getByLabelText(/company name/i)).toHaveValue('');
    expect(screen.getByLabelText(/phone number/i)).toHaveValue('');
    expect(screen.getByLabelText(/^address$/i)).toHaveValue('');
    expect(screen.getByLabelText(/timezone/i)).toHaveValue('UTC');
  });
});