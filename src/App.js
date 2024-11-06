import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CarList from './components/ui-users/CarList';
import Dashboard from './components/ui-staff/CarListStaff';
import NotFound from './components/Pages/notfound';
import Login from './components/Login/Login';
import CreateStore from './components/Admin/Store/ManageStore';
import ManageTechnical from './components/Technical/manageTechnical';
import Home from './components/Pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPasswordForm from './components/Login/forgotPassword';
import GetSerialNumber from './components/serial/GetSerialNumber';

function App() {
    return (
        <Router>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Navigate to="/control" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/Waiting-line" element={<CarList />} />
                <Route path="/control" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/manage-store" element={<CreateStore />} />
                <Route path="/serial-number" element={<GetSerialNumber />} />
                <Route path="/manage-technical" element={<ManageTechnical />} />
                <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
            </Routes>
        </Router>
    );
}

export default App;
