import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser, registerUser, setAuthState, logoutUser } from '../authSlice';
import APIs from '../../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock APIs
jest.mock('../../../api', () => ({
  auth: {
    post: jest.fn(),
  },
}));

describe('authSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test initial state
  it('should return the initial state', () => {
    expect(authReducer(undefined, {})).toEqual({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      status: 'idle',
      error: null,
    });
  });

  // Test setAuthState reducer
  it('should handle setAuthState', () => {
    const newState = authReducer(undefined, setAuthState({
      isAuthenticated: true,
      token: 'test_token',
      refreshToken: 'test_refresh_token',
    }));
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.token).toBe('test_token');
    expect(newState.refreshToken).toBe('test_refresh_token');
    expect(newState.status).toBe('idle');
    expect(newState.error).toBe(null);
  });

  // Test logoutUser reducer
  it('should handle logoutUser', () => {
    const initialState = {
      token: 'some_token',
      refreshToken: 'some_refresh_token',
      isAuthenticated: true,
      status: 'succeeded',
      error: null,
    };
    const newState = authReducer(initialState, logoutUser());
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.token).toBe(null);
    expect(newState.refreshToken).toBe(null);
    expect(newState.error).toBe(null);
  });

  // Test loginUser async thunk - fulfilled
  it('should handle loginUser.fulfilled', async () => {
    const mockResponse = {
      data: {
        data: {
          token: 'new_token',
          refreshToken: 'new_refresh_token',
        },
      },
    };
    APIs.auth.post.mockResolvedValue(mockResponse);

    await store.dispatch(loginUser({ username: 'test', password: 'password' }));

    const state = store.getState().auth;
    expect(state.status).toBe('succeeded');
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('new_token');
    expect(state.refreshToken).toBe('new_refresh_token');
  });

  // Test loginUser async thunk - rejected
  it('should handle loginUser.rejected', async () => {
    const errorMessage = 'Invalid credentials';
    APIs.auth.post.mockRejectedValue({
      response: {
        data: {
          message: errorMessage,
        },
      },
    });

    await store.dispatch(loginUser({ username: 'test', password: 'password' }));

    const state = store.getState().auth;
    expect(state.status).toBe('failed');
    expect(state.error).toBe(errorMessage);
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBe(null);
    expect(state.refreshToken).toBe(null);
  });

  // Test registerUser async thunk - fulfilled
  it('should handle registerUser.fulfilled', async () => {
    const mockResponse = { data: { message: 'Registration successful' } };
    APIs.auth.post.mockResolvedValue(mockResponse);

    await store.dispatch(registerUser({ username: 'test', email: 'test@example.com', password: 'password' }));

    const state = store.getState().auth;
    expect(state.status).toBe('succeeded');
  });

  // Test registerUser async thunk - rejected
  it('should handle registerUser.rejected', async () => {
    const errorMessage = 'User already exists';
    APIs.auth.post.mockRejectedValue({
      response: {
        data: {
          message: errorMessage,
        },
      },
    });

    await store.dispatch(registerUser({ username: 'test', email: 'test@example.com', password: 'password' }));

    const state = store.getState().auth;
    expect(state.status).toBe('failed');
    expect(state.error).toBe(errorMessage);
  });
});