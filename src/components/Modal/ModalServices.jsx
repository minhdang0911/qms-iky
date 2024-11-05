import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FaPlus, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import { Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { apiCreateServies, apiGetServies, apiDeleteServies } from '../apis/service';

const ModalServices = ({ isShowModal, onClose, token, onCustomer }) => {
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [serialNumberStart, setSerialNumberStart] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [dataCategory, setDataCategory] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [searchAbbreviation, setSearchAbbreviation] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [listServies, setListServices] = useState([]);
    const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

    useEffect(() => {
        setFilteredCategories(dataCategory);
    }, [dataCategory]);

    const resetForm = () => {
        setName('');
        setTime('');
        setSerialNumberStart(''); // Reset serial number
        setSelectedIndex(null);
        setSearchAbbreviation('');
    };

    const handleSave = async () => {
        try {
            const token = Cookies.get('Access token');
            const response = await apiCreateServies(token, name, time, serialNumberStart); // Thêm serialNumberStart
            if (response && response.result === 1) {
                toast.success('Dịch vụ đã được tạo thành công!');
                onCustomer();
                setListServices((prevList) => [
                    ...prevList,
                    { name: name, time: parseInt(time), serial_number_start: serialNumberStart }, // Lưu serial number mới
                ]);
                resetForm();
            } else {
                toast.error('Không thể tạo dịch vụ, vui lòng thử lại.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi khi tạo dịch vụ.');
        }
    };

    const handleRowClick = (index) => {
        const selectedItem = filteredCategories[index];
        setSelectedIndex(dataCategory.indexOf(selectedItem));
        setName(selectedItem.name);
        setTime(selectedItem.time);
    };

    useEffect(() => {
        const token = Cookies.get('Access token');
        const fetchListServies = async () => {
            try {
                const token = Cookies.get('Access token');
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
                    <Modal.Title>Khai báo dịch vụ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row>
                            <Col xs={12} md={4} className="mb-3">
                                <div className="d-flex flex-column">
                                    <Button variant="primary" className="mb-2" onClick={resetForm}>
                                        <FaPlus /> Thêm mới
                                    </Button>
                                    <Button
                                        variant="warning"
                                        className="mb-2"
                                        onClick={() => {
                                            if (selectedIndex !== null) {
                                                const selectedItem = filteredCategories[selectedIndex];
                                                setName(selectedItem.name);
                                                setTime(selectedItem.time);
                                                setSerialNumberStart(selectedItem.serial_number_start || '');
                                            }
                                        }}
                                    >
                                        <FaEdit /> Sửa
                                    </Button>
                                    <Button variant="success" onClick={handleSave}>
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
                                <div className="table-category-responsive">
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>Tên</th>
                                                    <th>Xóa</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listServies?.map((items, index) => (
                                                    <tr key={index}>
                                                        <td>{items?.name}</td>
                                                        <td>
                                                            <Button
                                                                variant="danger"
                                                                onClick={() => handleShowConfirm(items._id)}
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
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
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(selectedIdToDelete)}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalServices;
