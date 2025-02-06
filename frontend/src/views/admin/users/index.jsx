/* eslint-disable no-undef */
import { Box, Card, Flex, Icon, Input, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { MdAcUnit } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default React.memo(function Users(){
    const url = useNavigate();
    const [user, setUser] = useState(
        localStorage.getItem('user') == null ? {} : JSON.parse(localStorage.getItem('user'))
    );
    // eslint-disable-next-line no-unused-vars
    const [islogout, setIslogout] = useState(
        localStorage.getItem('token') == null || localStorage.getItem('user') == null ? true : false
    );
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if(islogout){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
      
            url('/auth/sign-in');
        }else{
            setUser(JSON.parse(localStorage.getItem('user')));

            axios.get(process.env.REACT_APP_SECRET_KEY+'/user/users', {
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
                            setUsers(res.data.filter(item => item.role!='admin' && (item.fullname == search || item.email == search || item.role == search || item.fullname.includes(search) || item.email.includes(search) || item.role.includes(search))));
                            setLoading(false);
                        }else{
                            setUsers(res.data.filter(item => item.role!='admin'));
                            setLoading(false);
                        }
                    }
                })
                .catch(err => console.log(err));
        }
    }, [islogout, search, loading]);

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

    return(
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
                        </Flex>
                        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
                            <Thead>
                                <Tr>
                                    <Th>full name</Th>
                                    <Th>email</Th>
                                    <Th>role</Th>
                                    <Th>account status</Th>
                                    <Th>Action</Th>
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
                                        users.length > 0 ? users.map((item, index) => (
                                            <Tr key={index}>
                                                <Td>{item.fullname}</Td>
                                                <Td>{item.email}</Td>
                                                <Td>{item.role}</Td>
                                                <Td>{item.status}</Td>
                                                <Td className="d-flex justify-content-between">
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
                                        )) : 
                                            <Tr>
                                                <Td colSpan={7} className="text-center">No user available</Td>
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

// export default Users;