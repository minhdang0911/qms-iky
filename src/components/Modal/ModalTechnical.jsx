import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FaPlus, FaEdit, FaSave } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { apiCreateTechnical, apiGetTechnical, apiUpdateTechnical, apiDeleteTechnical } from '../apis/technical';

const ModalTechnical = ({ dataUser, isShowModal, onClose }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [listTechnical, setListTechnical] = useState([]);
    const [selectedId, setSelectedId] = useState(null); // Thêm biến để lưu _id của kỹ thuật viên được chọn

    const resetForm = () => {
        setName('');
        setPhone('');
        setSelectedIndex(null);
        setSelectedId(null); // Reset _id khi đặt lại form
    };

    const handleRowClick = (index) => {
        const selectedItem = listTechnical[index];
        setSelectedIndex(index);
        setSelectedId(selectedItem._id); // Lưu _id vào state
        setName(selectedItem.name);
        setPhone(selectedItem.phone);
    };

    useEffect(() => {
        const token = Cookies.get('Access token');
        const fetchListTechnical = async () => {
            const response = await apiGetTechnical(token);
            setListTechnical(response?.msg);
        };

        fetchListTechnical();
    }, []);

    const handleSave = async () => {
        const token = Cookies.get('Access token');

        if (selectedIndex === null) {
            if (!name || !phone) {
                toast.error('Vui lòng nhập đầy đủ thông tin');
                return;
            }
            // Thêm mới
            const response = await apiCreateTechnical(token, name, phone);
            if (response?.result === 1) {
                toast.success('Tạo kỹ thuật viên thành công');
                setListTechnical((prevList) => [...prevList, { _id: response.newTechnicalId, name, phone }]);
                resetForm();
            } else {
                toast.error('Tạo thất bại');
            }
        } else {
            // Cập nhật
            const selectedItem = listTechnical[selectedIndex];
            const response = await apiUpdateTechnical(token, name, phone, selectedItem._id);
            if (response) {
                toast.success('Cập nhật kỹ thuật viên thành công');
                setListTechnical((prevList) => {
                    const updatedList = [...prevList];
                    updatedList[selectedIndex] = { ...selectedItem, name, phone };
                    return updatedList;
                });
                resetForm();
            } else {
                toast.error('Cập nhật thất bại');
            }
        }
    };

    const handleDelete = async () => {
        const token = Cookies.get('Access token');

        try {
            await apiDeleteTechnical(token, selectedId);
            toast.success('Xóa kỹ thuật viên thành công');
            setListTechnical((prevList) => prevList.filter((item) => item._id !== selectedId)); // Cập nhật danh sách sau khi xóa
            setShowConfirm(false);
            resetForm(); // Reset form sau khi xóa
        } catch (error) {
            toast.error('Xóa kỹ thuật viên thất bại');
        }
    };

    return (
        <>
            <Modal show={isShowModal} onHide={onClose} size="lg" className="modal-technical">
                <Modal.Header closeButton>
                    <Modal.Title>Khai báo kỹ thuật viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex">
                        <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
                            <div className="d-flex flex-column">
                                <Button variant="primary" className="mb-2" onClick={resetForm}>
                                    <FaPlus /> Thêm mới
                                </Button>
                                <Button
                                    variant="warning"
                                    className="mb-2"
                                    onClick={() => {
                                        if (selectedIndex !== null) handleRowClick(selectedIndex);
                                        else toast.error('Vui lòng chọn kỹ thuật viên để sửa.');
                                    }}
                                >
                                    <FaEdit /> Sửa
                                </Button>
                                <Button
                                    variant="danger"
                                    className="mb-2"
                                    onClick={() => setShowConfirm(true)}
                                    disabled={selectedIndex === null}
                                >
                                    <IoClose /> Xóa
                                </Button>
                                <Button variant="success" onClick={handleSave}>
                                    <FaSave /> Lưu
                                </Button>
                            </div>
                        </div>
                        <div className="flex-grow-1 ps-4">
                            <h5>Thông tin</h5>
                            <Form>
                                <div className="d-flex mb-3 container-technical">
                                    <Form.Group className="me-3" style={{ flex: 1 }}>
                                        <Form.Label>Họ tên(*)</Form.Label>
                                        <Form.Control
                                            className="input-technical"
                                            type="text"
                                            placeholder="Nhập họ tên"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group style={{ flex: 1 }}>
                                        <Form.Label>Số điện thoại</Form.Label>
                                        <Form.Control
                                            className="input-technical"
                                            type="text"
                                            placeholder="Nhập số điện thoại"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                            </Form>
                            <Table striped bordered hover className="table-technical">
                                <thead>
                                    <tr>
                                        <th>Họ và tên</th>
                                        <th>Số điện thoại</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listTechnical?.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            onClick={() => handleRowClick(index)}
                                            style={{
                                                backgroundColor: selectedIndex === index ? '#f0f8ff' : 'transparent', // Highlight selected row
                                            }}
                                        >
                                            <td>{item.name}</td>
                                            <td>{item.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có muốn xóa kỹ thuật viên này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalTechnical;
