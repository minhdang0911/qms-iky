import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { apiLiftTableReturnVehicle } from '../apis/liftTable';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const ModalReturnCar = ({ isShowModal, onClose, selectedCar, onDelete, onFinishCars }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    // Kiểm tra sự tồn tại của customers trong selectedCar
    const hasCustomer = selectedCar && selectedCar.customers && Object.keys(selectedCar.customers).length > 0;

    const { _id } = selectedCar;
    const token = Cookies.get('Access token');

    const HandleReturnVehicle = async () => {
        const response = await apiLiftTableReturnVehicle(token, _id);
        if (response.result === 1) {
            toast.success('Trả xe thành công');
            onFinishCars();
            onClose();
            onDelete(_id);
        }
    };

    return (
        <Modal show={isShowModal} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Trả xe</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="d-flex">
                    <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
                        <div
                            className="d-flex justify-content-between align-items-center"
                            onClick={toggleOpen}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>Chức năng</span>
                            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        <hr />
                        {isOpen && (
                            <div>
                                <div
                                    className="d-flex justify-content-between align-items-center mb-3"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span onClick={onClose}>Bỏ qua</span>
                                    <FaTimes className="text-danger" />
                                </div>
                                <div
                                    className="d-flex justify-content-between align-items-center"
                                    style={{
                                        cursor: 'pointer',
                                        pointerEvents: hasCustomer ? 'auto' : 'none',
                                        opacity: hasCustomer ? 1 : 0.5,
                                    }}
                                    onClick={hasCustomer ? HandleReturnVehicle : null}
                                >
                                    <span>Đồng ý</span>
                                    <FaCheck
                                        className={`text-success ${!hasCustomer ? 'disabled' : ''}`}
                                        style={{
                                            pointerEvents: hasCustomer ? 'auto' : 'none',
                                            opacity: hasCustomer ? 1 : 0.5,
                                            color: hasCustomer ? 'green' : '#ccc',
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-grow-1 ps-4">
                        <h5>Thông tin</h5>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Ghi chú (nếu có)</Form.Label>
                                <Form.Control type="number" placeholder="Nhập thời gian (phút)" value />
                            </Form.Group>
                        </Form>

                        <Form.Group className="mb-3">
                            <Form.Label>Thông báo (nếu có)</Form.Label>
                            <Form.Control type="number" placeholder="Nhập thời gian (phút)" value />
                        </Form.Group>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalReturnCar;
