import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Puff } from 'react-loader-spinner';
import './login.scss';
import { IoEyeSharp } from 'react-icons/io5';
import { FaEyeSlash } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { apiLogin, apiChangePassword } from '../apis/user';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
    const [hideNewPassword, setHideNewPassword] = useState(true);

    const handleAuthSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (isLogin) {
            if (!username || !password) {
                toast.error('Tên người dùng và mật khẩu không được để trống.');
                setLoading(false);
                return;
            }

            try {
                const response = await apiLogin(username, password);
                const data = response;
                console.log('data', data.msg);

                if (data.result === 1 && data.msg) {
                    // Chuyển đổi timestamp thành ngày hết hạn
                    const expiresIn = new Date(data.msg.expires * 1000); // Chuyển đổi từ giây sang mili giây

                    // Lưu access token và refresh token vào cookie
                    Cookies.set('Access token', data.msg.accessToken, {
                        httpOnly: false,
                        secure: false,
                        expires: expiresIn,
                    });

                    Cookies.set('expires', expiresIn, {
                        httpOnly: false,
                        secure: false,
                        expires: expiresIn,
                    });

                    toast.success('Đăng nhập thành công!');
                    window.location.href = '/control';
                } else {
                    toast.error(data.msg || 'Đăng nhập không thành công.');
                }
            } catch (error) {
                toast.error(error?.response?.data?.msg || 'Có lỗi xảy ra, vui lòng thử lại.');
                console.error('Error during authentication:', error);
            }
        } else {
            // Đổi mật khẩu
            if (!currentPassword || !newPassword || !confirmPassword) {
                toast.error('Tất cả các trường đều phải được điền.');
                setLoading(false);
                return;
            }

            if (newPassword !== confirmPassword) {
                toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
                setLoading(false);
                return;
            }

            const token = Cookies.get('Access token'); // Lấy token từ cookie

            try {
                const response = await apiChangePassword(token, currentPassword, newPassword, confirmPassword);
                console.log('Response status:', response.status); // Kiểm tra mã trạng thái
                console.log('Response data:', response); // Xem dữ liệu trả về

                // Kiểm tra điều kiện trả về từ API
                if (response?.result === 0) {
                    toast.error('Mật khẩu cũ không chính xác');
                    setLoading(false); // Đảm bảo setLoading về false khi có lỗi
                    return; // Thoát hàm nếu mật khẩu không chính xác
                }

                // Nếu không có lỗi, thông báo thành công
                toast.success('Đổi mật khẩu thành công!');
                setIsLogin(true);
                // Reset các trường input
                setCurrentPassword('');
                setConfirmPassword('');
                setNewPassword('');
            } catch (error) {
                toast.error(error?.response?.data?.msg || 'Bạn đã nhập sai mật khẩu cũ.');
                console.error('Error during password change:', error);
            } finally {
                setLoading(false); // Đảm bảo luôn setLoading về false trong cuối cùng
            }
        }

        setLoading(false);
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleAuthSubmit} className="auth-form">
                <h2>{isLogin ? 'Đăng Nhập' : 'Đổi Mật Khẩu'}</h2>
                {isLogin ? (
                    <>
                        <div className="form-group">
                            <label>Tên người dùng</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <div className="password-container">
                                <input
                                    type={hidePassword ? 'password' : 'text'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span onClick={() => setHidePassword(!hidePassword)}>
                                    {hidePassword ? <IoEyeSharp /> : <FaEyeSlash />}
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="form-group">
                            <label>Mật khẩu hiện tại</label>
                            <div className="password-container">
                                <input
                                    type={hideCurrentPassword ? 'password' : 'text'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                                <span onClick={() => setHideCurrentPassword(!hideCurrentPassword)}>
                                    {hideCurrentPassword ? <IoEyeSharp /> : <FaEyeSlash />}
                                </span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <div className="password-container">
                                <input
                                    type={hideNewPassword ? 'password' : 'text'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <span onClick={() => setHideNewPassword(!hideNewPassword)}>
                                    {hideNewPassword ? <IoEyeSharp /> : <FaEyeSlash />}
                                </span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Xác nhận mật khẩu mới</label>
                            <div className="password-container">
                                <input
                                    type={hideNewPassword ? 'password' : 'text'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <span onClick={() => setHideNewPassword(!hideNewPassword)}>
                                    {hideNewPassword ? <IoEyeSharp /> : <FaEyeSlash />}
                                </span>
                            </div>
                        </div>
                    </>
                )}
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? <Puff color="#00BFFF" height={20} width={20} /> : isLogin ? 'Đăng Nhập' : 'Đổi Mật Khẩu'}
                </button>

                <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
                    {' '}
                    {isLogin ? 'Đổi mật khẩu' : 'Quay lại đăng nhập'}
                </p>
            </form>
        </div>
    );
};

export default AuthForm;
