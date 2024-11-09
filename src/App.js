import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LebPanel from './components/LebPanel/LebPanel';
import Control from './components/Control/Control';
import NotFound from './components/Pages/notfound';
import Login from './components/Login/Login';
import Home from './components/Pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GetSerialNumber from './components/serial/GetSerialNumber';

function App() {
    return (
        <Router>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Navigate to="/control" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/Waiting-line" element={<LebPanel />} />
                <Route path="/control" element={<Control />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/serial-number" element={<GetSerialNumber />} />
            </Routes>
        </Router>
    );
}

export default App;
