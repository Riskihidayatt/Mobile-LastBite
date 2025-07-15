import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { ThemeContext } from '../../../context/ThemeContext';
import useAuth from '../../../hooks/useAuth';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as yup from 'yup';

// Mock external modules
jest.mock('../../../hooks/useAuth');
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));
jest.mock('yup', () => ({
  object: () => ({
    shape: () => ({
      username: {
        string: () => ({
          required: jest.fn(() => ({})),
        }),
      },
      password: {
        string: () => ({
          min: jest.fn(() => ({
            required: jest.fn(() => ({})),
          })),
        }),
      },
    }),
  }),
}));

describe('LoginScreen', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
    });
    useNavigation.mockReturnValue({
      navigate: mockNavigate,
    });
    useFocusEffect.mockImplementation(React.useEffect); // Mock useFocusEffect to behave like useEffect for tests

    // Mock yup validation to always pass by default
    yup.object().shape().username.string().required.mockReturnValue({
      validate: jest.fn(() => Promise.resolve(true)),
    });
    yup.object().shape().password.string().min().required.mockReturnValue({
      validate: jest.fn(() => Promise.resolve(true)),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginScreen = (theme = 'light') => {
    return render(
      <ThemeContext.Provider value={{ theme }}>
        <LoginScreen />
      </ThemeContext.Provider>
    );
  };

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();
    expect(getByText('Username')).toBeTruthy();
    expect(getByPlaceholderText('yourusername@example.com')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();
    expect(getByPlaceholderText('••••••••')).toBeTruthy();
    expect(getByText('Masuk')).toBeTruthy();
    expect(getByText('Belum punya akun?')).toBeTruthy();
    expect(getByText('Daftar')).toBeTruthy();
  });

  it('updates username and password on text input change', () => {
    const { getByPlaceholderText } = renderLoginScreen();
    const usernameInput = getByPlaceholderText('yourusername@example.com');
    const passwordInput = getByPlaceholderText('••••••••');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');

    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('toggles password visibility', () => {
    const { getByPlaceholderText, getByTestId } = renderLoginScreen();
    const passwordInput = getByPlaceholderText('••••••••');
    const toggleButton = getByTestId('toggle-password-visibility'); // Add testID to TouchableOpacity

    expect(passwordInput.props.secureTextEntry).toBe(true);
    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(false);
    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('shows validation errors for empty fields on login attempt', async () => {
    // Mock yup validation to reject for empty fields
    yup.object().shape().username.string().required.mockReturnValue({
      validate: jest.fn(() => Promise.reject({ message: 'Username wajib diisi.', path: 'username' })),
    });
    yup.object().shape().password.string().min().required.mockReturnValue({
      validate: jest.fn(() => Promise.reject({ message: 'Password wajib diisi.', path: 'password' })),
    });

    const { getByText, getByPlaceholderText } = renderLoginScreen();
    const loginButton = getByText('Masuk');

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Username wajib diisi.')).toBeTruthy();
      expect(getByText('Password wajib diisi.')).toBeTruthy();
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls login function with correct credentials on successful validation', async () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();
    const usernameInput = getByPlaceholderText('yourusername@example.com');
    const passwordInput = getByPlaceholderText('••••••••');
    const loginButton = getByText('Masuk');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');

    mockLogin.mockResolvedValue({ success: true });

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
    });
  });

  it('shows error modal on failed login attempt', async () => {
    const { getByText, getByPlaceholderText, queryByText } = renderLoginScreen();
    const usernameInput = getByPlaceholderText('yourusername@example.com');
    const passwordInput = getByPlaceholderText('••••••••');
    const loginButton = getByText('Masuk');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    mockLogin.mockResolvedValue({ success: false, error: 'Bad credentials' });

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Username atau password yang Anda masukkan salah.')).toBeTruthy();
    });
    expect(queryByText('Gagal masuk !!!')).toBeNull(); // Ensure specific message is shown
  });

  it('shows generic error modal if no specific error message is returned', async () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();
    const usernameInput = getByPlaceholderText('yourusername@example.com');
    const passwordInput = getByPlaceholderText('••••••••');
    const loginButton = getByText('Masuk');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    mockLogin.mockResolvedValue({ success: false, error: null }); // No specific error

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Gagal masuk !!!')).toBeTruthy();
    });
  });

  it('navigates to RegisterTab when Daftar button is pressed', () => {
    const { getByText } = renderLoginScreen();
    const registerButton = getByText('Daftar');

    fireEvent.press(registerButton);

    expect(mockNavigate).toHaveBeenCalledWith('RegisterTab');
  });

  it('disables login button when loading', () => {
    useAuth.mockReturnValue({
      login: mockLogin,
      loading: true,
    });
    const { getByText } = renderLoginScreen();
    const loginButton = getByText('Masuk');
    expect(loginButton.props.accessibilityState.disabled).toBe(true);
  });

  it('disables login button when fields are empty', () => {
    const { getByText } = renderLoginScreen();
    const loginButton = getByText('Masuk');
    expect(loginButton.props.accessibilityState.disabled).toBe(true);
  });

  it('disables login button when there are validation errors', async () => {
    yup.object().shape().username.string().required.mockReturnValue({
      validate: jest.fn(() => Promise.reject({ message: 'Username wajib diisi.', path: 'username' })),
    });
    const { getByText, getByPlaceholderText } = renderLoginScreen();
    const usernameInput = getByPlaceholderText('yourusername@example.com');
    fireEvent.changeText(usernameInput, ''); // Trigger validation error

    await waitFor(() => {
      const loginButton = getByText('Masuk');
      expect(loginButton.props.accessibilityState.disabled).toBe(true);
    });
  });
});