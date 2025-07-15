import ConfigAPI from '../axiosConfig';

const orderApi = ConfigAPI.create({
    baseURL: `${ConfigAPI.defaults.baseURL}/orders`,
});


export const createOrder = (orderData) => {
    const url = '/from-cart';
    return orderApi.post(url, orderData);
};


export const getCustomerOrders = (status) => {
    // Endpoint: GET /orders/customer/me?status=PAID
    return orderApi.get('/customer/me', { 
        params: {
            status: status
        }
    });
};

/**
 * 3. MEMBUAT PESANAN LANGSUNG (ENDPOINT BARU)
 * Endpoint: POST /orders
 * @param {object} directOrderData - Berisi { orderItems: [...] }
 */
export const createDirectOrder = (directOrderData) => {
    // URL-nya '' karena instance orderApi sudah mengarah ke /orders
    return orderApi.post('', directOrderData);
};


export default orderApi;