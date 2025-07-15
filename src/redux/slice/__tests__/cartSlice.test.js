import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  fetchCart,
  addToCart,
  removeItemFromCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
  resetAddCartStatus,
} from '../cartSlice';
import {
  addItemToCart as apiAddItemToCart,
  getCart as apiGetCart,
  deleteCartItem as apiDeleteCartItem,
  updateItemQuantity as apiUpdateItemQuantity,
} from '../../api/config/cartApi';

describe('cartSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
    jest.clearAllMocks();
  });

  // Test initial state
  it('should return the initial state', () => {
    expect(cartReducer(undefined, {})).toEqual({
      items: {},
      totalQuantity: 0,
      totalAmount: 0,
      cartId: null,
      status: 'idle',
      error: null,
      addStatus: 'idle',
      addError: null,
    });
  });

  // Test clearCart reducer
  it('should handle clearCart', () => {
    const initialState = {
      items: { 'Store A': [{ cartItemId: '1', quantity: 1, price: 10, subtotal: 10 }] },
      totalQuantity: 1,
      totalAmount: 10,
      cartId: 'cart123',
      status: 'succeeded',
      error: null,
      addStatus: 'succeeded',
      addError: null,
    };
    const newState = cartReducer(initialState, clearCart());
    expect(newState).toEqual({
      items: {},
      totalQuantity: 0,
      totalAmount: 0,
      cartId: null,
      status: 'succeeded',
      error: null,
      addStatus: 'succeeded',
      addError: null,
    });
  });

  // Test resetAddCartStatus reducer
  it('should handle resetAddCartStatus', () => {
    const initialState = {
      items: {},
      totalQuantity: 0,
      totalAmount: 0,
      cartId: null,
      status: 'idle',
      error: null,
      addStatus: 'failed',
      addError: 'Failed to add',
    };
    const newState = cartReducer(initialState, resetAddCartStatus());
    expect(newState.addStatus).toBe('idle');
    expect(newState.addError).toBe(null);
  });

  // Test fetchCart async thunk
  describe('fetchCart', () => {
    it('should handle pending state', () => {
      const action = fetchCart.pending();
      const state = cartReducer(undefined, action);
      expect(state.status).toBe('loading');
    });

    it('should handle fulfilled state', () => {
      const mockCartData = {
        cartId: 'cart123',
        sellers: [
          {
            sellerId: 'seller1',
            storeName: 'Store A',
            items: [
              { cartItemId: 'item1', menuItemName: 'Burger', quantity: 2, price: 10, subtotal: 20, imageUrl: 'burger.jpg' },
            ],
          },
        ],
      };
      apiGetCart.mockResolvedValue({ data: { data: mockCartData } });

      return store.dispatch(fetchCart()).then(() => {
        const state = store.getState().cart;
        expect(state.status).toBe('succeeded');
        expect(state.cartId).toBe('cart123');
        expect(state.totalQuantity).toBe(2);
        expect(state.totalAmount).toBe(20);
        expect(state.items).toEqual({
          'Store A': [
            { cartItemId: 'item1', menuItemName: 'Burger', quantity: 2, price: 10, subtotal: 20, sellerId: 'seller1', name: 'Burger', image: 'burger.jpg' },
          ],
        });
      });
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Failed to fetch cart';
      apiGetCart.mockRejectedValue({ response: { data: { message: errorMessage } } });

      return store.dispatch(fetchCart()).then(() => {
        const state = store.getState().cart;
        expect(state.status).toBe('failed');
        expect(state.error).toBe(errorMessage);
      });
    });
  });

  // Test addToCart async thunk
  describe('addToCart', () => {
    it('should handle pending state', () => {
      const action = addToCart.pending();
      const state = cartReducer(undefined, action);
      expect(state.addStatus).toBe('loading');
      expect(state.addError).toBe(null);
    });

    it('should handle fulfilled state and dispatch fetchCart', () => {
      const mockItem = { id: 'menu123', name: 'Pizza' };
      const mockQuantity = 1;
      apiAddItemToCart.mockResolvedValue({ data: { message: 'Item added' } });
      apiGetCart.mockResolvedValue({ data: { data: { cartId: 'newCart', sellers: [] } } }); // Mock fetchCart

      return store.dispatch(addToCart({ item: mockItem, quantity: mockQuantity })).then(() => {
        const state = store.getState().cart;
        expect(apiAddItemToCart).toHaveBeenCalledWith(mockItem.id, mockQuantity);
        expect(apiGetCart).toHaveBeenCalled(); // fetchCart should be dispatched
        expect(state.addStatus).toBe('succeeded');
      });
    });

    it('should handle rejected state', () => {
      const mockItem = { id: 'menu123', name: 'Pizza' };
      const mockQuantity = 1;
      const errorMessage = 'Failed to add item';
      apiAddItemToCart.mockRejectedValue({ response: { data: { message: errorMessage } } });

      return store.dispatch(addToCart({ item: mockItem, quantity: mockQuantity })).then(() => {
        const state = store.getState().cart;
        expect(state.addStatus).toBe('failed');
        expect(state.addError).toBe(errorMessage);
      });
    });
  });

  // Test removeItemFromCart async thunk
  describe('removeItemFromCart', () => {
    it('should handle fulfilled state and dispatch fetchCart', () => {
      const cartItemId = 'item123';
      apiDeleteCartItem.mockResolvedValue({});
      apiGetCart.mockResolvedValue({ data: { data: { cartId: 'updatedCart', sellers: [] } } }); // Mock fetchCart

      return store.dispatch(removeItemFromCart({ cartItemId, storeName: 'Store A' })).then(() => {
        expect(apiDeleteCartItem).toHaveBeenCalledWith(cartItemId);
        expect(apiGetCart).toHaveBeenCalled(); // fetchCart should be dispatched
      });
    });

    it('should handle rejected state', () => {
      const cartItemId = 'item123';
      const errorMessage = 'Failed to remove item';
      apiDeleteCartItem.mockRejectedValue({ response: { data: { message: errorMessage } } });

      return store.dispatch(removeItemFromCart({ cartItemId, storeName: 'Store A' })).then(() => {
        const state = store.getState().cart;
        expect(state.error).toBe(errorMessage);
      });
    });
  });

  // Test increaseItemQuantity async thunk
  describe('increaseItemQuantity', () => {
    it('should update quantity and total amount on fulfilled', () => {
      const initialState = {
        items: { 'Store A': [{ cartItemId: 'item1', quantity: 1, price: 10, subtotal: 10 }] },
        totalQuantity: 1,
        totalAmount: 10,
      };
      store = configureStore({
        reducer: {
          cart: cartReducer,
        },
        preloadedState: { cart: initialState },
      });

      apiUpdateItemQuantity.mockResolvedValue({});

      return store.dispatch(increaseItemQuantity({ cartItemId: 'item1', storeName: 'Store A' })).then(() => {
        const state = store.getState().cart;
        expect(apiUpdateItemQuantity).toHaveBeenCalledWith('item1', 2);
        expect(state.items['Store A'][0].quantity).toBe(2);
        expect(state.items['Store A'][0].subtotal).toBe(20);
        expect(state.totalQuantity).toBe(2);
        expect(state.totalAmount).toBe(20);
      });
    });

    it('should dispatch fetchCart on API error', () => {
      const initialState = {
        items: { 'Store A': [{ cartItemId: 'item1', quantity: 1, price: 10, subtotal: 10 }] },
        totalQuantity: 1,
        totalAmount: 10,
      };
      store = configureStore({
        reducer: {
          cart: cartReducer,
        },
        preloadedState: { cart: initialState },
      });

      apiUpdateItemQuantity.mockRejectedValue(new Error('API Error'));
      apiGetCart.mockResolvedValue({ data: { data: { cartId: 'refreshedCart', sellers: [] } } }); // Mock fetchCart

      return store.dispatch(increaseItemQuantity({ cartItemId: 'item1', storeName: 'Store A' })).then(() => {
        expect(apiUpdateItemQuantity).toHaveBeenCalledWith('item1', 2);
        expect(apiGetCart).toHaveBeenCalled(); // fetchCart should be dispatched
      });
    });
  });

  // Test decreaseItemQuantity async thunk
  describe('decreaseItemQuantity', () => {
    it('should update quantity and total amount on fulfilled', () => {
      const initialState = {
        items: { 'Store A': [{ cartItemId: 'item1', quantity: 2, price: 10, subtotal: 20 }] },
        totalQuantity: 2,
        totalAmount: 20,
      };
      store = configureStore({
        reducer: {
          cart: cartReducer,
        },
        preloadedState: { cart: initialState },
      });

      apiUpdateItemQuantity.mockResolvedValue({});

      return store.dispatch(decreaseItemQuantity({ cartItemId: 'item1', storeName: 'Store A' })).then(() => {
        const state = store.getState().cart;
        expect(apiUpdateItemQuantity).toHaveBeenCalledWith('item1', 1);
        expect(state.items['Store A'][0].quantity).toBe(1);
        expect(state.items['Store A'][0].subtotal).toBe(10);
        expect(state.totalQuantity).toBe(1);
        expect(state.totalAmount).toBe(10);
      });
    });

    it('should dispatch removeItemFromCart if new quantity is 0', () => {
      const initialState = {
        items: { 'Store A': [{ cartItemId: 'item1', quantity: 1, price: 10, subtotal: 10 }] },
        totalQuantity: 1,
        totalAmount: 10,
      };
      store = configureStore({
        reducer: {
          cart: cartReducer,
        },
        preloadedState: { cart: initialState },
      });

      // Mock removeItemFromCart to prevent actual API call and just resolve
      apiDeleteCartItem.mockResolvedValue({});
      apiGetCart.mockResolvedValue({ data: { data: { cartId: 'emptyCart', sellers: [] } } }); // Mock fetchCart after removal

      return store.dispatch(decreaseItemQuantity({ cartItemId: 'item1', storeName: 'Store A' })).then(() => {
        expect(apiDeleteCartItem).toHaveBeenCalledWith('item1');
        expect(apiUpdateItemQuantity).not.toHaveBeenCalled(); // Should not call update if quantity becomes 0
      });
    });

    it('should dispatch fetchCart on API error', () => {
      const initialState = {
        items: { 'Store A': [{ cartItemId: 'item1', quantity: 2, price: 10, subtotal: 20 }] },
        totalQuantity: 2,
        totalAmount: 20,
      };
      store = configureStore({
        reducer: {
          cart: cartReducer,
        },
        preloadedState: { cart: initialState },
      });

      apiUpdateItemQuantity.mockRejectedValue(new Error('API Error'));
      apiGetCart.mockResolvedValue({ data: { data: { cartId: 'refreshedCart', sellers: [] } } }); // Mock fetchCart

      return store.dispatch(decreaseItemQuantity({ cartItemId: 'item1', storeName: 'Store A' })).then(() => {
        expect(apiUpdateItemQuantity).toHaveBeenCalledWith('item1', 1);
        expect(apiGetCart).toHaveBeenCalled(); // fetchCart should be dispatched
      });
    });
  });
});