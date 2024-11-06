export const apiGetLiftTable = async (token) => {
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/liftTables/list', {
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

export const apiCreateLiftTable = async (token, name, technician_id, decription) => {
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('technician_id', technician_id);
    params.append('decription', decription);

    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/liftTables/add', {
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

export const apiUpdateLiftTable = async (token, name, technician_id, id) => {
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('technician_id', technician_id);
    params.append('id', id);
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/liftTables/edit', {
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

export const apiDeleteLiftTable = async (token, id) => {
    const params = new URLSearchParams();
    params.append('id', id);

    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/liftTables/delete', {
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

export const apiCreateReceptionVehicle = async (token, id, customer_id, name, license_plate) => {
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('name', name);
    params.append('customer_id', customer_id);
    params.append('license_plate', license_plate);

    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/liftTables/reception-vehicle', {
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

// api đưa xe lên bàn nâng
export const apiGetListRepair = async (token) => {
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/liftTables/repair-list', {
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

//api trả xe xóa xe khỏi bàn nâng

export const apiLiftTableReturnVehicle = async (token, id) => {
    const params = new URLSearchParams();
    params.append('id', id);
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/liftTables/return-vehicle', {
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
