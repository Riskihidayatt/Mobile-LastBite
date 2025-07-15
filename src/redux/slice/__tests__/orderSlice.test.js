import { configureStore } from '@reduxjs/toolkit';
import orderReducer, {
  createOrder,
  createDirectOrder,
  fetchCustomerOrders,
  resetOrderStatus,
} from '../orderSlice';
import {
  createOrder as apiCreateOrder,
  getCustomerOrders as apiGetCustomerOrders,
  createDirectOrder as apiCreateDirectOrder,
} from '../../api/config/orderApi';

describe('orderSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        orders: orderReducer,
      },
    });
    jest.clearAllMocks();
  });

  // Test initial state
  it('should return the initial state', () => {
    expect(orderReducer(undefined, {})).toEqual({
      orders: [],
      currentOrder: null,
      paymentUrl: null,
      submitStatus: 'idle',
      fetchStatus: 'idle',
      error: null,
    });
  });

  // Test resetOrderStatus reducer
  it('should handle resetOrderStatus', () => {
    const initialState = {
      orders: [{ id: '1' }],
      currentOrder: { id: 'abc' },
      paymentUrl: 'http://example.com',
      submitStatus: 'succeeded',
      fetchStatus: 'failed',
      error: 'some error',
    };
    const newState = orderReducer(initialState, resetOrderStatus());
    expect(newState).toEqual({
      orders: [{ id: '1' }],
      currentOrder: null,
      paymentUrl: null,
      submitStatus: 'idle',
      fetchStatus: 'failed',
      error: null,
    });
  });

  // Test createOrder async thunk
  describe('createOrder', () => {
    it('should handle pending state', () => {
      const action = createOrder.pending();
      const state = orderReducer(undefined, action);
      expect(state.submitStatus).toBe('loading');
    });

    it('should handle fulfilled state', async () => {
      const mockOrderData = { cartId: 'cart123' };
      const mockResponseData = { id: 'order123', payment: { redirectUrl: 'payment_url' } };
      apiCreateOrder.mockResolvedValue({ data: { data: mockResponseData } });

      await store.dispatch(createOrder(mockOrderData));

      const state = store.getState().orders;
      expect(state.submitStatus).toBe('succeeded');
      expect(state.currentOrder).toEqual(mockResponseData);
      expect(state.paymentUrl).toBe('payment_url');
      expect(apiCreateOrder).toHaveBeenCalledWith(mockOrderData);
    });

    it('should handle rejected state', async () => {
      const mockOrderData = { cartId: 'cart123' };
      const errorMessage = 'Failed to create order';
      apiCreateOrder.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await store.dispatch(createOrder(mockOrderData));

      const state = store.getState().orders;
      expect(state.submitStatus).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });

  // Test createDirectOrder async thunk
  describe('createDirectOrder', () => {
    it('should handle pending state', () => {
      const action = createDirectOrder.pending();
      const state = orderReducer(undefined, action);
      expect(state.submitStatus).toBe('loading');
    });

    it('should handle fulfilled state', async () => {
      const mockDirectOrderData = { orderItems: [] };
      const mockResponseData = { id: 'directOrder123', payment: { redirectUrl: 'direct_payment_url' } };
      apiCreateDirectOrder.mockResolvedValue({ data: { data: mockResponseData } });

      await store.dispatch(createDirectOrder(mockDirectOrderData));

      const state = store.getState().orders;
      expect(state.submitStatus).toBe('succeeded');
      expect(state.currentOrder).toEqual(mockResponseData);
      expect(state.paymentUrl).toBe('direct_payment_url');
      expect(apiCreateDirectOrder).toHaveBeenCalledWith(mockDirectOrderData);
    });

    it('should handle rejected state', async () => {
      const mockDirectOrderData = { orderItems: [] };
      const errorMessage = 'Failed to create direct order';
      apiCreateDirectOrder.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await store.dispatch(createDirectOrder(mockDirectOrderData));

      const state = store.getState().orders;
      expect(state.submitStatus).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });

  // Test fetchCustomerOrders async thunk
  describe('fetchCustomerOrders', () => {
    it('should handle pending state', () => {
      const action = fetchCustomerOrders.pending();
      const state = orderReducer(undefined, action);
      expect(state.fetchStatus).toBe('loading');
    });

    it('should handle fulfilled state', async () => {
      const mockStatus = 'PAID';
      const mockOrders = [{ id: 'order1' }, { id: 'order2' }];
      apiGetCustomerOrders.mockResolvedValue({ data: { data: mockOrders } });

      await store.dispatch(fetchCustomerOrders(mockStatus));

      const state = store.getState().orders;
      expect(state.fetchStatus).toBe('succeeded');
      expect(state.orders).toEqual(mockOrders);
      expect(apiGetCustomerOrders).toHaveBeenCalledWith(mockStatus);
    });

    it('should handle rejected state', async () => {
      const mockStatus = 'PAID';
      const errorMessage = 'Failed to fetch orders';
      apiGetCustomerOrders.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await store.dispatch(fetchCustomerOrders(mockStatus));

      const state = store.getState().orders;
      expect(state.fetchStatus).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });
});