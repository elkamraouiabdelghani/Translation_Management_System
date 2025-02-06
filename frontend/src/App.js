/* eslint-disable react/react-in-jsx-scope */
import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import {ChakraProvider} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import React, { useState, Suspense } from 'react';
import Documentation from 'views/documentation';
import { Spinner } from 'react-bootstrap';

export default function Main() {
    // eslint-disable-next-line
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

    return (
        <ChakraProvider theme={currentTheme}>
            <Suspense fallback={
                <div className="loading">
                    <Spinner className="mx-1" size="md" color="gray.500" /> 
                    <Spinner className="mx-1" size="md" color="gray.500" /> 
                    <Spinner className="mx-1" size="md" color="gray.500" /> 
                </div>
            }>
                <Routes>
                    <Route path="auth/*" element={<AuthLayout />} />
                    <Route
                        path="admin/*"
                        element={
                            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
                        }
                    />
                    <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
                    <Route path='/TMS/Documentation' element={<Documentation />} />
                </Routes>
            </Suspense>
        </ChakraProvider>
    );
}
