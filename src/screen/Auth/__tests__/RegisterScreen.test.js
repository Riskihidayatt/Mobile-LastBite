import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../RegisterScreen';
import { ThemeContext } from '../../../context/ThemeContext';
import useAuth from '../../../hooks/useAuth';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as yup from 'yup';
import { Alert, Keyboard } from 'react-native';

// Mock external modules
jest.mock('../../../hooks/useAuth');
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { High: 'high' },
}));
jest.mock('react-native-maps', () => 'MapView');
jest.mock('../../../components/common/ResponseModal', () => 'ResponseModal');
jest.mock('../../../components/common/ModalConfirm', () => 'ModalConfirm');
jest.mock('../Screen', () => 'Screen');

// Mock yup for validation
jest.mock('yup', () => ({
  object: () => ({
    shape: jest.fn(() => ({
      email: {
        string: () => ({
          email: jest.fn(() => ({
            required: jest.fn(() => ({})),
          })),
        }),
      },
      username: {
        string: () => ({
          min: jest.fn(() => ({
            required: jest.fn(() => ({})),
          })),
        }),
      },
      phoneNumber: {
        string: () => ({
          matches: jest.fn(() => ({
            min: jest.fn(() => ({
              required: jest.fn(() => ({})),
            })),
          })),
        }),
      },
      fullName: {
        string: () => ({
          min: jest.fn(() => ({
            required: jest.fn(() => ({})),
          })),
        }),
      },
      password: {
        string: () => ({
          min: jest.fn(() => ({
            required: jest.fn(() => ({})),
          })),
        }),
      },
      confirmPassword: {
        string: () => ({
          oneOf: jest.fn(() => ({
            required: jest.fn(() => ({})),
          })),
        }),
      },
      longitude: {
        number: () => ({
          required: jest.fn(() => ({})),
        }),
      },
      latitude: {
        number: () => ({
          required: jest.fn(() => ({})),
        }),
      },
    })),
    validate: jest.fn(() => Promise.resolve(true)), // Default to valid
    reach: jest.fn((schema, fieldName) => ({
      validate: jest.fn(() => Promise.resolve(true)), // Default to valid
    })),
  }),
  ref: jest.fn((key) => ({ key })),
}));

