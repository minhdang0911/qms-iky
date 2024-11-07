import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FaPlus, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import { Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { apiCreateServies, apiGetServies, apiDeleteServies, apiUpdateServies } from '../apis/service';

const ModalServices = ({ isShowModal, onClose, token, onCustomer }) => {
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [serialNumberStart, setSerialNumberStart] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [listServies, setListServices] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

    useEffect(() => {
        const token = Cookies.get('Access token');
        const fetchListServies = async () => {
            try {
                if (!token) {
                    return;
                }

                const response = await apiGetServies(token);
                if (response && response.result === 1 && response.msg.length > 0) {
                    setListServices(response?.msg);
                } else {
                    setListServices([]);
                    toast.error(response.msg || 'Không tìm thấy dữ liệu');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchListServies();
    }, []);

    const resetForm = () => {
        setName('');
        setTime('');
        setSerialNumberStart('');
        setSelectedIndex(null);
    };

    const handleSave = async () => {
        const token = Cookies.get('Access token');
        try {
            if (selectedIndex === null) {
                // Thêm mới dịch vụ
                const response = await apiCreateServies(token, name, time, serialNumberStart);
                if (response && response.result === 1) {
                    toast.success('Dịch vụ đã được tạo thành công!');
                    onCustomer();
                    setListServices((prevList) => [
                        ...prevList,
                        { name, time: parseInt(time), serial_number_start: serialNumberStart },
                    ]);
                    resetForm();
                } else {
                    toast.error('Không thể tạo dịch vụ, vui lòng thử lại.');
                }
            } else {
                // Sửa dịch vụ
                const serviceId = listServies[selectedIndex]._id;
                const response = await apiUpdateServies(token, name, serialNumberStart, serviceId);
                if (response && response.result === 1) {
                    toast.success('Dịch vụ đã được sửa thành công!');
                    onCustomer();
                    setListServices((prevList) => {
                        const updatedList = [...prevList];
                        updatedList[selectedIndex] = {
                            ...updatedList[selectedIndex],
                            name,
                            time: parseInt(time),
                            serial_number_start: serialNumberStart,
                        };
                        return updatedList;
                    });
                    resetForm();
                } else {
                    toast.error('Không thể sửa dịch vụ, vui lòng thử lại.');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi khi thao tác với dịch vụ.');
        }
    };

    const handleRowClick = (index) => {
        const selectedItem = listServies[index];
        setSelectedIndex(index);
        setName(selectedItem.name);
        setTime(selectedItem.time);
        setSerialNumberStart(selectedItem.serial_number_start);
    };

    const handleDelete = async (id) => {
        try {
            const token = Cookies.get('Access token');
            await apiDeleteServies(token, id);
            onCustomer();
            setListServices((prevList) => prevList.filter((item) => item._id !== id));
            toast.success('Dịch vụ đã được xóa thành công!');
            setShowConfirm(false);
        } catch (error) {
            console.error(error);
            toast.error('Xóa dịch vụ không thành công!');
        }
    };

    const handleShowConfirm = (id) => {
        setSelectedIdToDelete(id);
        setShowConfirm(true);
    };

    return (
        <>
            <Modal show={isShowModal} onHide={onClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedIndex === null ? 'Khai báo dịch vụ' : 'Chỉnh sửa dịch vụ'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row>
                            <Col xs={12} md={4} className="mb-3">
                                <div className="d-flex flex-column">
                                    <Button variant="primary" className="mb-2" onClick={resetForm} size="sm">
                                        <FaPlus /> Thêm mới
                                    </Button>

                                    <Button variant="success" onClick={handleSave} size="sm">
                                        <FaSave /> Lưu
                                    </Button>
                                </div>
                            </Col>
                            <Col xs={12} md={8}>
                                <h5>Thông tin</h5>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Thời gian (phút)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Nhập thời gian (phút)"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Số serial bắt đầu</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập số serial bắt đầu"
                                            value={serialNumberStart}
                                            onChange={(e) => setSerialNumberStart(e.target.value)}
                                        />
                                    </Form.Group>
                                </Form>
                                <div
                                    className="table-category-responsive"
                                    style={{
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        overflowX: 'auto',
                                    }}
                                >
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Tên</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listServies?.map((items, index) => (
                                                <tr key={index} onClick={() => handleRowClick(index)}>
                                                    <td>{items?.name}</td>
                                                    <td>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => handleShowConfirm(items._id)}
                                                            size="sm"
                                                            className="btn-delete-services"
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                        <Button
                                                            style={{ marginLeft: '5px' }}
                                                            variant="warning"
                                                            onClick={() => handleRowClick(index)}
                                                            size="sm"
                                                            className="btn-edit-services"
                                                        >
                                                            <FaEdit /> Sửa
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa mục này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)} size="sm">
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(selectedIdToDelete)} size="sm">
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalServices;
