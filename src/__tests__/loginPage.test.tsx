import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/auth/login/page';
import { useAuthContext } from '@/contexts/AuthContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockSignInWithPassword = jest.fn();
  const mockResetError = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useAuthContext as jest.Mock).mockReturnValue({
      signInWithPassword: mockSignInWithPassword,
      isAuthenticated: false,
      user: null,
      resetError: mockResetError,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('handles email login', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({});
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });
  });

  it('shows error for invalid email', async () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'invalid-email' },
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('shows error for missing password', async () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });
});