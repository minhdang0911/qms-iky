export const apiStoreInfo = async (token) => {
    const response = await fetch('/api/stores/info', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }
    return await response.json();
};
