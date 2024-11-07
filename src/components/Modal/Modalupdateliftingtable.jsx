import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button } from 'antd';
import { toast } from 'react-toastify';
import { apiUpdateLiftTable } from '../apis/liftTable';
import { apiGetTechnical } from '../apis/technical';
import Cookies from 'js-cookie';

const ModalUpdateLiftingTable = ({ isShowModal, onClose, selectedCar, onUpdateCars }) => {
    const [liftingTable, setLiftingTable] = useState('');
    const [technicians, setTechnicians] = useState([]);
    const [technicianId, setTechnicianId] = useState('');
    const [description, setDescription] = useState('');

    // Fetch technician list on component mount
    useEffect(() => {
        const token = Cookies.get('Access token');

        const fetchTechnician = async () => {
            const response = await apiGetTechnical(token);
            setTechnicians(response.msg);
        };

        fetchTechnician();
    }, []);

    // Set lifting table and technician details when selectedCar changes
    useEffect(() => {
        if (selectedCar && technicians.length > 0) {
            setLiftingTable(selectedCar.name);
            const technicianFound = technicians?.find((tech) => tech?.name === selectedCar?.technician);
            setTechnicianId(technicianFound ? technicianFound._id : technicians[0]?._id || '');
            setDescription(selectedCar?.customers?.description || '');
        }
    }, [selectedCar, technicians]);

    // Memoize the update handler to prevent unnecessary re-creation
    const handleUpdate = useMemo(() => {
        return async () => {
            const token = Cookies.get('Access token');
            try {
                const response = await apiUpdateLiftTable(token, liftingTable, technicianId, selectedCar._id);
                if (response.result === 1) {
                    toast.success('Cập nhật bàn nâng thành công');
                    onUpdateCars();
                    onClose();
                } else {
                    toast.error('Cập nhật không thành công');
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra');
            }
        };
    }, [liftingTable, technicianId, selectedCar, onUpdateCars, onClose]);

    return (
        <Modal show={isShowModal} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật bàn nâng</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Bàn nâng</Form.Label>
                        <Form.Control
                            type="text"
                            value={liftingTable}
                            onChange={(e) => setLiftingTable(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Kỹ thuật viên</Form.Label>
                        <Form.Select
                            aria-label="Chọn kỹ thuật viên"
                            value={technicianId}
                            onChange={(e) => setTechnicianId(e.target.value)}
                        >
                            {technicians.map((technician) => (
                                <option key={technician._id} value={technician._id}>
                                    {technician.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button type="primary" onClick={handleUpdate}>
                    Cập nhật
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateLiftingTable;
