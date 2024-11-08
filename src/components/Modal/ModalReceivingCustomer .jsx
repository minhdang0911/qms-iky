import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import moment from 'moment';
import { apiCreateReceptionVehicle, apiGetLiftTable } from '../apis/liftTable';
import { apiGetCategory } from '../apis/category';
import { apiAddCustomerCategory, apiGetRepairList, apiDeleteRepairCategory } from '../apis/customer';
import Cookies from 'js-cookie';

const ModalReceivingCustomer = ({ isShowModal, onClose, queueId, onCustomer, onUpdateCars }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedService, setSelectedService] = useState('');
    const [liftTable, setLiftTable] = useState([]);
    const [category, setCategory] = useState([]);
    const [services, setServices] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [listRepair, setListRepair] = useState([]);
    const [name, setName] = useState('');
    const [licensePlate, setlicensePlate] = useState('');
    const [selectedLiftTable, setSelectedLiftTable] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const token = Cookies.get('Access token');
        const fetchLiftTable = async () => {
            const response = await apiGetLiftTable(token);
            setLiftTable(response?.msg);
        };

        fetchLiftTable();
    }, []);

    useEffect(() => {
        const token = Cookies.get('Access token');
        const fetchRepairlist = async () => {
            const response = await apiGetRepairList(token, queueId);
            setListRepair(response?.msg);
        };

        fetchRepairlist();
    }, [queueId]);

    useEffect(() => {
        const token = Cookies.get('Access token');
        const fetchCategory = async () => {
            const response = await apiGetCategory(token);
            setCategory(response?.msg);
        };

        fetchCategory();
    }, []);

    useEffect(() => {
        // Kiểm tra nếu tất cả các trường bắt buộc đã có giá trị
        setIsFormValid(name.trim() !== '' && licensePlate.trim() !== '' && selectedLiftTable !== '');
    }, [name, licensePlate, selectedLiftTable]);

    const handleAddCategory = async () => {
        const token = Cookies.get('Access token');

        if (!selectedService) {
            toast.error('Vui lòng chọn dịch vụ!');
            return;
        }

        try {
            await apiAddCustomerCategory(token, queueId, selectedService);
            toast.success('Đã thêm danh mục sửa chữa cho khách hàng!');

            const response = await apiGetRepairList(token, queueId);
            setListRepair(response?.msg);
            setSelectedService('');
        } catch (error) {
            toast.error('Lỗi khi thêm danh mục: ' + error.message);
        }
    };

    const handleDeleteRepairCategory = async () => {
        const token = Cookies.get('Access token');
        const repairItem = listRepair[selectedIndex];

        if (repairItem) {
            try {
                await apiDeleteRepairCategory(token, queueId, repairItem._id);
                toast.success('Xóa dịch vụ thành công!');
                setListRepair((prev) => prev.filter((_, index) => index !== selectedIndex));
            } catch (error) {
                toast.error('Lỗi khi xóa dịch vụ: ' + error.message);
            }
        }

        setShowConfirm(false);
        setSelectedIndex(null);
    };

    const handleAccept = async () => {
        const token = Cookies.get('Access token');

        try {
            await apiCreateReceptionVehicle(token, selectedLiftTable, queueId, name, licensePlate);
            onUpdateCars();
            onCustomer();
            toast.success('Tiếp nhận phương tiện thành công!');
            onClose();
        } catch (error) {
            toast.error('Lỗi khi tiếp nhận phương tiện: ' + error.message);
        }
    };

    return (
        <>
            <Modal show={isShowModal} onHide={onClose} size="xl" dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>Tiếp nhận khách</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="d-flex flex-column flex-md-row">
                        <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
                            <div
                                className="d-flex justify-content-between align-items-center"
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
                                        onClick={onClose}
                                    >
                                        <span>Bỏ qua</span>
                                        <FaTimes className="text-danger" />
                                    </div>
                                    <div
                                        onClick={isFormValid ? handleAccept : null}
                                        className={`d-flex justify-content-between align-items-center ${
                                            !isFormValid ? 'text-muted' : ''
                                        }`}
                                        style={{ cursor: isFormValid ? 'pointer' : 'not-allowed' }}
                                    >
                                        <span>Đồng ý</span>
                                        <FaCheck className={isFormValid ? 'text-success' : ''} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-grow-1 ps-4">
                            <h5>Thông tin khách hàng</h5>
                            <Form>
                                <div className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Họ và tên</Form.Label>
                                        <Form.Control
                                            className="input-technical"
                                            type="text"
                                            placeholder="Nhập họ tên"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>

                                <div className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Biển số xe</Form.Label>
                                        <Form.Control
                                            className="input-technical"
                                            type="text"
                                            placeholder="Nhập biển số xe"
                                            value={licensePlate}
                                            onChange={(e) => setlicensePlate(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>

                                <div className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Bàn nâng</Form.Label>
                                        <Form.Select
                                            className="input-customer"
                                            onChange={(e) => setSelectedLiftTable(e.target.value)}
                                            value={selectedLiftTable}
                                        >
                                            <option>Chọn bàn nâng</option>
                                            {liftTable
                                                ?.filter((item) => moment(item.createdAt).isSame(moment(), 'day'))
                                                .map((item) => (
                                                    <option value={item?._id} key={item?._id}>
                                                        {item?.name}
                                                    </option>
                                                ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Nội dung sửa chữa</Form.Label>
                                        <Form.Select
                                            className="input-customer"
                                            value={selectedService}
                                            onChange={(e) => setSelectedService(e.target.value)}
                                        >
                                            <option>Chọn dịch vụ</option>
                                            {category?.map((items) => (
                                                <option key={items._id} value={items._id}>
                                                    {items?.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <Form.Group className="ms-3">
                                    <Button variant="primary" onClick={handleAddCategory}>
                                        Thêm
                                    </Button>
                                </Form.Group>
                            </Form>

                            <h5 className="mt-4">Danh sách dịch vụ</h5>
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Tên viết tắt</th>
                                            <th>Tên dịch vụ</th>
                                            <th>Thời gian</th>
                                            <th>Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listRepair?.map((item, index) => (
                                            <tr key={item._id}>
                                                <td>{item.abbreviation}</td>
                                                <td>{item.name}</td>
                                                <td>{moment(item.updatedAt).format('HH:mm DD/MM/YYYY')}</td>
                                                <td>
                                                    <FaTrash
                                                        className="text-danger cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedIndex(index);
                                                            setShowConfirm(true);
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc muốn xóa dịch vụ này không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDeleteRepairCategory}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalReceivingCustomer;
