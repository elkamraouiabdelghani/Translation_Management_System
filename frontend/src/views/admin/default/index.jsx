/* eslint-disable no-undef */
// Chakra imports
import {
    Button,
    Text
} from '@chakra-ui/react';
// Custom components
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default React.memo(function UserReports() {
    const textColor = useColorModeValue('navy.700', 'white');
    const url = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [islogout, setIslogout] = useState(
        localStorage.getItem('token') == null || localStorage.getItem('user') == null ? true : false
    );
    const [user, setUser] = useState(
        localStorage.getItem('user') == null ? {} : JSON.parse(localStorage.getItem('user'))
    );
    const [po_id, setPo_id] = useState('');

    useEffect(()=>{
        if(islogout){
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            url('/auth/sign-in');
        }else{
            setUser(JSON.parse(localStorage.getItem('user')));

            if(user.role == 'developer'){
                axios.get(process.env.REACT_APP_SECRET_KEY+`/user/get-po/${user._id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                    .then(res => {
                        if(res.data.message){
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');

                            url('/auth/sign-in');
                        }else{
                            setPo_id(res.data._id);
                        }
                    });
            }else{
                setPo_id(user._id);
            }
        }
    },[islogout]);

    function handelCreateProject(){
        Swal.fire({
            background: '#0b1437',
            color: 'white',
            titleText: 'App Name',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            confirmButtonText: 'Create',
            showCancelButton: true,
            showLoaderOnConfirm: true
        })
            .then((result) => {
                if (result.isConfirmed) {
                    if(result.value == ''){
                        Swal.fire({
                            background: '#0b1437',
                            color: 'white',
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Please fill in field'
                        })
                            .then(res => {
                                if(res.isConfirmed){
                                    handelCreateProject();
                                }
                            });
                    }else{
                        axios.post(process.env.REACT_APP_SECRET_KEY+`/app/create-app/${po_id}`, {'appname': result.value})
                            .then(res => {
                                if(!res.data.type){
                                    Swal.fire({
                                        background: '#0b1437',
                                        color: 'white',
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Your App has been created',
                                        text: 'Look at the apps table !',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }else{
                                    Swal.fire({
                                        background: '#0b1437',
                                        color: 'white',
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: res.data.message
                                    })
                                        .then(res => {
                                            if(res.isConfirmed){
                                                handelCreateProject();
                                            }
                                        });
                                }
                            });
                    }
                }
            });
    }

    return (
        <div className="container w-100 text-center position-absolute top-50 start-0 p-0 m-0">
            <Text className="fs-2 fw-bold" color={textColor}>welcome to the translation management system</Text>
            <Text fontSize='lg' color={textColor}>you can manage your project's translations here</Text>
            {
                user.role != 'admin' ? (
                    <Button variant='brand' onClick={() => handelCreateProject()}>Create project</Button>
                ):(
                    ''
                )
            }
        </div>
    );
});
