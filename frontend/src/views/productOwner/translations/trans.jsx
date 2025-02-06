/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Box, Button, Card, Flex, Icon, Input, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdDelete, MdGppGood, MdPublish, MdUpdate } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { TagsInput } from 'react-tag-input-component';
import { Spinner } from 'react-bootstrap';

export default React.memo(function Trans(){    
    const url = useNavigate();
    const [islogout, setIslogout] = useState(
        localStorage.getItem('token') == null || localStorage.getItem('user') == null ? true : false
    );
    const [user, setUser] = useState(
        localStorage.getItem('user') == null ? {} : JSON.parse(localStorage.getItem('user'))
    ); 
    const [loading, setLoading] = useState(true);
    const [trans, setTrans] = useState([]);
    const [apps, setApps] = useState([]);
    const [search, setSearch] = useState('');
    const [po_id, setPo_id] = useState('');

    useEffect(()=>{
        if(islogout){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
      
            url('/auth/sign-in');
        }else{
            setUser(JSON.parse(localStorage.getItem('user')));

            if(user.role == 'admin'){
                axios.get(process.env.REACT_APP_SECRET_KEY+'/trans/get-trans', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                    .then(res => {
                        if(res.data.message == 'Le token obligatoire pour l\'authentification'){
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            url('/auth/sign-in');
                        }else{
                            if(search){
                                setTrans(res.data.filter(item => item.key == search || item.vfr == search || item.ven == search || item.var == search || item.key.includes(search) || item.vfr.includes(search) || item.ven.includes(search) || item.var.includes(search)));
                                setLoading(false);
                            }else{
                                setTrans(res.data);
                                setLoading(false);
                            }
                        }
                    })
                    .catch(err => console.log(err));

            }else{
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

                axios.get(process.env.REACT_APP_SECRET_KEY+`/trans/get-trans/${po_id}`, {
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
                            if(search){
                                setTrans(res.data.filter(item => item.key == search || item.vfr == search || item.ven == search || item.var == search || item.key.includes(search) || item.vfr.includes(search) || item.ven.includes(search) || item.var.includes(search)));
                                setLoading(false);
                            }else{
                                setTrans(res.data);
                                setLoading(false);
                            }
                        }
                    })
                    .catch(err => console.log(err));

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
                        }
                    })
                    .catch(err => console.log(err));
            }
        }
    },[islogout, search, po_id, loading]);

    function handelDelete(app_id, id, pubStatus){
        if(pubStatus != 'published'){
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
                    axios.delete(process.env.REACT_APP_SECRET_KEY+`/trans/delete-translation/${app_id}/${id}`)
                        .then(res => {
                            if(res.data == 'Data has been deleted !'){
                                setLoading(true);
                                Swal.fire({
                                    background: '#0b1437',
                                    color: 'white',
                                    title: 'Deleted!',
                                    text: 'Your data has been deleted.',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            }
                        })
                        .catch(err => console.log(err));
                }
            });
        }else{
            Swal.fire({
                background: '#0b1437',
                color: 'white',
                title: 'Data is already published ! you can\'t delete data',
                icon: 'warning'
            });
        }
    }

    async function handelUpdate(app_id, id){
        await axios.get(process.env.REACT_APP_SECRET_KEY+`/trans/get-translation/${app_id}/${id}`)
            .then(async res => {
                await Swal.fire({
                    background: '#0b1437',
                    color: 'white',
                    title: 'Update translation',
                    html: '<div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>Tags:</label><input id=\'tags\' class=\'swal2-input\' value=\''+res.data.tags.join(', ')+'\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>Key:</label><input id=\'key\' class=\'swal2-input\' value=\''+res.data.key+'\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>V.fr:</label><input id=\'vfr\' class=\'swal2-input\' value=\''+res.data.vfr+'\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>Ven:</label><input id=\'ven\' class=\'swal2-input\' value=\''+res.data.ven+'\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>V.ar:</label><input id=\'varb\' class=\'swal2-input\' value=\''+res.data.var+'\'></div>',
                    focusConfirm: false,
                    confirmButtonText: 'Update',
                    showCancelButton: true,
                    preConfirm: () => {
                        return {
                            tags: document.getElementById('tags').value.split(', '),
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
                                        handelUpdate(app_id, id);
                                    });
                            }else{
                                await axios.patch(process.env.REACT_APP_SECRET_KEY+`/trans/update-translation/${app_id}/${id}`, res.value)
                                    .then(res => {
                                        setLoading(true);
                                        Swal.fire({
                                            background: '#0b1437',
                                            color: 'white',
                                            icon: 'success',
                                            title: res.data,
                                            showConfirmButton: false,
                                            timer: 1500
                                        });
                                    });
                            }
                        }
                    });
            });
    }

    function handelAdd(){
        Swal.fire({
            background: '#0b1437',
            color: 'white',
            title: 'Add translation',
            html: '<select class=\'form-control d-block mx-auto\' id=\'app\'><option value=\'\' selected>Select Application</option>'+apps.map(app => ('<option value='+app._id+'>'+app.appname+'</option>'))+'</select> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>Tags:</label><input id=\'tags\' class=\'swal2-input\' placeholder=\'tags...\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>Key:</label><input id=\'key\' class=\'swal2-input\' placeholder=\'key...\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>V.fr:</label><input id=\'vfr\' class=\'swal2-input\' placeholder=\'vfr...\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>V.en:</label><input id=\'ven\' class=\'swal2-input\' placeholder=\'ven...\'></div> <div class=\'d-flex justify-content-center align-items-center\'><label class=\'fs-4 fw-bold pt-3\'>V.ar:</label><input id=\'varb\' class=\'swal2-input\' placeholder=\'var...\'></div>',
            focusConfirm: false,
            confirmButtonText: 'Add',
            showCancelButton: true,
            preConfirm: () => {
                return {
                    app: document.getElementById('app').value,
                    tags: document.getElementById('tags').value.split(', '),
                    key: document.getElementById('key').value,
                    vfr: document.getElementById('vfr').value,
                    ven: document.getElementById('ven').value,
                    var: document.getElementById('varb').value
                };
            }
        })
            .then(async res => {
                if(res.isConfirmed){
                    if(res.value.app == '' || res.value.tags == '' || res.value.key == '' || res.value.vfr == '' || res.value.ven == '' || res.value.var == ''){
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
                        await axios.post(process.env.REACT_APP_SECRET_KEY+`/trans/create-translations/${res.value.app}`, res.value)
                            .then(async res => {
                                if(res.data == 'Already existing key !'){
                                    await Swal.fire({
                                        background: '#0b1437',
                                        color: 'white',
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: res.data
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

    function handelPublish(app_id, id, publish){
        if(publish == 'not published'){
            Swal.fire({
                background: '#0b1437',
                color: 'white',
                title: 'Data is unpublish',
                text: 'you can publish the data',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'publish',
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.patch(process.env.REACT_APP_SECRET_KEY+`/trans/publish-data/${app_id}/${id}`, {publish: 'published'})
                        .then(res => {
                            if(res.data == 'Invalid Data! Please valid data for publishing'){
                                Swal.fire({
                                    background: '#0b1437',
                                    color: 'white',
                                    title: res.data,
                                    icon: 'warning'
                                });
                            }else{
                                setLoading(true);
                                Swal.fire({
                                    background: '#0b1437',
                                    color: 'white',
                                    title: res.data,
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            }
                        });
                }
            });
        }else{
            Swal.fire({
                background: '#0b1437',
                color: 'white',
                title: 'Data has been published',
                text: 'You can unpublish the data',
                showDenyButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                denyButtonText: 'unpublish'
            })
                .then(result => {
                    if (result.isDenied) {
                        axios.patch(process.env.REACT_APP_SECRET_KEY+`/trans/publish-data/${app_id}/${id}`, {publish: 'not published'})
                            .then(() => {
                                setLoading(true);
                                Swal.fire({
                                    background: '#0b1437',
                                    color: 'white',
                                    title: 'data is unpublished',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            });
                    }
                });
        }
    }

    function handelValid(app_id, id, status){
        if(status == 'valid'){
            Swal.fire({
                background: '#0b1437',
                color: 'white',
                title: 'Data in valid status',
                text: 'you can change the status',
                showDenyButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                denyButtonText: 'Invalid'
            })
                .then(result => {
                    if (result.isDenied) {
                        axios.patch(process.env.REACT_APP_SECRET_KEY+`/trans/valid-data/${app_id}/${id}`, {status: 'invalid'})
                            .then(res => {
                                if(res.data == 'data has been valided'){
                                    setLoading(true);
                                    Swal.fire({
                                        background: '#0b1437',
                                        color: 'white',
                                        title: res.data,
                                        icon: 'success',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }else{
                                    Swal.fire({
                                        background: '#0b1437',
                                        color: 'white',
                                        title: res.data,
                                        icon: 'warning'
                                    });
                                }
                            });
                    }
                });
        }else if(status == 'invalid'){
            Swal.fire({
                background: '#0b1437',
                color: 'white',
                title: 'Data in invalid status',
                text: 'you can change the status',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Valid',
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.patch(process.env.REACT_APP_SECRET_KEY+`/trans/valid-data/${app_id}/${id}`, {status: 'valid'})
                        .then(res => {
                            setLoading(true);
                            Swal.fire({
                                background: '#0b1437',
                                color: 'white',
                                title: res.data,
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        });
                }
            });
        }else{
            Swal.fire({
                background: '#0b1437',
                color: 'white',
                title: 'Do you want to chage the status?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Valid',
                denyButtonText: 'Invalid'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.patch(process.env.REACT_APP_SECRET_KEY+`/trans/valid-data/${app_id}/${id}`, {status: 'valid'})
                        .then(res => {
                            setLoading(true);
                            Swal.fire({
                                background: '#0b1437',
                                color: 'white',
                                title: res.data,
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        });
                }else if (result.isDenied) {
                    axios.patch(process.env.REACT_APP_SECRET_KEY+`/trans/valid-data/${app_id}/${id}`, {status: 'invalid'})
                        .then(() => {
                            setLoading(true);
                            Swal.fire({
                                background: '#0b1437',
                                color: 'white',
                                title: 'data in status invalid',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        });
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
                            {user.fullname} <Text fontSize='14px' mx='10px' color="gray.500">({user.role})</Text>
                        </Text>
                    </Flex>

                    <Box>
                        <Flex justifyContent='space-between' px='20px'>
                            <Input
                                isRequired={true}
                                fontSize='sm'
                                ms={{ base: '0px', md: '0px' }}
                                type='search'
                                placeholder='Entry Key ...'
                                fontWeight='500'
                                size='lg'
                                w='max-content'
                                onChange={e => setSearch(e.target.value)}
                            />
                            {
                                user.role != 'admin'?
                                    <Button
                                        onClick={()=>handelAdd()}
                                        variant='brand'
                                        w='max-content'
                                    >Add Translations</Button>
                                    :''
                            }
                        </Flex>
                        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
                            <Thead>
                                <Tr>
                                    <Th>Key</Th>
                                    <Th>V.fr</Th>
                                    <Th>V.en</Th>
                                    <Th>V.ar</Th>
                                    <Th>Status</Th>
                                    <Th>Publish</Th>
                                    <Th className="text-center">Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    loading ? 
                                        <Tr>
                                            <Td colSpan={7} className="text-center">
                                                <Spinner className="mx-1" size="md" color="gray.500" /> 
                                                <Spinner className="mx-1" size="md" color="gray.500" /> 
                                                <Spinner className="mx-1" size="md" color="gray.500" /> 
                                            </Td>
                                        </Tr> :
                                        trans.length > 0 ? trans.map((item, index) => (
                                            <Tr key={index}>
                                                <Td className='text-truncate' style={{'maxWidth':'150px'}}>{item.key}</Td>
                                                <Td className='text-truncate' style={{'maxWidth':'150px'}}>{item.vfr}</Td>
                                                <Td className='text-truncate' style={{'maxWidth':'150px'}}>{item.ven}</Td>
                                                <Td className='text-truncate' style={{'maxWidth':'150px'}}>{item.var}</Td>
                                                <Td>{item.status}</Td>
                                                <Td className='text-truncate' style={{'maxWidth':'150px'}}>{item.publish}</Td>
                                                <Td className="d-flex justify-content-between">
                                                    <Link onClick={() => handelUpdate(item.app_id, item._id)}>
                                                        <Icon
                                                            w="24px"
                                                            h="24px"
                                                            me="5px"
                                                            color='green.500'
                                                            as={MdUpdate}
                                                        />
                                                    </Link>
                                                    <Link onClick={() => handelDelete(item.app_id, item._id, item.publish)}>
                                                        <Icon
                                                            w="24px"
                                                            h="24px"
                                                            me="5px"
                                                            color='red.500'
                                                            as={MdDelete}
                                                        />
                                                    </Link>
                                                    <Link onClick={() => handelValid(item.app_id, item._id, item.status)}>
                                                        <Icon
                                                            w="24px"
                                                            h="24px"
                                                            me="5px"
                                                            color='blue.500'
                                                            as={MdGppGood}
                                                        />
                                                    </Link>
                                                    <Link onClick={() => handelPublish(item.app_id, item._id, item.publish)}>
                                                        <Icon
                                                            w="24px"
                                                            h="24px"
                                                            me="5px"
                                                            color='blue.500'
                                                            as={MdPublish}
                                                        />
                                                    </Link>
                                                </Td>
                                            </Tr>
                                        )) : 
                                            <Tr>
                                                <Td colSpan={7} className="text-center">No data available</Td>
                                            </Tr>
                                }
                            </Tbody>
                        </Table>
                    </Box>
                </Card> 
            </SimpleGrid>
        </Box>
    );
});

// export default Trans;