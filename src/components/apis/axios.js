import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://qms-admin.iky.vn',
});

// Thêm interceptor cho yêu cầu
instance.interceptors.request.use(
    function (config) {
        let localStorageData = window.localStorage.getItem('persist:shop/user');
        if (localStorageData && typeof localStorageData === 'string') {
            localStorageData = JSON.parse(localStorageData);
            const accessToken = JSON.parse(localStorageData?.token);
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

// Thêm interceptor cho phản hồi
instance.interceptors.response.use(
    function (response) {
        return response.data; // Trả về dữ liệu từ phản hồi
    },
    function (error) {
        return Promise.reject(error.response?.data || error.message); // Trả về lỗi
    },
);

export default instance;
