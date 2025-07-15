import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  fetchUserMe,
  updateUserMe,
  changePassword,
} from '../userSlice';
import APIs from '../../api';

describe('userSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
    jest.clearAllMocks();
  });

  // Test initial state
  it('should return the initial state', () => {
    expect(userReducer(undefined, {})).toEqual({
      user: null,
      status: 'idle',
      error: null,
      changePasswordStatus: 'idle',
      changePasswordError: null,
    });
  });

  // Test fetchUserMe async thunk
  describe('fetchUserMe', () => {
    it('should handle pending state', () => {
      const action = fetchUserMe.pending();
      const state = userReducer(undefined, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBe(null);
    });

    it('should handle fulfilled state', async () => {
      const mockUserData = { id: '1', name: 'Test User' };
      APIs.users.get.mockResolvedValue({ data: { data: mockUserData } });

      await store.dispatch(fetchUserMe());

      const state = store.getState().user;
      expect(state.status).toBe('succeeded');
      expect(state.user).toEqual(mockUserData);
      expect(APIs.users.get).toHaveBeenCalledWith('/me');
    });

    it('should handle rejected state', async () => {
      const errorMessage = 'Failed to fetch user data';
      APIs.users.get.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await store.dispatch(fetchUserMe());

      const state = store.getState().user;
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBe(null);
    });
  });

  // Test updateUserMe async thunk
  describe('updateUserMe', () => {
    it('should handle pending state', () => {
      const action = updateUserMe.pending();
      const state = userReducer(undefined, action);
      expect(state.updateStatus).toBe('loading');
      expect(state.updateError).toBe(null);
    });

    it('should handle fulfilled state', async () => {
      const updatedData = { name: 'Updated Name' };
      const mockResponseData = { id: '1', name: 'Updated Name' };
      APIs.users.put.mockResolvedValue({ data: { data: mockResponseData } });

      await store.dispatch(updateUserMe(updatedData));

      const state = store.getState().user;
      expect(state.updateStatus).toBe('succeeded');
      expect(state.user).toEqual(mockResponseData);
      expect(APIs.users.put).toHaveBeenCalledWith('/me', updatedData);
    });

    it('should handle rejected state', async () => {
      const updatedData = { name: 'Updated Name' };
      const errorMessage = 'Failed to update user data';
      APIs.users.put.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await store.dispatch(updateUserMe(updatedData));

      const state = store.getState().user;
      expect(state.updateStatus).toBe('failed');
      expect(state.updateError).toBe(errorMessage);
    });
  });

  // Test changePassword async thunk
  describe('changePassword', () => {
    it('should handle pending state', () => {
      const action = changePassword.pending();
      const state = userReducer(undefined, action);
      expect(state.changePasswordStatus).toBe('loading');
      expect(state.changePasswordError).toBe(null);
    });

    it('should handle fulfilled state', async () => {
      const passwordChangeData = { oldPassword: 'old', newPassword: 'new' };
      APIs.users.put.mockResolvedValue({ data: { data: { message: 'Password changed' } } });

      await store.dispatch(changePassword(passwordChangeData));

      const state = store.getState().user;
      expect(state.changePasswordStatus).toBe('succeeded');
      expect(state.changePasswordError).toBe(null);
      expect(APIs.users.put).toHaveBeenCalledWith('/me/password', passwordChangeData);
    });

    it('should handle rejected state', async () => {
      const passwordChangeData = { oldPassword: 'old', newPassword: 'new' };
      const errorMessage = 'Failed to change user password';
      APIs.users.put.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await store.dispatch(changePassword(passwordChangeData));

      const state = store.getState().user;
      expect(state.changePasswordStatus).toBe('failed');
      expect(state.changePasswordError).toBe(errorMessage);
    });
  });
});