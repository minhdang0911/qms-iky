import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Form, Input, Select, Button, Table, Pagination, Modal, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import Cookies from 'js-cookie';

const { Option } = Select;
const { Text } = Typography;

const ManageTechnical = () => {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [storeId, setStoreId] = useState('');
    const [stores, setStores] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTechnicians, setTotalTechnicians] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const limit = 10;
    const [editingTechnician, setEditingTechnician] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingTechnicianId, setDeletingTechnicianId] = useState(null);

    const handleModalOpen = (technician) => {
        if (technician) {
            setFullName(technician.fullName);
            setPhoneNumber(technician.phoneNumber);
            setStoreId(technician.store ? technician.store._id : '');
            setEditingTechnician(technician);
        } else {
            resetForm();
            setEditingTechnician(null);
        }
        setIsModalVisible(true);
    };

    const handleDeleteModalOpen = (id) => {
        setDeletingTechnicianId(id);
        setIsDeleteModalVisible(true);
    };

    const handleResponse = (response, successMessage) => {
        switch (response.status) {
            case 405:
                toast.error('Số điện thoại đã được sử dụng');
                break;
            case 400:
                toast.error('Định dạng sđt không hợp lệ');
                break;
            case 404:
                toast.error('Kĩ thuật viên đã tồn tại');
                break;
            case 401:
                toast.error('Tên không được chứa số hoặc ký tự đặc biệt');
                break;
            case 201:
            case 200:
                toast.success(successMessage);
                resetForm();
                setIsModalVisible(false);
                break;
            default:
                toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
                break;
        }
    };

    const resetForm = () => {
        setFullName('');
        setPhoneNumber('');
        setStoreId('');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const startIndex = useMemo(() => (currentPage - 1) * limit + 1, [currentPage, limit]);
    const endIndex = useMemo(
        () => Math.min(currentPage * limit, totalTechnicians),
        [currentPage, totalTechnicians, limit],
    );

    const displayedTechnicians = useMemo(() => {
        return technicians
            .filter(
                (technician) =>
                    technician.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    technician.phoneNumber.includes(searchQuery),
            )
            .map((technician) => ({
                ...technician,
                store: technician.store ? technician.store.name : 'Chưa có cửa hàng',
            }));
    }, [technicians, searchQuery]);

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
            width: '30%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: '30%',
        },
        {
            title: 'Cửa hàng',
            dataIndex: 'store',
            key: 'store',
            render: (store) => store || 'Chưa có cửa hàng',
            width: '30%',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleModalOpen(record)}
                        size="small"
                        style={{ marginLeft: 5 }}
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteModalOpen(record._id)}
                        danger
                        size="small"
                        style={{ marginLeft: 5 }}
                    >
                        Xóa
                    </Button>
                </>
            ),
            width: '10%',
        },
    ];

    return (
        <div
            style={{
                padding: '20px',
                maxWidth: '800px',
                margin: '0 auto',
                borderRadius: '8px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Quản Lý Kỹ Thuật Viên</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Button icon={<PlusOutlined />} onClick={() => handleModalOpen(null)} type="primary">
                    Thêm
                </Button>

                <Input
                    placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    suffix={<SearchOutlined />}
                    style={{ width: '300px', borderRadius: '4px' }}
                />
            </div>

            <Table
                dataSource={displayedTechnicians}
                columns={columns}
                rowKey="_id"
                pagination={false}
                scroll={{ x: '100%' }} // Điều chỉnh chiều rộng bảng
                style={{ borderRadius: '4px' }} // Thêm padding cho bảng
                onChange={(pagination, filters, sorter) => {
                    const sortOrder = sorter.order || 'ascend';
                    const sortField = sorter.field || 'fullName';
                }}
            />

            <Pagination
                current={currentPage}
                pageSize={limit}
                total={totalTechnicians}
                onChange={handlePageChange}
                style={{ marginTop: '16px', textAlign: 'right', display: 'flex', justifyContent: 'center' }}
            />

            <p style={{ textAlign: 'center', marginTop: '5px' }}>
                Hiển thị {startIndex} đến {endIndex} của {totalTechnicians} kĩ thuật viên
            </p>

            <Modal
                title={editingTechnician ? 'Cập nhật kỹ thuật viên' : 'Thêm kỹ thuật viên'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                okText={editingTechnician ? 'Cập nhật' : 'Thêm'}
            >
                <Form layout="vertical">
                    <Form.Item label="Họ tên">
                        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Số điện thoại">
                        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </Form.Item>
                    {!editingTechnician && (
                        <Form.Item label="Cửa hàng">
                            <Select value={storeId} onChange={setStoreId} placeholder="Chọn cửa hàng">
                                {stores.map((store) => (
                                    <Option key={store._id} value={store._id}>
                                        {store.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            <Modal
                title="Xóa Kỹ Thuật Viên"
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Xóa"
                cancelText="Hủy"
                closable={false}
            >
                <Text>Bạn có chắc chắn muốn xóa kỹ thuật viên này không?</Text>
            </Modal>
        </div>
    );
};

export default ManageTechnical;
