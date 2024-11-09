import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { apiGetTechnical } from '../apis/technical';
import { apiCreateLiftTable } from '../apis/liftTable';
import Cookies from 'js-cookie';

const ModalCreateLiftingTable = ({ isShowModal, onClose, onUpdateCars }) => {
    const [liftingTable, setLiftingTable] = useState('');
    const [description, setDescription] = useState('');
    const [technician, setTechnician] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const [listTechnical, setListTechnical] = useState([]);

    const toggleOpen = () => setIsOpen((prev) => !prev);

    const resetForm = () => {
        setDescription('');
        setLiftingTable('');
        setTechnician('');
    };

    // Fetch list of technicians on component mount
    useEffect(() => {
        const fetchListTechnical = async () => {
            const token = Cookies.get('Access token');
            const response = await apiGetTechnical(token);
            setListTechnical(response?.msg);
        };

        fetchListTechnical();
    }, []);

    const handleSave = async () => {
        const token = Cookies.get('Access token');

        // Validate required fields
        if (!liftingTable || !technician) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const response = await apiCreateLiftTable(token, liftingTable, technician, description);
            if (response) {
                toast.success('Tạo bàn nâng thành công');
                resetForm();
                onUpdateCars();
                onClose();
            }
        } catch (error) {
            toast.error('Tạo bàn nâng thất bại');
        }
    };

    const technicalOptions = useMemo(() => {
        return listTechnical.map((tech) => (
            <option key={tech._id} value={tech._id}>
                {tech.name}
            </option>
        ));
    }, [listTechnical]);

    return (
        <Modal show={isShowModal} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Tạo bàn nâng</Modal.Title>
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
                                    onClick={onClose}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span>Bỏ qua</span>
                                    <FaTimes className="text-danger" />
                                </div>
                                <div
                                    className="d-flex justify-content-between align-items-center"
                                    onClick={handleSave}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span>Đồng ý</span>
                                    <FaCheck className="text-success" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-grow-1 ps-4">
                        <h5>Thông tin</h5>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Bàn nâng</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập thông tin bàn nâng"
                                    value={liftingTable}
                                    onChange={(e) => setLiftingTable(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Kỹ thuật viên</Form.Label>
                                <Form.Select value={technician} onChange={(e) => setTechnician(e.target.value)}>
                                    <option value="">Chọn kỹ thuật viên</option>
                                    {technicalOptions}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập thông tin mô tả"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCreateLiftingTable;
