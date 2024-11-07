export const apiGetServies = async (token) => {
    const response = await fetch('https://qms-admin.iky.vn/api/services/list', {
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

export const apiCreateServies = async (token, name, time, serialNumberStart) => {
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('time', time);
    params.append('serial_number_start', serialNumberStart); // Thêm trường serial_number_start

    const response = await fetch('https://qms-admin.iky.vn/api/services/add', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error('Failed to create service');
    }
    return await response.json();
};

export const apiUpdateServies = async (token, name, serialNumberStart, id) => {
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('serial_number_start', serialNumberStart);
    params.append('id', id);

    const response = await fetch('https://qms-admin.iky.vn/api/services/edit', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error('Failed to create service');
    }
    return await response.json();
};

export const apiDeleteServies = async (token, id) => {
    const response = await fetch('https://qms-admin.iky.vn/api/services/delete', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`,
    });

    if (!response.ok) {
        throw new Error('Failed to delete category');
    }
    return await response.json();
};
