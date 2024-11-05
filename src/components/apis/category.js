export const apiGetCategory = async (token) => {
    const response = await fetch('/api/repairCategories/list', {
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

export const apiCreateCategory = async (token, name, shortName, time) => {
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('short_name', shortName);
    params.append('time', time);

    const response = await fetch('/api/repairCategories/add', {
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

export const apiDeleteCategory = async (token, id) => {
    const response = await fetch('/api/repairCategories/delete', {
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

export const apiUpdateCategory = async (token, id, name, shortName, time) => {
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('name', name);
    params.append('short_name', shortName);
    params.append('time', time);

    const response = await fetch('/api/repairCategories/edit', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error('Failed to update category');
    }
    return await response.json();
};
