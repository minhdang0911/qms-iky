export const apiGetRepairList = async (token, id) => {
    const response = await fetch(`https://qms-admin.iky.vn/api/customers/repair-list?id=${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch repair list');
    }
    return await response.json();
};

export const apiAddCustomerCategory = async (token, id, repairCategoryId) => {
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('repairCategory_id', repairCategoryId);

    const response = await fetch('https://qms-admin.iky.vn/api/customers/add-repairCategory', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error('Failed to add customer category');
    }
    return await response.json(); // Trả về kết quả từ response
};

export const apiDeleteRepairCategory = async (token, id, repairId) => {
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('repair_id', repairId);

    const response = await fetch('https://qms-admin.iky.vn/api/customers/delete-repairCategory', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error('Failed to delete repair category');
    }
    return await response.json(); // Trả về kết quả từ response
};

//api hiển thị danh sách xe chờ lấy
export const apiGetFinshList = async (token, id) => {
    const response = await fetch(`https://qms-admin.iky.vn/api/customers/finish-list`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch repair list');
    }
    return await response.json();
};

//api xóa xe khỏi danh sách chờ lấy
export const apiReceivedVehicle = async (token, id) => {
    const params = new URLSearchParams();
    params.append('id', id);
    const response = await fetch('https://qms-admin.iky.vn/api/customers/received-vehicle', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error('Failed to add customer category');
    }
    return await response.json();
};

export const apiDeleteQueue = async (token, id) => {
    const params = new URLSearchParams();
    params.append('id', id);

    const response = await fetch('https://qms-admin.iky.vn/api/customers/delete-queue', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error('Failed to delete repair category');
    }
    return await response.json(); // Trả về kết quả từ response
};

export const apiIncreaseTime = async (token, id, time) => {
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('time', time);
    const response = await fetch('https://qms-admin.iky.vn/api/customers/increase-repair-time', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error('Failed to delete repair category');
    }
    return await response.json();
};

export const apiDecreaseTime = async (token, id, time) => {
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('time', time);
    const response = await fetch('https://qms-admin.iky.vn/api/customers/decrease-repair-time', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error('Failed to delete repair category');
    }
    return await response.json();
};
