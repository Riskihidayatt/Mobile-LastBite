import { configureStore } from '@reduxjs/toolkit';
import modalReducer, { showModal, hideModal } from '../modalSlice';

describe('modalSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        modal: modalReducer,
      },
    });
  });

  // Test initial state
  it('should return the initial state', () => {
    expect(modalReducer(undefined, {})).toEqual({
      visible: false,
      message: '',
      type: 'info',
    });
  });

  // Test showModal reducer
  it('should handle showModal', () => {
    const message = 'Test Message';
    const type = 'error';
    const newState = modalReducer(undefined, showModal({ message, type }));
    expect(newState.visible).toBe(true);
    expect(newState.message).toBe(message);
    expect(newState.type).toBe(type);
  });

  it('should handle showModal with default type', () => {
    const message = 'Another Message';
    const newState = modalReducer(undefined, showModal({ message }));
    expect(newState.visible).toBe(true);
    expect(newState.message).toBe(message);
    expect(newState.type).toBe('info');
  });

  // Test hideModal reducer
  it('should handle hideModal', () => {
    const initialState = {
      visible: true,
      message: 'Some message',
      type: 'success',
    };
    const newState = modalReducer(initialState, hideModal());
    expect(newState.visible).toBe(false);
    expect(newState.message).toBe('');
    expect(newState.type).toBe('info');
  });
});