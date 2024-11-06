export const apiGetSerialNumber = async (token, id) => {
    const response = await fetch(`/api/customers/serial-number?service_id=${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to create service');
    }
    return await response.json();
};
