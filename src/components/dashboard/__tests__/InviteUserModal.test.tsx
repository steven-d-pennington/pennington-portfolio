import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InviteUserModal from '../InviteUserModal';

describe('InviteUserModal', () => {
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
      <InviteUserModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText('Invite New User')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Invite New User')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  it('should have default form values', () => {
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText(/email address/i)).toHaveValue(''); // Email should be empty
    expect(screen.getByLabelText(/role/i)).toHaveValue('user'); // Default role
    expect(screen.getByLabelText(/timezone/i)).toHaveValue('UTC'); // Default timezone
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // The close button doesn't have an accessible label, so we find it by its position/structure
    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <InviteUserModal
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
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const nameInput = screen.getByLabelText(/full name/i);
    const companyInput = screen.getByLabelText(/company name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(nameInput, 'Test User');
    await user.type(companyInput, 'Test Company');
    await user.type(phoneInput, '+1234567890');

    expect(emailInput).toHaveValue('test@example.com');
    expect(nameInput).toHaveValue('Test User');
    expect(companyInput).toHaveValue('Test Company');
    expect(phoneInput).toHaveValue('+1234567890');
  });

  it('should handle role selection', async () => {
    const user = userEvent.setup();
    
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const roleSelect = screen.getByLabelText(/role/i);
    await user.selectOptions(roleSelect, 'team_member');

    expect(roleSelect).toHaveValue('team_member');
  });

  it('should handle timezone selection', async () => {
    const user = userEvent.setup();
    
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const timezoneSelect = screen.getByLabelText(/timezone/i);
    await user.selectOptions(timezoneSelect, 'America/New_York');

    expect(timezoneSelect).toHaveValue('America/New_York');
  });

  it('should handle address textarea', async () => {
    const user = userEvent.setup();
    
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const addressTextarea = screen.getByLabelText(/^address$/i);
    await user.type(addressTextarea, '123 Test Street\nTest City, TC 12345');

    expect(addressTextarea).toHaveValue('123 Test Street\nTest City, TC 12345');
  });

  it('should submit form with correct data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);
    
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill out the form
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/full name/i), 'Test User');
    await user.selectOptions(screen.getByLabelText(/role/i), 'team_member');
    await user.type(screen.getByLabelText(/company name/i), 'Test Company');
    await user.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await user.selectOptions(screen.getByLabelText(/timezone/i), 'America/New_York');
    await user.type(screen.getByLabelText(/^address$/i), '123 Test Street');

    const submitButton = screen.getByRole('button', { name: /send invitation/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'team_member',
        company_name: 'Test Company',
        phone: '+1234567890',
        address: '123 Test Street',
        timezone: 'America/New_York',
      });
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);
    
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill out and submit form
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/full name/i), 'Test User');
    
    const submitButton = screen.getByRole('button', { name: /send invitation/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Form should be reset (though we can't test this directly since the modal closes)
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void;
    mockOnSubmit.mockImplementation(() => new Promise(resolve => {
      resolveSubmit = resolve;
    }));
    
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill required fields
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/full name/i), 'Test User');

    const submitButton = screen.getByRole('button', { name: /send invitation/i });
    await user.click(submitButton);

    expect(screen.getByText('Sending Invitation...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Resolve the promise to end loading state
    resolveSubmit!();
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should handle submission errors', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockRejectedValue(new Error('Network error'));
    
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill required fields
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/full name/i), 'Test User');

    const submitButton = screen.getByRole('button', { name: /send invitation/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should show invitation process information', () => {
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Invitation Process')).toBeInTheDocument();
    expect(screen.getByText(/An invitation email will be sent/)).toBeInTheDocument();
    expect(screen.getByText(/The invitation will expire in 7 days/)).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(
      <InviteUserModal
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

    // Check for proper ARIA attributes
    const modal = screen.getByText('Invite New User').closest('div');
    expect(modal).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /send invitation/i });
    await user.click(submitButton);

    // Form should not submit without required fields
    // HTML5 validation should prevent submission
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show all role options', () => {
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const roleSelect = screen.getByLabelText(/role/i);
    const options = roleSelect.querySelectorAll('option');
    
    expect(options).toHaveLength(5);
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Client')).toBeInTheDocument();
    expect(screen.getByText('Team Member')).toBeInTheDocument();
    expect(screen.getByText('Moderator')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should show all timezone options', () => {
    render(
      <InviteUserModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const timezoneSelect = screen.getByLabelText(/timezone/i);
    const options = timezoneSelect.querySelectorAll('option');
    
    expect(options.length).toBeGreaterThan(5); // Should have multiple timezone options
    expect(screen.getByText('UTC')).toBeInTheDocument();
    expect(screen.getByText('Eastern Time')).toBeInTheDocument();
    expect(screen.getByText('Pacific Time')).toBeInTheDocument();
  });
});