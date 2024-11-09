import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { apiIncreaseTime } from '../apis/customer';
import { notification } from 'antd';
import Cookies from 'js-cookie';

const ModalIncreaseTime = ({ isShowModal, onClose, selectedCar, onUpdateCars }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [increaseTime, setIncreaseTime] = useState('');

    // Toggle open/close
    const toggleOpen = () => setIsOpen((prev) => !prev);

    // Gọi API để tăng thời gian sửa chữa
    const handleIncreaseTime = async () => {
        const token = Cookies.get('Access token');
        const id = selectedCar.customers._id;
        const time = increaseTime;

        if (!time) {
            notification.error({
                message: 'Lỗi',
                description: 'Vui lòng nhập thời gian tăng.',
            });
            return;
        }

        try {
            const response = await apiIncreaseTime(token, id, time);
            if (response) {
                notification.success({
                    message: 'Thành công',
                    description: `Đã tăng thời gian sửa chữa cho khách hàng ${selectedCar.customers.name}.`,
                });
                onUpdateCars();
                onClose();
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tăng thời gian sửa chữa.',
            });
        }
    };

    return (
        <Modal show={isShowModal} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh thời gian sửa chữa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex">
                    <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
                        <div
                            className="d-flex justify-content-between align-items-center"
                            onClick={toggleOpen}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="fw-semibold">Chức năng</span>
                            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        <hr />
                        {isOpen && (
                            <div>
                                <div
                                    className="d-flex justify-content-between align-items-center mb-3"
                                    style={{ cursor: 'pointer' }}
                                    onClick={onClose}
                                >
                                    <span>Bỏ qua</span>
                                    <FaTimes className="text-danger" />
                                </div>
                                <div
                                    className={`d-flex justify-content-between align-items-center ${
                                        increaseTime ? '' : 'opacity-50'
                                    }`}
                                    style={{ cursor: increaseTime ? 'pointer' : 'not-allowed' }}
                                    onClick={increaseTime ? handleIncreaseTime : null}
                                >
                                    <span>Đồng ý</span>
                                    <FaCheck className="text-success" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-grow-1 ps-4">
                        <h5 className="fw-bold text-secondary mb-3">Thông tin</h5>
                        <Form>
                            <Form.Group className="mb-3 d-flex align-items-center">
                                <Form.Label className="me-3" style={{ whiteSpace: 'nowrap' }}>
                                    Thời gian (phút)
                                </Form.Label>
                                <Form.Control
                                    placeholder="Nhập thời gian tăng"
                                    value={increaseTime}
                                    onChange={(e) => setIncreaseTime(e.target.value)}
                                    type="number"
                                    className="rounded"
                                    style={{ flex: 1, padding: '10px' }}
                                />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalIncreaseTime;
