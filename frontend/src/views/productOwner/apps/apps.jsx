/* eslint-disable no-undef */
import { Box, Button, Card, Flex, Icon, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
// eslint-disable-next-line no-unused-vars
import { MdAddchart, MdDelete, MdGppGood, MdPublish, MdUpdate } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default React.memo(function Apps(){
    const url = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [islogout, setIslogout] = useState(
        localStorage.getItem('token') == null || localStorage.getItem('user') == null ? true : false
    );
    const [user, setUser] = useState(
        localStorage.getItem('user') == null ? {} : JSON.parse(localStorage.getItem('user'))
    );
    const [loading, setLoading] = useState(true);
    const [apps, setApps] = useState([]);
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
            
            axios.get(process.env.REACT_APP_SECRET_KEY+`/app/get-apps/${po_id}`, {
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
                        setApps(res.data);
                        setLoading(false);
                    }
                })
                .catch(err => console.log(err));
        }
    },[islogout, po_id, loading]);

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
                                    setLoading(true);
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

    function handelUpdate(appname, id){
        Swal.fire({
            background: '#0b1437',
            color: 'white',
            title: 'Update translation',
            html: '<input id=\'appname\' class=\'swal2-input\' value=\''+appname+'\' />',
            focusConfirm: false,
            confirmButtonText: 'Update',
            showCancelButton: true,
            preConfirm: () => {
                return {
                    appname: document.getElementById('appname').value
                };
            }
        })
            .then(async res => {
                if(res.isConfirmed){
                    if(res.value.appname == '' ){
                        await Swal.fire({
                            background: '#0b1437',
                            color: 'white',
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Please fill field',
                        })
                            .then(() => {
                                handelUpdate(appname, id);
                            });
                    }else{
                        await axios.patch(process.env.REACT_APP_SECRET_KEY+`/app/update-app/${po_id}/${id}`, res.value)
                            .then(res => {
                                setLoading(true);
                                Swal.fire({
                                    background: '#0b1437',
                                    color: 'white',
                                    position: 'center',
                                    icon: 'success',
                                    title: res.data,
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            });
                    }
                }
            });
    }

    function handelDelete(id){
        Swal.fire({
            background: '#0b1437',
            color: 'white',
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(process.env.REACT_APP_SECRET_KEY+`/app/delete-app/${po_id}/${id}`)
                    .then(async res => {
                        setLoading(true);
                        await Swal.fire({
                            background: '#0b1437',
                            color: 'white',
                            title: 'Deleted!',
                            text: res.data,
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
                    .catch(err => console.log(err));
            }
        });
    }

    function handelAdd(appname, app_id){
        Swal.fire({
            background: '#0b1437',
            color: 'white',
            title: 'Add translation',
            html: '<input id=\'appname\' class=\'swal2-input\' value=\''+appname+'\' disabled> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>Tags:</label><input id=\'tags\' class=\'swal2-input\' placeholder=\'tags...\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>Key:</label><input id=\'key\' class=\'swal2-input\' placeholder=\'key...\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>V.fr:</label><input id=\'vfr\' class=\'swal2-input\' placeholder=\'vfr...\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>V.en:</label><input id=\'ven\' class=\'swal2-input\' placeholder=\'ven...\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>V.ar:</label><input id=\'varb\' class=\'swal2-input\' placeholder=\'var...\'></div>',
            focusConfirm: false,
            confirmButtonText: 'Add',
            showCancelButton: true,
            preConfirm: () => {
                return {
                    tags: document.getElementById('tags').value.value.split(', '),
                    key: document.getElementById('key').value,
                    vfr: document.getElementById('vfr').value,
                    ven: document.getElementById('ven').value,
                    var: document.getElementById('varb').value
                };
            }
        })
            .then(async res => {
                if(res.isConfirmed){
                    if(res.value.tags == '' || res.value.key == '' || res.value.vfr == '' || res.value.ven == '' || res.value.var == ''){
                        await Swal.fire({
                            background: '#0b1437',
                            color: 'white',
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Please fill all fields',
                        })
                            .then(() => {
                                handelAdd(appname, app_id);
                            });
                    }else{
                        await axios.post(process.env.REACT_APP_SECRET_KEY+`/trans/create-translations/${app_id}`, res.value)
                            .then(async res => {
                                if(res.data == 'Already existing key !'){
                                    await Swal.fire({
                                        background: '#0b1437',
                                        color: 'white',
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: res.data,
                                    })
                                        .then(() => {
                                            handelAdd(appname, app_id);
                                        });
                                }else{
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
                            onClick={()=>handelCreateProject()}
                            variant='brand'
                            w='max-content'
                        >Add App</Button>
                    </Flex>
                    <Box>
                        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
                            <Thead>
                                <Tr>
                                    <Th textAlign="center">App Name</Th>
                                    <Th textAlign="center">Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    loading ? 
                                        <Tr>
                                            <Td colSpan={2} className="text-center">
                                                <Spinner className="mx-1" size="md" color="gray.500" /> 
                                                <Spinner className="mx-1" size="md" color="gray.500" /> 
                                                <Spinner className="mx-1" size="md" color="gray.500" /> 
                                            </Td>
                                        </Tr> :
                                        apps.length > 0 ? apps.map((item, index) => (
                                            <Tr key={index}>
                                                <Td textAlign="center">{item.appname}</Td>
                                                <Td textAlign="center">
                                                    <Link onClick={() => handelUpdate(item.appname, item._id)}>
                                                        <Icon
                                                            w="24px"
                                                            h="24px"
                                                            me="5px"
                                                            color='green.500'
                                                            as={MdUpdate}
                                                        />
                                                    </Link>
                                                    <Link onClick={() => handelDelete(item._id)}>
                                                        <Icon
                                                            w="24px"
                                                            h="24px"
                                                            me="5px"
                                                            color='red.500'
                                                            as={MdDelete}
                                                        />
                                                    </Link>
                                                    <Link onClick={() => handelAdd(item.appname, item._id)}>
                                                        <Icon
                                                            w="24px"
                                                            h="24px"
                                                            me="5px"
                                                            color='blue.500'
                                                            as={MdAddchart}
                                                        />
                                                    </Link>
                                                    {/* <Link onClick={() => handelValidAllData(item._id)}>
                                                        <Icon
                                                            w="24px"
                                                            h="24px"
                                                            me="5px"
                                                            color='blue.500'
                                                            as={MdGppGood}
                                                        />
                                                    </Link>
                                                    <Link onClick={() => handelPublishAllData(item._id)}>
                                                        <Icon
                                                            w="24px"
                                                            h="24px"
                                                            me="5px"
                                                            color='blue.500'
                                                            as={MdPublish}
                                                        />
                                                    </Link> */}
                                                </Td>
                                            </Tr>
                                        )) : (
                                            <Tr>
                                                <Td colSpan={3} className="text-center">No Application available</Td>
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

// export default Apps;