describe('RegisterScreen', () => {
  const mockRegister = jest.fn();
  const mockNavigate = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      register: mockRegister,
    });
    useNavigation.mockReturnValue({
      navigate: mockNavigate,
      replace: mockReplace,
    });
    useFocusEffect.mockImplementation(React.useEffect); // Mock useFocusEffect to behave like useEffect for tests
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: -6.175392, longitude: 106.816666 },
    });
    Alert.alert = jest.fn(); // Mock Alert.alert
    Keyboard.dismiss = jest.fn(); // Mock Keyboard.dismiss

    // Reset yup mocks for each test
    yup.object().shape().email.string().email().required.mockReturnValue({ validate: jest.fn(() => Promise.resolve(true)) });
    yup.object().shape().username.string().min().required.mockReturnValue({ validate: jest.fn(() => Promise.resolve(true)) });
    yup.object().shape().phoneNumber.string().matches().min().required.mockReturnValue({ validate: jest.fn(() => Promise.resolve(true)) });
    yup.object().shape().fullName.string().min().required.mockReturnValue({ validate: jest.fn(() => Promise.resolve(true)) });
    yup.object().shape().password.string().min().required.mockReturnValue({ validate: jest.fn(() => Promise.resolve(true)) });
    yup.object().shape().confirmPassword.string().oneOf().required.mockReturnValue({ validate: jest.fn(() => Promise.resolve(true)) });
    yup.object().shape().longitude.number().required.mockReturnValue({ validate: jest.fn(() => Promise.resolve(true)) });
    yup.object().shape().latitude.number().required.mockReturnValue({ validate: jest.fn(() => Promise.resolve(true)) });
    yup.object().validate.mockResolvedValue(true);
    yup.object().reach.mockReturnValue({
      validate: jest.fn(() => Promise.resolve(true)),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderRegisterScreen = (theme = 'light') => {
    return render(
      <ThemeContext.Provider value={{ theme }}>
        <RegisterScreen />
      </ThemeContext.Provider>
    );
  };

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = renderRegisterScreen();
    expect(getByText('Form Pendaftaran')).toBeTruthy();
    expect(getByPlaceholderText('Nama Pengguna Anda')).toBeTruthy();
    expect(getByPlaceholderText('Nama Lengkap Anda')).toBeTruthy();
    expect(getByPlaceholderText('emailanda@contoh.com')).toBeTruthy();
    expect(getByPlaceholderText('081234567890')).toBeTruthy();
    expect(getByPlaceholderText('••••••••')).toBeTruthy();
    expect(getByText('Konfirmasi Kata Sandi')).toBeTruthy();
    expect(getByText('Pin lokasi')).toBeTruthy();
    expect(getByText('Daftar')).toBeTruthy();
    expect(getByText('Sudah punya akun?')).toBeTruthy();
    expect(getByText('Masuk')).toBeTruthy();
  });

  it('updates input fields on change', () => {
    const { getByPlaceholderText } = renderRegisterScreen();
    fireEvent.changeText(getByPlaceholderText('Nama Pengguna Anda'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Nama Lengkap Anda'), 'Test Fullname');
    fireEvent.changeText(getByPlaceholderText('emailanda@contoh.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('081234567890'), '081234567890');
    fireEvent.changeText(getByPlaceholderText('••••••••', { selector: 0 }), 'password123');
    fireEvent.changeText(getByPlaceholderText('••••••••', { selector: 1 }), 'password123');

    expect(getByPlaceholderText('Nama Pengguna Anda').props.value).toBe('testuser');
    expect(getByPlaceholderText('Nama Lengkap Anda').props.value).toBe('Test Fullname');
    expect(getByPlaceholderText('emailanda@contoh.com').props.value).toBe('test@example.com');
    expect(getByPlaceholderText('081234567890').props.value).toBe('081234567890');
    expect(getByPlaceholderText('••••••••', { selector: 0 }).props.value).toBe('password123');
    expect(getByPlaceholderText('••••••••', { selector: 1 }).props.value).toBe('password123');
  });

  it('toggles password visibility', () => {
    const { getAllByLabelText } = renderRegisterScreen();
    const passwordInputs = getAllByLabelText('••••••••');
    const passwordToggle = passwordInputs[0].parent.findByProps({ accessibilityRole: 'button' });
    const confirmPasswordToggle = passwordInputs[1].parent.findByProps({ accessibilityRole: 'button' });

    expect(passwordInputs[0].props.secureTextEntry).toBe(true);
    fireEvent.press(passwordToggle);
    expect(passwordInputs[0].props.secureTextEntry).toBe(false);

    expect(passwordInputs[1].props.secureTextEntry).toBe(true);
    fireEvent.press(confirmPasswordToggle);
    expect(passwordInputs[1].props.secureTextEntry).toBe(false);
  });

  it('requests and gets current location on mount', async () => {
    renderRegisterScreen();
    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
    });
  });

  it('shows alert if location permission is denied', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });
    renderRegisterScreen();
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Izin Lokasi Ditolak',
        'Aplikasi ini membutuhkan izin lokasi untuk dapat bekerja dengan baik.'
      );
    });
  });

  it('shows alert if getting current location fails', async () => {
    Location.getCurrentPositionAsync.mockRejectedValue(new Error('GPS off'));
    renderRegisterScreen();
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Gagal Mendapatkan Lokasi',
        'Tidak bisa mendapatkan lokasi saat ini. Pastikan GPS anda aktif.'
      );
    });
  });

  it('shows confirmation modal on register button press', async () => {
    const { getByText } = renderRegisterScreen();
    const registerButton = getByText('Daftar');

    // Fill all fields to enable button
    fireEvent.changeText(getByPlaceholderText('Nama Pengguna Anda'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Nama Lengkap Anda'), 'Test Fullname');
    fireEvent.changeText(getByPlaceholderText('emailanda@contoh.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('081234567890'), '081234567890');
    fireEvent.changeText(getAllByLabelText('••••••••')[0], 'password123');
    fireEvent.changeText(getAllByLabelText('••••••••')[1], 'password123');

    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(Keyboard.dismiss).toHaveBeenCalled();
      expect(getByText('Apakah Anda yakin dengan data yang diisi?')).toBeTruthy();
    });
  });

  it('calls register function and shows success modal on confirmation', async () => {
    const { getByText, getByPlaceholderText } = renderRegisterScreen();
    const registerButton = getByText('Daftar');

    // Fill all fields to enable button
    fireEvent.changeText(getByPlaceholderText('Nama Pengguna Anda'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Nama Lengkap Anda'), 'Test Fullname');
    fireEvent.changeText(getByPlaceholderText('emailanda@contoh.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('081234567890'), '081234567890');
    fireEvent.changeText(getAllByLabelText('••••••••')[0], 'password123');
    fireEvent.changeText(getAllByLabelText('••••••••')[1], 'password123');

    mockRegister.mockResolvedValue({ success: true });

    fireEvent.press(registerButton);

    await waitFor(() => {
      fireEvent.press(getByText('Ya')); // Confirm registration
    });

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'testuser',
        phoneNumber: '081234567890',
        fullName: 'Test Fullname',
        password: 'password123',
        longitude: expect.any(Number),
        latitude: expect.any(Number),
      });
      expect(getByText('Pendaftaran berhasil! Anda akan diarahkan ke halaman login setelah menutup pesan ini.')).toBeTruthy();
    });
  });

  it('calls register function and shows error modal on failed registration', async () => {
    const { getByText, getByPlaceholderText } = renderRegisterScreen();
    const registerButton = getByText('Daftar');

    // Fill all fields to enable button
    fireEvent.changeText(getByPlaceholderText('Nama Pengguna Anda'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Nama Lengkap Anda'), 'Test Fullname');
    fireEvent.changeText(getByPlaceholderText('emailanda@contoh.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('081234567890'), '081234567890');
    fireEvent.changeText(getAllByLabelText('••••••••')[0], 'password123');
    fireEvent.changeText(getAllByLabelText('••••••••')[1], 'password123');

    const errorMessage = 'Username already exists';
    mockRegister.mockResolvedValue({ success: false, error: errorMessage });

    fireEvent.press(registerButton);

    await waitFor(() => {
      fireEvent.press(getByText('Ya')); // Confirm registration
    });

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
      expect(getByText(errorMessage)).toBeTruthy();
    });
  });

  it('shows validation errors for empty fields', async () => {
    yup.object().validate.mockRejectedValue({
      inner: [
        { path: 'username', message: 'Nama pengguna wajib diisi.' },
        { path: 'email', message: 'Email wajib diisi.' },
        { path: 'password', message: 'Password minimal 8 karakter.' },
      ],
    });

    const { getByText } = renderRegisterScreen();
    const registerButton = getByText('Daftar');

    fireEvent.press(registerButton);

    await waitFor(() => {
      fireEvent.press(getByText('Ya')); // Confirm registration
    });

    await waitFor(() => {
      expect(getByText('Nama pengguna wajib diisi.')).toBeTruthy();
      expect(getByText('Email wajib diisi.')).toBeTruthy();
      expect(getByText('Password minimal 8 karakter.')).toBeTruthy();
    });
  });

  it('navigates to LoginTab when Masuk button is pressed', () => {
    const { getByText } = renderRegisterScreen();
    const loginButton = getByText('Masuk');

    fireEvent.press(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('LoginTab');
  });

  it('disables register button when submitting', () => {
    const { getByText, getByPlaceholderText } = renderRegisterScreen();

    // Fill all fields to enable button initially
    fireEvent.changeText(getByPlaceholderText('Nama Pengguna Anda'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Nama Lengkap Anda'), 'Test Fullname');
    fireEvent.changeText(getByPlaceholderText('emailanda@contoh.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('081234567890'), '081234567890');
    fireEvent.changeText(getAllByLabelText('••••••••')[0], 'password123');
    fireEvent.changeText(getAllByLabelText('••••••••')[1], 'password123');

    const registerButton = getByText('Daftar');
    fireEvent.press(registerButton);
    fireEvent.press(getByText('Ya')); // Confirm registration

    // At this point, isSubmitting should be true
    expect(registerButton.props.accessibilityState.disabled).toBe(true);
  });
});