import ConfigAPI from '../axiosConfig';

const cartApi = ConfigAPI.create({
  baseURL: `${ConfigAPI.defaults.baseURL}/carts`,
});

export const addItemToCart = (menuItemId, quantity) => {
  return cartApi.post('/items', { menuItemId, quantity });
};

// Get Cart
export const getCart = () => {
  return cartApi.get('');
};

// Delete by item id
export const deleteCartItem = (cartItemId) => {
  return cartApi.delete(`/items/${cartItemId}`);
};

// ======================================================================
// --- PERUBAHAN DI SINI ---
export const updateItemQuantity = (cartItemId, quantity) => {
  // Kirim `quantity` sebagai parameter query menggunakan `params`
  // Argumen kedua (body) diisi `null` karena kita tidak mengirim body
  return cartApi.put(`/items/${cartItemId}`, null, {
    params: {
      quantity: quantity
    }
  });
};
// ======================================================================


export default cartApi;