import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './carliststaff.scss';
import icons from '../../Utils/icons';
import {
    Modalcreateliftingtable,
    Modalupdateliftingtable,
    Modalincreasetime,
    Modaldecreasetime,
    ModalCreateCustomer,
    ModalCategory,
    ModalLCD,
    ModalTechnical,
    ModalSynchronousLeb,
    ModalSynchronousCustomer,
    ModalConfigSystem,
    ModalCreateDatabase,
    ModalUpdateDatabase,
    ModalInfomation,
    ModalImport,
    ModalReceivingCustomer,
    ModalService,
    ModalReturnCar,
} from '../Modal';
import { toast } from 'react-toastify';
import { Modal, Button, Typography } from 'antd';
import logo from '../../assets/img/logocompany.png';
import Swal from 'sweetalert2';
import CreateStore from '../Admin/Store/ManageStore';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Accordion, Card, Table } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import { apiGetListRepair } from '../apis/liftTable';
import { apiGetFinshList, apiReceivedVehicle } from '../apis/customer';
const { TabPane } = Tabs;
const { Text } = Typography;

const Dashboard = () => {
    const [cars, setCars] = useState([]);
    const [receivedCustomers, setReceivedCustomers] = useState([]);
    const [returnCar, setReturnCar] = useState([]);
    // const [selectedCarRow, setSelectedCarRow] = useState(null);
    const [selectedCustomerRow, setSelectedCustomerRow] = useState(null);
    const [selectedReturnCarRow, setSelectedReturnCarRow] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [data, setData] = useState([]);
    const [hideStore, setHideStore] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [activeKey, setActiveKey] = useState('home');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    // const [selectedCar, setSelectedCar] = useState(null); // State lưu dữ liệu của hàng được chọn

    //api thực tế
    const [serviceWating, setServiceWaiting] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedService, setExpandedService] = useState(null);
    const [modalData, setModalData] = useState('');
    const [listRepair, setListRepair] = useState([]);
    const [activeRow, setActiveRow] = useState(null);
    const [finishList, setFinishList] = useState([]);

    const navigate = useNavigate();
    const acessToken = Cookies.get('Access token');

    const modals = [
        { key: 'isShowModalCreateLiftingTable', component: Modalcreateliftingtable },
        { key: 'isShowModalUpdateLiftingTable', component: Modalupdateliftingtable },
        { key: 'isShowModalIncreaseTime', component: Modalincreasetime },
        { key: 'isShowModalDecreaseTime', component: Modaldecreasetime },
        { key: 'isShowModalCreateCustomer', component: ModalCreateCustomer },
        { key: 'isShowModalCategory', component: ModalCategory },
        { key: 'isShowModalLCD', component: ModalLCD },
        { key: 'isShowModalTechnical', component: ModalTechnical },
        { key: 'isShowModalSynchronousLeb', component: ModalSynchronousLeb },
        { key: 'isShowModalSynchronousCustomer', component: ModalSynchronousCustomer },
        { key: 'isShowModalConfigSystem', component: ModalConfigSystem },
        { key: 'isShowModalCreateDatabase', component: ModalCreateDatabase },
        { key: 'isShowModalUpdateDatabase', component: ModalUpdateDatabase },
        { key: 'isShowModalInfomation', component: ModalInfomation },
        { key: 'isShowModalImport', component: ModalImport },
        { key: 'isShowModalReceivingCustomer', component: ModalReceivingCustomer },
        { key: 'isShowModalServices', component: ModalService },
        { key: 'isShowModalReturnCar', component: ModalReturnCar },
    ];

    const [modalStates, setModalStates] = useState({
        isShowModalCreateLiftingTable: false,
        isShowModalUpdateLiftingTable: false,
        isShowModalIncreaseTime: false,
        isShowModalDecreaseTime: false,
        isShowModalCreateCustomer: false,
        isShowModalCategory: false,
        isShowModalLCD: false,
        isShowModalTechnical: false,
        isShowModalSynchronousLeb: false,
        isShowModalSynchronousCustomer: false,
        isShowModalConfigSystem: false,
        isShowModalCreateDatabase: false,
        isShowModalUpdateDatabase: false,
        isShowModalInfomation: false,
        isShowModalImport: false,
        isShowModalReceivingCustomer: false,
        isShowModalServices: false,
        isShowModalReturnCar: false,
    });

    const {
        GoPlusCircle,
        IoMdCloseCircle,
        IoReloadOutline,
        LuClipboardEdit,
        FaArrowAltCircleDown,
        FaArrowAltCircleUp,
        TiSpanner,
        LuBookOpenCheck,
        RiUserShared2Fill,
        HiSpeakerphone,
        MdClose,
        GrPrint,
        SlClock,
        FaAddressCard,
        IoSettingsOutline,
        FaFlipboard,

        IoDocuments,
        FaEarthAmericas,
        HiQuestionMarkCircle,
        FaUser,
        FiLogOut,
        MdHomeRepairService,
    } = icons;

    useEffect(() => {
        if (!acessToken) {
            Swal.fire({
                title: 'Phiên đăng nhập đã hết hạn',
                text: 'Vui lòng đăng nhập lại',
                icon: 'warning',
                confirmButtonText: 'OK',
            }).then(() => {
                navigate('/login');
            });
        }
    }, [acessToken, navigate]);

    const toggleModal = (modalKey) => {
        setModalStates((prev) => ({
            ...prev,
            [modalKey]: !prev[modalKey],
        }));
    };

    const handleModalSubmit = ({ liftingTable, technician }) => {
        const newEntry = {
            technician,
            content: 'Kính chào quý khách',
            status: 'ĐÃ XONG' || 'Đã xong',
        };
        setCars((prevCars) => [...prevCars, newEntry]);
    };

    const handleModalSubmitCustomer = ({ customer, ID, licensePlate, time }) => {
        setReceivedCustomers((prevCustomers) => [...prevCustomers, { customer, ID, licensePlate, time }]);
    };

    const handleCustomerReturn = (index) => {
        setReceivedCustomers((prevCustomers) => prevCustomers.filter((_, i) => i !== index));
    };

    const handleToggleModal = (modalKey, queueId = null) => {
        toggleModal(modalKey);
        if (queueId) {
            // Cập nhật state với queueId
            setModalData((prevData) => ({
                ...prevData,
                [modalKey]: queueId, // Lưu _id của queue
            }));
        }
    };
    const fetchCustomer = async () => {
        const token = Cookies.get('Access token');

        try {
            const response = await fetch('/api/customers/queue-list', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('data', data);
            setServiceWaiting(data.msg);
            console.log(serviceWating);
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, []);

    const setSelectedCarRoww = (carId) => {
        const index = cars.findIndex((car) => car._id === carId);
        setSelectedIndex(index);
    };

    const toggleRow = (index) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index], // Đảo trạng thái mở/đóng của hàng
        }));
    };

    //api danh sách lấy số
    const toggleService = (index) => {
        setExpandedService((prev) => (prev === index ? null : index)); // Đóng mở bảng dịch vụ theo chỉ số
    };

    const fetchListRepair = async () => {
        try {
            const token = Cookies.get('Access token');
            if (!token) {
                return;
            }

            const response = await apiGetListRepair(token);
            if (response && response.result === 1 && response.msg.length > 0) {
                setListRepair(response?.msg);
            } else {
                setListRepair([]);
                toast.error(response.msg || 'Không tìm thấy dữ liệu'); // Hiển thị lỗi từ API nếu có
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchListRepair();
        fetchFinishList();
    }, []);

    const handleDeleteCar = (carId) => {
        setListRepair((prevList) => prevList.filter((item) => item._id !== carId));
    };

    const fetchFinishList = async () => {
        try {
            const token = Cookies.get('Access token');
            if (!token) {
                return;
            }

            const response = await apiGetFinshList(token);
            if (response && response.result === 1 && response.msg.length > 0) {
                setFinishList(response?.msg);
            } else {
                setFinishList([]);
                toast.error(response.msg || 'Không tìm thấy dữ liệu'); // Hiển thị lỗi từ API nếu có
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    //api danh sách xe chờ lấy

    const handleUpdateCars = () => {
        fetchListRepair();
    };

    const handleFetchReturnCar = () => {
        fetchFinishList();
    };

    const handleFetchCustomer = () => {
        fetchCustomer();
    };

    // xóa xe khỏi danh sách chờ lấy
    const handleReceivedVehicle = async (vehicleId) => {
        const token = Cookies.get('Access token');

        try {
            // Hiển thị modal xác nhận
            const result = await Swal.fire({
                title: 'Xác nhận',
                text: 'Bạn có chắc chắn khách đã nhận xe?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'OK',
                cancelButtonText: 'Hủy',
            });

            if (result.isConfirmed) {
                await apiReceivedVehicle(token, vehicleId);
                setFinishList((prevList) => prevList.filter((item) => item._id !== vehicleId));

                Swal.fire('Thành công', 'Xe đã được cập nhật.', 'success');
            }
        } catch (error) {
            Swal.fire('Lỗi', 'Không thể cập nhật xe. Vui lòng thử lại sau.', 'error');
        }
    };

    const handleLogout = () => {
        Cookies.remove('Access token');
        toast.success('Đăng xuất thành công');
        navigate('/login');
    };

    const token = Cookies.get('Access token');

    return (
        <>
            {token && (
                <div className="dashboard-container">
                    {!hideStore && <CreateStore dataUser={data} />}
                    {modals.map(
                        ({ key, component: ModalComponent }) =>
                            modalStates[key] && (
                                <div className="modal-overlay" key={key}>
                                    <ModalComponent
                                        isShowModal={modalStates[key]}
                                        onClose={() => toggleModal(key)}
                                        onSubmit={handleModalSubmit}
                                        selectedCar={listRepair.find((car) => car._id === activeRow)}
                                        onUpdate={handleModalSubmit}
                                        onHandle={handleModalSubmitCustomer}
                                        receivedCustomers={receivedCustomers}
                                        dataUser={data}
                                        cars={cars}
                                        selectedCustomer={selectedCustomer}
                                        queueId={modalData['isShowModalReceivingCustomer']}
                                        onDelete={handleDeleteCar}
                                        onUpdateCars={handleUpdateCars}
                                        onFinishCars={handleFetchReturnCar}
                                        onCustomer={handleFetchCustomer}
                                    />
                                </div>
                            ),
                    )}

                    <header className="header">
                        <img src={logo} alt="Logo" className="header-logo" loading="lazy" />
                        <div className="header-icons">
                            {/* {!isLoggedIn ? (
                                <div></div>
                            ) : (
                                // <FaUser onClick={handleLoginClick} className="icon login-icon" title="Đăng nhập" />
                                <>
                                    <Text style={{ marginRight: '10px', fontWeight: 'bold' }}>
                                        Chào Mừng {firstName} {lastName}
                                    </Text>
                               
                                </>
                            )} */}

                            {token ? (
                                <FiLogOut onClick={handleLogout} className="icon logout-icon" title="Đăng xuất" />
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </header>
                    <div>
                        <Tabs
                            activeKey={activeKey}
                            onChange={setActiveKey}
                            style={{ marginBottom: 16, marginLeft: 25 }}
                        >
                            <TabPane tab="Trang Chính" key="home">
                                <div className="card-grid">
                                    {/* Card content for "Trang Chính" */}
                                    <div className="card">
                                        <div className="cart-top">
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalCreateLiftingTable')}
                                            >
                                                <GoPlusCircle className="icon-plus" size={30} />
                                                <p className="text-function">Tạo bản nâng</p>
                                            </div>
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalDeleteLiftingTable')}
                                            >
                                                <IoMdCloseCircle className="icon-close" size={30} />
                                                <p className="text-function">Xóa bản nâng</p>
                                            </div>
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalUpdateLiftingTable')}
                                            >
                                                <LuClipboardEdit size={30} />
                                                <p className="text-function">Sửa bản nâng</p>
                                            </div>
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalSynchronousLeb')}
                                            >
                                                <IoReloadOutline className="icon-plus" size={30} />
                                                <p className="text-function">Đồng bộ bảng leb</p>
                                            </div>
                                        </div>
                                        <p className="function">Bảng nâng</p>
                                    </div>

                                    {/* Other cards for "Trang Chính" */}
                                    {/* Repeat similar structure for other cards */}
                                    <div className="card">
                                        <div className="cart-top">
                                            <div className="cart-center">
                                                <TiSpanner className="icon-plus" size={30} />
                                                <p className="text-function">Tiếp nhận xe</p>
                                            </div>
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalDecreaseTime')}
                                            >
                                                <FaArrowAltCircleDown className="icon-green" size={30} />
                                                <p className="text-function">Giảm thời gian</p>
                                            </div>
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalIncreaseTime')}
                                            >
                                                <FaArrowAltCircleUp className="icon-green" size={30} />
                                                <p className="text-function">Tăng thời gian</p>
                                            </div>
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalReturnCar')}
                                            >
                                                <LuBookOpenCheck size={30} />
                                                <p className="text-function">Trả xe</p>
                                            </div>
                                        </div>
                                        <p className="function">Thông tin sửa chữa</p>
                                    </div>

                                    <div className="card ">
                                        <div className="cart-top">
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalCreateCustomer')}
                                            >
                                                <RiUserShared2Fill size={30} />
                                                <p className="text-function"> Tiếp nhận khách</p>
                                            </div>

                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalSynchronousCustomer')}
                                            >
                                                <IoReloadOutline className="icon-plus" size={30} />
                                                <span className="text-function">Đồng bộ thông </span>
                                                <span className="text-function">tin khách hàng</span>
                                            </div>

                                            <div className="cart-center">
                                                <HiSpeakerphone className="icon-plus" size={30} />
                                                <p className="text-function">Thông báo</p>
                                            </div>

                                            <div className="cart-center">
                                                <MdClose className="icon-close" size={30} />
                                                <p className="text-function"> Tắt thông báo</p>
                                            </div>
                                        </div>
                                        <p className="function">Thông tin khách hàng</p>
                                    </div>

                                    <div className="card">
                                        <div className="cart-top">
                                            <div className="cart-center">
                                                <GrPrint size={30} />
                                                <p className="text-function">Xuất báo cáo</p>
                                            </div>
                                        </div>
                                        <p className="function">Báo cáo</p>
                                    </div>

                                    <div className="card">
                                        <div className="cart-top">
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalServices')}
                                            >
                                                <MdHomeRepairService size={30} />
                                                <p className="text-function"> Danh mục dịch vụ</p>
                                            </div>

                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalCategory')}
                                            >
                                                <SlClock size={30} />
                                                <p className="text-function"> Danh mục thời</p>
                                                <p className="text-function"> gian sửa chửa</p>
                                            </div>

                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalTechnical')}
                                            >
                                                <FaAddressCard size={30} />
                                                <p className="text-function">Danh sách kĩ </p>
                                                <p className="text-function">thuật viên</p>
                                            </div>
                                        </div>
                                        <p className="function">Khai báo</p>
                                    </div>
                                </div>
                            </TabPane>

                            <TabPane tab="Cấu Hình" key="settings">
                                <div className="card-grid">
                                    <div className="card">
                                        <div className="cart-top">
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalConfigSystem')}
                                            >
                                                <IoSettingsOutline size={30} />
                                                <p className="text-function">Cấu hình thông số hệ thống</p>
                                            </div>
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalLCD')}
                                            >
                                                <FaFlipboard size={30} />
                                                <p className="text-function">Cấu hình thông số thể hiện LCD</p>
                                            </div>
                                        </div>
                                        <p className="function">Thông tin</p>
                                    </div>

                                    {/* Other cards for "Cấu Hình" */}
                                </div>
                            </TabPane>

                            <TabPane tab="Import" key="import">
                                <div className="card-grid">
                                    <div className="card">
                                        <div className="cart-top">
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalImport')}
                                            >
                                                <IoDocuments size={30} />
                                                <p className="text-function">Import danh mục thời gian sửa chữa</p>
                                            </div>
                                        </div>
                                        <p className="function">Import</p>
                                    </div>
                                </div>
                            </TabPane>

                            <TabPane tab="Trợ Giúp" key="help">
                                <div className="card-grid">
                                    <div className="card">
                                        <div className="cart-top">
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="https://iky.vn/"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <div className="cart-center">
                                                    <FaEarthAmericas size={30} />
                                                    <p className="text-function">Trang chủ</p>
                                                </div>
                                            </a>
                                            <div
                                                className="cart-center"
                                                onClick={() => handleToggleModal('isShowModalInfomation')}
                                            >
                                                <HiQuestionMarkCircle size={30} />
                                                <p className="text-function">Phiên bản</p>
                                            </div>
                                        </div>
                                        <p className="function">Thông tin</p>
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>

                    <div className="home-content">
                        {/* <div className="card-grid">
                     {activeTab === 'home' && (
                         <>
                             <div className="card">
                                 <div className="cart-top">
                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalCreateLiftingTable')}
                                     >
                                         <GoPlusCircle className="icon-plus" size={30} />
                                         <p className="text-function"> Tạo bản nâng</p>
                                     </div>

                                     <div
                                         className="cart-center"
                                         onClick={() => {
                                             setShowConfirm(true);
                                         }}
                                     >
                                         <IoMdCloseCircle className="icon-close" size={30} />
                                         <p className="text-function"> Xóa bản nâng</p>
                                     </div>

                                     <div className="cart-center">
                                         <LuClipboardEdit
                                             size={30}
                                             onClick={() => handleToggleModal('isShowModalUpdateLiftingTable')}
                                         />
                                         <p className="text-function"> Sửa bản nâng</p>
                                     </div>

                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalSynchronousLeb')}
                                     >
                                         <IoReloadOutline className="icon-plus" size={30} />
                                         <p className="text-function"> Đồng bộ bảng leb</p>
                                     </div>
                                 </div>
                                 <p className="function">Bảng nâng</p>
                             </div>

                             <div className="card">
                                 <div className="cart-top">
                                     <div className="cart-center">
                                         <TiSpanner className="icon-plus" size={30} />
                                         <p className="text-function"> Tiếp nhận xe</p>
                                     </div>

                                     <div className="cart-center">
                                         <FaArrowAltCircleDown
                                             className="icon-green"
                                             size={30}
                                             onClick={() => {
                                                 if (selectedIndex !== null) {
                                                     // Kiểm tra chỉ số đã được chọn chưa
                                                     handleToggleModal('isShowModalDecreaseTime');
                                                 }
                                             }}
                                         />
                                         <p className="text-function">Giảm thời gian</p>
                                     </div>

                                     <div className="cart-center">
                                         <FaArrowAltCircleUp
                                             className="icon-green"
                                             size={30}
                                             onClick={() => handleToggleModal('isShowModalIncreaseTime')}
                                         />
                                         <p className="text-function">Tăng thời gian</p>
                                     </div>

                                     <div className="cart-center">
                                         <LuBookOpenCheck size={30} />
                                         <p className="text-function"> Trả xe</p>
                                     </div>
                                 </div>
                                 <p className="function">Thông tin sửa chữa</p>
                             </div>

                             <div className="card ">
                                 <div className="cart-top">
                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalCreateCustomer')}
                                     >
                                         <RiUserShared2Fill size={30} />
                                         <p className="text-function"> Tiếp nhận khách</p>
                                     </div>

                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalSynchronousCustomer')}
                                     >
                                         <IoReloadOutline className="icon-plus" size={30} />
                                         <span className="text-function">Đồng bộ thông </span>
                                         <span className="text-function">tin khách hàng</span>
                                     </div>

                                     <div className="cart-center">
                                         <HiSpeakerphone className="icon-plus" size={30} />
                                         <p className="text-function">Thông báo</p>
                                     </div>

                                     <div className="cart-center">
                                         <MdClose className="icon-close" size={30} />
                                         <p className="text-function"> Tắt thông báo</p>
                                     </div>
                                 </div>
                                 <p className="function">Thông tin khách hàng</p>
                             </div>

                             <div className="card">
                                 <div className="cart-top">
                                     <div className="cart-center">
                                         <GrPrint size={30} />
                                         <p className="text-function">Xuất báo cáo</p>
                                     </div>
                                 </div>
                                 <p className="function">Báo cáo</p>
                             </div>

                             <div className="card">
                                 <div className="cart-top">
                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalCategory')}
                                     >
                                         <SlClock size={30} />
                                         <p className="text-function"> Danh mục thời</p>
                                         <p className="text-function"> gian sửa chửa</p>
                                     </div>

                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalTechnical')}
                                     >
                                         <FaAddressCard size={30} />
                                         <p className="text-function">Danh sách kĩ </p>
                                         <p className="text-function">thuật viên</p>
                                     </div>
                                 </div>
                                 <p className="function">Khai báo</p>
                             </div>
                         </>
                     )}

                     {activeTab === 'settings' && (
                         <>
                             <div className="card">
                                 <div className="cart-top">
                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalConfigSystem')}
                                     >
                                         <IoSettingsOutline size={30} />
                                         <p className="text-function"> Cấu hình thông</p>
                                         <p className="text-function"> số hệ thống</p>
                                     </div>

                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalLCD')}
                                     >
                                         <FaFlipboard size={30} />
                                         <p className="text-function"> Cấu hình thông</p>
                                         <p className="text-function"> số thể hiện LCD</p>
                                     </div>
                                 </div>
                                 <p className="function">Thông tin</p>
                             </div>

                             <div className="card">
                                 <div className="cart-top">
                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalCreateDatabase')}
                                     >
                                         <TbDatabasePlus size={30} />
                                         <p className="text-function"> Tạo cấu trúc</p>
                                         <p className="text-function"> dữ liệu</p>
                                     </div>

                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalUpdateDatabase')}
                                     >
                                         <LuDatabase size={30} />
                                         <p className="text-function"> Cài đặt cơ</p>
                                         <p className="text-function"> sở dữ liệu</p>
                                     </div>
                                 </div>
                                 <p className="function">Database</p>
                             </div>
                         </>
                     )}

                     {activeTab === 'import' && (
                         <>
                             <div className="card">
                                 <div className="cart-top">
                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalImport')}
                                     >
                                         <IoDocuments size={30} />
                                         <p className="text-function"> Import danh mục</p>
                                         <p className="text-function"> thời gian sửa chửa</p>
                                     </div>
                                 </div>
                                 <p className="function">Import</p>
                             </div>
                         </>
                     )}

                     {activeTab === 'help' && (
                         <>
                             <div className="card">
                                 <div className="cart-top">
                                     <a target="_blank" href="https://iky.vn/" style={{ textDecoration: 'none' }}>
                                         <div className="cart-center">
                                             <FaEarthAmericas size={30} />
                                             <p className="text-function"> Trang chủ</p>
                                         </div>
                                     </a>

                                     <div
                                         className="cart-center"
                                         onClick={() => handleToggleModal('isShowModalInfomation')}
                                     >
                                         <HiQuestionMarkCircle size={30} />
                                         <p className="text-function">Phiên bản</p>
                                     </div>
                                 </div>
                                 <p className="function">Thông tin</p>
                             </div>
                         </>
                     )}
                 </div> */}

                        <div className="active-tables">
                            <div className="background-container">
                                <div className="content-wrapper">
                                    <div style={{ border: '1px solid #ddd', padding: '16px' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Bảng dữ liệu</p>
                                        <div style={{ border: '1px solid #ccc', padding: '16px' }}>
                                            <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                                                DANH SÁCH BÀN NÂNG
                                            </p>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    textAlign: 'left',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                Bàn nâng
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    textAlign: 'left',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                Kĩ Thuật Viên
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    textAlign: 'left',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                Nội dung thông báo
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    textAlign: 'left',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                TRẠNG THÁI
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    textAlign: 'left',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                Số thẻ
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    textAlign: 'left',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                Khách Hàng
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    textAlign: 'left',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                Biển số xe
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    textAlign: 'left',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                TG sửa chữa
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    textAlign: 'left',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                TG còn lại
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {listRepair
                                                            ?.filter((item) => item.customers)
                                                            .map((item) => (
                                                                <tr
                                                                    key={item._id}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        fontWeight:
                                                                            activeRow === item._id ? 'bold' : 'normal',
                                                                        backgroundColor:
                                                                            activeRow === item._id
                                                                                ? '#f0f0f0'
                                                                                : 'transparent',
                                                                    }}
                                                                    onClick={() => setActiveRow(item._id)}
                                                                >
                                                                    <td style={{ padding: '8px 16px' }}>{item.name}</td>
                                                                    <td style={{ padding: '8px 16px' }}>
                                                                        {item.technician}
                                                                    </td>
                                                                    <td style={{ padding: '8px 16px' }}>
                                                                        {/* Additional info if available */}
                                                                    </td>
                                                                    <td style={{ padding: '8px 16px' }}>Đang sửa</td>
                                                                    <td style={{ padding: '8px 16px' }}>
                                                                        {/* Card number if available */}
                                                                    </td>
                                                                    <td style={{ padding: '8px 16px' }}>
                                                                        {item.customers.name}
                                                                    </td>
                                                                    <td style={{ padding: '8px 16px' }}>
                                                                        {item.customers.license_plate}
                                                                    </td>
                                                                    <td style={{ padding: '8px 16px' }}>
                                                                        {new Date(
                                                                            item.customers.time_start,
                                                                        ).toLocaleDateString()}{' '}
                                                                        {new Date(
                                                                            item.customers.time_start,
                                                                        ).toLocaleTimeString([], {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        })}
                                                                    </td>
                                                                    <td style={{ padding: '8px 16px' }}>
                                                                        {new Date(
                                                                            item.customers.time_end,
                                                                        ).toLocaleDateString()}{' '}
                                                                        {new Date(
                                                                            item.customers.time_end,
                                                                        ).toLocaleTimeString([], {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        })}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row-tables">
                                        {/* api thực tế */}
                                        <div className="active-table">
                                            <h4 className="active-table-title">DANH SÁCH DỊCH VỤ</h4>
                                            <Accordion>
                                                {serviceWating.map((service, index) => (
                                                    <Card key={index} className="mb-2">
                                                        <Card.Header>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span className="service-name">
                                                                    {service.services_name}
                                                                </span>
                                                                <Button
                                                                    variant="link"
                                                                    onClick={() => toggleService(index)}
                                                                    aria-expanded={expandedService === index}
                                                                >
                                                                    {expandedService === index ? (
                                                                        <FaCaretUp />
                                                                    ) : (
                                                                        <FaCaretDown />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </Card.Header>
                                                        <Accordion.Collapse
                                                            eventKey={index.toString()}
                                                            in={expandedService === index}
                                                        >
                                                            <Card.Body>
                                                                {service.queues.length > 0 ? (
                                                                    <Table bordered hover responsive>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Số thẻ</th>
                                                                                {/* <th>Họ tên</th>
                                                                         <th>BIỂN SỐ XE</th> */}

                                                                                <th>THỜI GIAN</th>
                                                                                <th>Nhận</th>
                                                                                <th>Trả</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {service.queues.map((queue, queueIndex) => (
                                                                                <tr key={queueIndex}>
                                                                                    <td>{queue.serial_number}</td>
                                                                                    {/* <td>
                                                                                 {service.customer ||
                                                                                     service.name ||
                                                                                     'N/A'}
                                                                             </td>
                                                                             <td>{service.licensePlate || 'N/A'}</td> */}

                                                                                    <td>
                                                                                        {new Date(
                                                                                            queue.created_at,
                                                                                        ).toLocaleString()}
                                                                                    </td>
                                                                                    <td className="status-cell">
                                                                                        <span
                                                                                            className="status status-receive"
                                                                                            onClick={() =>
                                                                                                handleToggleModal(
                                                                                                    'isShowModalReceivingCustomer',
                                                                                                    queue._id,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            ✓
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="status-cell">
                                                                                        <span className="status status-cancel">
                                                                                            X
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </Table>
                                                                ) : (
                                                                    <p>Không có hàng đợi nào cho dịch vụ này</p>
                                                                )}
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                                ))}
                                            </Accordion>
                                        </div>
                                        <div className="active-table" style={{ overflowX: 'auto' }}>
                                            <p
                                                style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}
                                                className="active-table-title"
                                            >
                                                DANH SÁCH XE CHỜ LẤY
                                            </p>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <Text>Số thẻ</Text>
                                                        </th>
                                                        <th>
                                                            <Text>Họ tên</Text>
                                                        </th>
                                                        <th>
                                                            <Text>Biển Số Xe</Text>
                                                        </th>
                                                        <th>
                                                            <Text>Thời gian</Text>
                                                        </th>
                                                        <th>
                                                            <Text>KH đã nhận</Text>{' '}
                                                        </th>
                                                        <th>
                                                            <Text>Gọi</Text>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {finishList?.map((items, index) => (
                                                        <tr
                                                            key={index}
                                                            style={{
                                                                cursor: 'pointer',
                                                                fontWeight: activeRow === items._id ? 'bold' : 'normal',
                                                                backgroundColor:
                                                                    activeRow === items._id ? '#f0f0f0' : 'transparent',
                                                            }}
                                                            onClick={() => setActiveRow(items._id)}
                                                            // onClick={() => setSelectedReturnCarRow(index)}
                                                            // className={selectedReturnCarRow === index ? 'active-row' : ''}
                                                            // style={{
                                                            //     backgroundColor:
                                                            //         selectedCustomerRow === returnCar.indexOf(items)
                                                            //             ? '#f0f0f0'
                                                            //             : 'transparent',
                                                            //     cursor: 'pointer',
                                                            // }}
                                                        >
                                                            <td>
                                                                <Text>{items?.serial_number}</Text>
                                                            </td>
                                                            <td>
                                                                <Text>{items?.name}</Text>
                                                            </td>
                                                            <td>
                                                                <Text>{items?.license_plate}</Text>
                                                            </td>
                                                            <td>
                                                                <Text>
                                                                    {' '}
                                                                    {new Date(
                                                                        items.updated_at,
                                                                    ).toLocaleDateString()}{' '}
                                                                    {new Date(items.updated_at).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })}
                                                                </Text>
                                                            </td>

                                                            <td className="status-cell">
                                                                <span
                                                                    className="status status-receive"
                                                                    onClick={() => handleReceivedVehicle(items._id)}
                                                                >
                                                                    ✓
                                                                </span>
                                                            </td>

                                                            <td className="status-cell">
                                                                <span className="status status-call">📢</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                title="Xác nhận xóa"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                okText="Có"
                cancelText="Không"
            >
                <p>Bạn có chắc chắn muốn xóa khách hàng này không?</p>
            </Modal>

            <Modal
                title="Xác nhận xóa"
                open={showConfirm}
                onCancel={() => setShowConfirm(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowConfirm(false)}>
                        Hủy
                    </Button>,
                    <Button key="delete" type="danger">
                        Xóa
                    </Button>,
                ]}
            >
                <p>Bạn có chắc chắn muốn xóa bản nâng này?</p>
            </Modal>
        </>
        // <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        //     <Modal.Header closeButton>
        //         <Modal.Title>Xác nhận xóa</Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body>Bạn có chắc chắn muốn xóa bản nâng này?</Modal.Body>
        //     <Modal.Footer>
        //         <Button variant="secondary" onClick={() => setShowConfirm(false)}>
        //             Hủy
        //         </Button>
        //         <Button variant="danger" onClick={handleDelete}>
        //             Xóa
        //         </Button>
        //     </Modal.Footer>
        // </Modal>
    );
};

export default Dashboard;
