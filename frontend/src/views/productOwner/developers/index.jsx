/* eslint-disable no-undef */
import { Box, Button, Card, Flex, Icon, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { MdAcUnit } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default React.memo(function Devs(){
    const url = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [islogout, setIslogout] = useState(
        localStorage.getItem('token') == null || localStorage.getItem('user') == null ? true : false
    );
    const [user, setUser] = useState(
        localStorage.getItem('user') == null ? {} : JSON.parse(localStorage.getItem('user'))
    );
    const [loading, setLoading] = useState(true);
    const [devs, setDevs] = useState([]);

    useEffect(() => {
        if(islogout){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
      
            url('/auth/sign-in');
        }else{
            setUser(JSON.parse(localStorage.getItem('user')));

            axios.get(process.env.REACT_APP_SECRET_KEY+`/user/get-developers/${user._id}`, {
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
                        setDevs(res.data);
                        setLoading(false);
                    }
                })
                .catch(err => console.log(err));
        }
    }, [islogout, loading]);

    function handelAdd(){
        Swal.fire({
            background: '#0b1437',
            color: 'white',
            title: 'create new developer',
            html: '<div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>Full name:</label><input id=\'fullname\' class=\'swal2-input\' placeholder=\'fullname...\' ></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>Email:</label><input id=\'email\' class=\'swal2-input\' placeholder=\'email...\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>Password:</label><input id=\'password\' class=\'swal2-input\' placeholder=\'password...\'></div>',
            focusConfirm: false,
            confirmButtonText: 'Create',
            showCancelButton: true,
            preConfirm: () => {
                return {
                    fullname: document.getElementById('fullname').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                };
            }
        })
            .then(async res => {
                if(res.isConfirmed){
                    if(res.value.fullname == '' || res.value.email == '' || res.value.password == ''){
                        await Swal.fire({
                            background: '#0b1437',
                            color: 'white',
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Please fill all fields',
                        })
                            .then(() => {
                                handelAdd();
                            });
                    }else{
                        axios.post(process.env.REACT_APP_SECRET_KEY+`/user/create-developer/${user._id}`,  res.value)
                            .then(async res => {
                                if(res.data == 'Email already exists !'){
                                    await Swal.fire({
                                        background: '#0b1437',
                                        color: 'white',
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: res.data,
                                    })
                                        .then(() => {
                                            handelAdd();
                                        });
                                }else{
                                    setLoading(true);
                                    await Swal.fire({
                                        background: '#0b1437',
                                        color: 'white',
                                        position: 'center',
                                        icon: 'success',
                                        title: res.data,
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }
                            });
                    }
                }
            });
    }

    function handelActive(dev_id, status){
        if(status == 'active'){
            Swal.fire({
                background: '#0b1437',
                color: 'white',
                title: 'Developer Account is Active',
                text: 'you can desactivate account',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Desactivate',
                confirmButtonColor: 'red'
            })
                .then(res => {
                    if(res.isConfirmed){
                        axios.patch(process.env.REACT_APP_SECRET_KEY+`/user/change-status/${dev_id}`, {status: 'inactive'})
                            .then(async () => {
                                setLoading(true);
                                await Swal.fire({
                                    background: '#0b1437',
                                    color: 'white',
                                    title: 'Account desactivated!',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            })
                            .catch(err => console.log(err));
                    }
                });
        }else{
            Swal.fire({
                background: '#0b1437',
                color: 'white',
                title: 'Developer Account is active',
                text: 'you can activate account',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Activate',
                confirmButtonColor: 'green'
            })
                .then(res => {
                    if(res.isConfirmed){
                        axios.patch(process.env.REACT_APP_SECRET_KEY+`/user/change-status/${dev_id}`, {status: 'active'})
                            .then(async () => {
                                setLoading(true);
                                await Swal.fire({
                                    background: '#0b1437',
                                    color: 'white',
                                    title: 'account activated!',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            })
                            .catch(err => console.log(err));
                    }
                });
        }
    }

    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }} m='60px'>
            <SimpleGrid
                mb='20px'
                columns={{ sm: 1 }}
                spacing={{ base: '20px', xl: '20px' }}>
                <Card
                    background='#131f4e'
                    flexDirection="column"
                    w="100%"
                    px="0px"
                    py='20px'
                    overflowX={{ sm: 'scroll', lg: 'hidden' }}
                >
                    <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
                        <Text
                            color='white'
                            fontSize="22px"
                            mb="4px"
                            fontWeight="700"
                            lineHeight="100%"
                            display='flex'
                        >
                            {user.fullname} <Text fontSize='14px' mx='10px'>({user.role})</Text>
                        </Text>
                        <Button
                            onClick={()=>handelAdd()}
                            variant='brand'
                            w='max-content'
                        >Add Developer</Button>
                    </Flex>
                    <Box>
                        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
                            <Thead>
                                <Tr>
                                    <Th>Full name</Th>
                                    <Th>Email</Th>
                                    <Th>Role</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    loading ? 
                                        <Tr>
                                            <Td colSpan={5} className="text-center">
                                                <Spinner className="mx-1" size="md" color="gray.500" /> 
                                                <Spinner className="mx-1" size="md" color="gray.500" /> 
                                                <Spinner className="mx-1" size="md" color="gray.500" /> 
                                            </Td>
                                        </Tr> :
                                        devs.length > 0 ? devs.map((item, index) => (
                                            <Tr key={index}>
                                                <Td>{item.fullname}</Td>
                                                <Td>{item.email}</Td>
                                                <Td>{item.role}</Td>
                                                <Td>{item.status}</Td>
                                                <Td>
                                                    <Link>
                                                        <Icon
                                                            onClick={()=>handelActive(item._id, item.status)}
                                                            w="24px"
                                                            h="24px"
                                                            me="5px"
                                                            color='blue.500'
                                                            as={MdAcUnit}
                                                        />
                                                    </Link>
                                                </Td>
                                            </Tr>
                                        )) : (
                                            <Tr>
                                                <Td colSpan={5} className="text-center">No Developer available</Td>
                                            </Tr>
                                        )
                                }
                            </Tbody>
                        </Table>
                    </Box>
                </Card> 
            </SimpleGrid>
        </Box>
    );
});

// export default Devs;