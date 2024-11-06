import React, { useEffect, useState } from 'react';
import { Select, Button, Modal, message } from 'antd';
import { apiGetServies } from '../apis/service';
import { apiGetSerialNumber } from '../apis/serial';
import Cookies from 'js-cookie';
import { LoadingOutlined } from '@ant-design/icons'; // Thêm icon để biểu thị tải dữ liệu

const { Option } = Select;

const GetSerialNumber = ({ onSerialNumberFetched }) => {
    const [listServices, setListServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [serialInfo, setSerialInfo] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading

    useEffect(() => {
        fetchListServices();
    }, []);

    const fetchListServices = async () => {
        try {
            const token = Cookies.get('Access token');
            if (!token) {
                message.error('Token không tồn tại, vui lòng đăng nhập lại.');
                return;
            }

            setLoading(true); // Khi bắt đầu fetch, hiển thị loading

            const response = await apiGetServies(token);
            if (response && response.result === 1 && response.msg.length > 0) {
                setListServices(response.msg);
            } else {
                setListServices([]);
                message.error(response.msg || 'Không tìm thấy dữ liệu');
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            message.error('Có lỗi xảy ra khi lấy danh sách dịch vụ');
        } finally {
            setLoading(false); // Đảm bảo trạng thái loading tắt sau khi fetch xong
        }
    };

    const handleSelectChange = (value) => {
        setSelectedServiceId(value);
    };

    const fetchSerialNumber = async () => {
        try {
            const token = Cookies.get('Access token');
            if (!token) {
                message.error('Token không tồn tại, vui lòng đăng nhập lại.');
                return;
            }

            setLoading(true); // Khi bắt đầu fetch số serial, hiển thị loading

            const response = await apiGetSerialNumber(token, selectedServiceId);
            if (response) {
                const newSerialInfo = {
                    serviceName: response.msg.service_name,
                    serialNumber: response.msg.serial_number,
                    createdAt: new Date(response.msg.created_at).toLocaleString(),
                };
                setSerialInfo(newSerialInfo);
                setIsModalVisible(true);

                // Gọi hàm truyền từ component cha để cập nhật dữ liệu
                if (onSerialNumberFetched) {
                    onSerialNumberFetched(newSerialInfo); // Truyền dữ liệu mới lên cha
                }
            }
        } catch (error) {
            console.error('Error fetching serial number:', error);
            message.error('Có lỗi xảy ra khi lấy số serial');
        } finally {
            setLoading(false); // Đảm bảo trạng thái loading tắt sau khi fetch xong
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSerialInfo(null);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4">
                <Select
                    placeholder="Chọn dịch vụ"
                    style={{ width: 250 }}
                    onChange={handleSelectChange}
                    value={selectedServiceId || undefined}
                    className="rounded-lg shadow-md border-gray-300"
                >
                    {listServices.map((item) => (
                        <Option key={item._id} value={item._id}>
                            {item.name}
                        </Option>
                    ))}
                </Select>
            </div>

            <Button
                type="primary"
                onClick={fetchSerialNumber}
                disabled={!selectedServiceId}
                loading={loading}
                icon={loading ? <LoadingOutlined /> : null}
                className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg shadow-md"
            >
                Bốc số
            </Button>

            <Modal
                title="Thông tin số serial"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                onOk={handleCloseModal}
                okText="Đóng"
                className="custom-modal"
                centered
                footer={null}
                destroyOnClose
            >
                {serialInfo && (
                    <div className="text-gray-700">
                        <p>
                            <strong>Tên dịch vụ:</strong> {serialInfo.serviceName}
                        </p>
                        <p>
                            <strong>Số serial:</strong> {serialInfo.serialNumber}
                        </p>
                        <p>
                            <strong>Ngày tạo:</strong> {serialInfo.createdAt}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default GetSerialNumber;
