import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Table, Input, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { apiCreateCategory, apiGetCategory, apiDeleteCategory, apiUpdateCategory } from '../apis/category';

const ModalCategory = ({ isShowModal, onClose, token }) => {
    const [formData, setFormData] = useState({ name: '', shortName: '', time: '' });
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [shortName, setShortName] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [listCategory, setListCategory] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchAbbreviation, setSearchAbbreviation] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    useEffect(() => {
        if (isShowModal && listCategory.length === 0) {
            fetchListCategory();
        }
    }, [isShowModal]);

    const fetchListCategory = async () => {
        try {
            const token = Cookies.get('Access token');
            if (!token) {
                toast.error('Token không tồn tại, vui lòng đăng nhập lại.');
                return;
            }

            const response = await apiGetCategory(token);
            if (response && response.result === 1 && response.msg.length > 0) {
                setListCategory(response.msg);
                setFilteredCategories(response.msg);
            } else {
                setListCategory([]);
                setFilteredCategories([]);
                toast.error(response.msg || 'Không tìm thấy dữ liệu'); // Hiển thị lỗi từ API nếu có
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setTime('');
        setShortName('');
        setSelectedId(null);
        setSearchAbbreviation('');
        setFilteredCategories(listCategory); // Reset to show all categories
    };

    const handleSave = async () => {
        try {
            const token = Cookies.get('Access token');
            let response;

            if (selectedId) {
                response = await apiUpdateCategory(token, selectedId, name, shortName, time);
                if (response && response.result === 1) {
                    toast.success('Danh mục đã được cập nhật thành công!');
                    setListCategory((prevList) =>
                        prevList.map((item) =>
                            item._id === selectedId
                                ? { ...item, name, short_name: shortName, time: parseInt(time) }
                                : item,
                        ),
                    );
                } else {
                    toast.error('Không thể cập nhật danh mục, vui lòng thử lại.');
                }
            } else {
                response = await apiCreateCategory(token, name, shortName, time);
                if (response && response.result === 1) {
                    toast.success('Danh mục đã được tạo thành công!');
                    setListCategory((prevList) => [
                        ...prevList,
                        { name, short_name: shortName, time: parseInt(time), _id: response.msg._id },
                    ]);
                } else {
                    toast.error('Không thể tạo danh mục, vui lòng thử lại.');
                }
            }
            fetchListCategory();
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi khi lưu danh mục.');
        }
    };

    const handleRowClick = (item) => {
        setSelectedId(item._id);
        setName(item.name);
        setTime(item.time);
        setShortName(item.short_name);
    };

    const handleFind = () => {
        const foundCategory = listCategory.filter((item) => item.short_name === searchAbbreviation);
        if (foundCategory.length > 0) {
            setFilteredCategories(foundCategory); // Chỉ hiển thị các danh mục tìm thấy
        } else {
            toast.error('Không tìm thấy danh mục với tên viết tắt này.');
            setFilteredCategories([]); // Hiển thị danh sách trống nếu không tìm thấy
        }
    };

    const handleClear = () => {
        setSearchAbbreviation('');
        setFilteredCategories(listCategory); // Hiển thị lại toàn bộ danh mục
    };

    const handleDelete = async (id) => {
        try {
            const token = Cookies.get('Access token');
            await apiDeleteCategory(token, id);
            toast.success('Xóa thành công!');
            fetchListCategory();
            setShowConfirm(false);
        } catch (error) {
            toast.error('Xóa không thành công!');
        }
    };

    const handleShowConfirm = (id) => {
        setSelectedId(id);
        setShowConfirm(true);
    };

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tên viết tắt',
            dataIndex: 'short_name',
            key: 'short_name',
        },
        {
            title: 'Thời gian (phút)',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Hành động',
            render: (text, record) => (
                <div>
                    <Button type="default" icon={<EditOutlined />} onClick={() => handleRowClick(record)}>
                        Sửa
                    </Button>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleShowConfirm(record._id)}
                        style={{ marginLeft: '5px' }}
                    >
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Modal
                title="Khai báo danh mục thời gian sửa chữa"
                visible={isShowModal}
                onCancel={onClose}
                footer={null}
                width={800}
            >
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={resetForm}
                            style={{
                                width: '80%',
                                marginBottom: 10,
                                borderRadius: 5,
                                fontWeight: 'bold',
                                padding: '10px 0',
                            }}
                        >
                            Thêm mới
                        </Button>
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={handleSave}
                            style={{
                                width: '80%',
                                marginBottom: 10,
                                borderRadius: 5,
                                fontWeight: 'bold',
                                padding: '10px 0',
                            }}
                        >
                            Lưu
                        </Button>
                    </Col>

                    <Col span={16}>
                        <Form layout="vertical">
                            <Form.Item label="Tên">
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên" />
                            </Form.Item>
                            <Form.Item label="Tên viết tắt">
                                <Input
                                    value={shortName}
                                    onChange={(e) => setShortName(e.target.value)}
                                    placeholder="Nhập tên viết tắt"
                                />
                            </Form.Item>
                            <Form.Item label="Thời gian (phút)">
                                <Input
                                    type="number"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    placeholder="Nhập thời gian (phút)"
                                />
                            </Form.Item>
                            <Form.Item label="Tìm kiếm" style={{ marginTop: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Input
                                        value={searchAbbreviation}
                                        onChange={(e) => setSearchAbbreviation(e.target.value)}
                                        placeholder="Nhập tên viết tắt để tìm"
                                        style={{ flex: 1, marginRight: 8 }}
                                    />
                                    <Button
                                        type="primary"
                                        onClick={handleFind}
                                        style={{
                                            width: '100px',
                                            borderRadius: 5,
                                            padding: '10px 0',
                                        }}
                                    >
                                        Tìm
                                    </Button>
                                    <Button
                                        type="default"
                                        onClick={handleClear}
                                        style={{
                                            width: '100px',
                                            borderRadius: 5,
                                            padding: '10px 0',
                                            marginLeft: 8,
                                        }}
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredCategories}
                    rowKey="_id"
                    pagination={false}
                    bordered
                    locale={{
                        emptyText: 'Không có danh mục nào được tìm thấy',
                    }}
                    style={{ marginTop: 20 }}
                    scroll={{ x: 'max-content' }}
                />
            </Modal>

            <Modal title="Xóa danh mục" visible={showConfirm} onCancel={() => setShowConfirm(false)} footer={null}>
                <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
                <Button type="danger" onClick={() => handleDelete(selectedId)}>
                    Xóa
                </Button>
                <Button onClick={() => setShowConfirm(false)} style={{ marginLeft: 8 }}>
                    Hủy
                </Button>
            </Modal>
        </>
    );
};

export default ModalCategory;
