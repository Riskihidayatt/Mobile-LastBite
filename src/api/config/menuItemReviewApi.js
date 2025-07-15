import ConfigAPI from '../axiosConfig';

// Membuat instance axios baru yang khusus untuk endpoint /menu-item-reviews
const menuItemReviewApi = ConfigAPI.create({
    baseURL: `${ConfigAPI.defaults.baseURL}/menu-item-reviews`,
});


export const submitReview = (reviewData) => {
    // Endpoint: POST /menu-item-reviews
    return menuItemReviewApi.post('', reviewData);
};


export const getReviewsByMenuItem = (menuItemId) => {
    // Endpoint: GET /menu-item-reviews/menu/{menuItemId}
    return menuItemReviewApi.get(`/menu/${menuItemId}`);
};

export default menuItemReviewApi;