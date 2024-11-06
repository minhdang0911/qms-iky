export const apiLogin = async (username, password) => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/users/token?grant_type=password&username=${username}&password=${password}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to login');
    }
    return await response.json();
};

export const apiChangePassword = async (token, currentPassword, newPassword, confirmPassword) => {
    const formData = new URLSearchParams();
    formData.append('current_password', currentPassword);
    formData.append('new_password', newPassword);
    formData.append('confirm_password', confirmPassword);

    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qms-admin.iky.vn/api/users/change-password', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to change password');
    }
    return await response.json();
};
