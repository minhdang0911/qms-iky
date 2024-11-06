export const apiGetTechnical = async (token) => {
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/technicians/list', {
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

export const apiCreateTechnical = async (token, name, phone) => {
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('phone', phone);

    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/technicians/add', {
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

export const apiUpdateTechnical = async (token, name, phone, id) => {
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('phone', phone);
    params.append('id', id);
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/technicians/edit', {
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

export const apiDeleteTechnical = async (token, id) => {
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/technicians/delete', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`,
    });

    if (!response.ok) {
        throw new Error('Failed to delete technical');
    }
    return await response.json();
};
