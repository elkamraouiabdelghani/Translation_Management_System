/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Box, Button, Flex, FormControl, FormLabel, Grid, Icon, Input, InputGroup, InputRightElement, Text, useColorModeValue } from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/profile/components/Banner';

// Assets
import banner from 'assets/img/auth/banner.png';
import React, { useEffect, useState } from 'react';
import {SimpleGrid} from '@chakra-ui/react';

import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default React.memo(function Overview() {
    const textColorSecondary = 'gray.400';
    const brandStars = useColorModeValue('brand.500', 'brand.400');
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    const [user, setUser] = useState(
        localStorage.getItem('user') == null ? {} : JSON.parse(localStorage.getItem('user'))
    );
    const [fullname, setFullname] = useState(
        localStorage.getItem('user') == null ? '' : JSON.parse(localStorage.getItem('user')).fullname
    );
    const [email, setEmail] = useState(
        localStorage.getItem('user') == null ? '' : JSON.parse(localStorage.getItem('user')).email
    );
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [errUI, setErrUI] = useState('');
    const [errPass, setErrPass] = useState('');
    const url = useNavigate();
    const [islogout, setIslogout] = useState(
        localStorage.getItem('token') == null || localStorage.getItem('user') == null ? true : false
    );

    const newUI = {
        'fullname': fullname,
        'email': email
    };

    const newPassdata = {
        'Old password': oldPass,
        'New password': newPass,
        'Confirm password': confirmPass
    };

    useEffect(() => {
        if(islogout){
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            url('/auth/sign-in');
        }else{
            setUser(JSON.parse(localStorage.getItem('user')));

            axios.get(process.env.REACT_APP_SECRET_KEY+`/user/user/${user._id}`, {
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
                        setFullname(res.data.fullname);
                        setEmail(res.data.email);
                    }
                })
                .catch(err => console.log(err));
        }
    }, [islogout]);

    function UpdateUI(e){
        e.preventDefault();

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(fullname == '' || email == ''){
            setErrUI('Please fill in all fields');
        }else if(!regex.test(email)){
            setErrUI('Invalid email address');
        }else{
            const newUI = {
                'fullname': fullname,
                'email': email
            };

            axios.patch(process.env.REACT_APP_SECRET_KEY+`/user/update-informations/${user._id}`, newUI)
                .then(async res =>{
                    await res.data == 'User informations updated successfully' ? window.location.reload() : setErrUI(res.data);
                })
                .catch(err => console.log(err));
        }
    }

    function UpdatePass(){

        if(oldPass == '' || newPass == '' || confirmPass == ''){
            setErrPass('Please fill in all fields');
        }else if(oldPass.length < 8 || newPass.length < 8 || confirmPass.length < 8){
            setErrPass('Password must be at least 8 characters');
        }else if(newPass != confirmPass){
            setErrPass('New Passwords do not match');
        }else{
            const newPassdata = {
                'oldpass': oldPass,
                'newpass': newPass
            };

            axios.patch(process.env.REACT_APP_SECRET_KEY+`/user/update-password/${user._id}`, newPassdata)
                .then(async res =>{
                    await res.data == 'Invalid old password' ? setErrPass(res.data) : window.location.reload();
                })
                .catch(err => console.log(err));
        }
    }

    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }} marginTop='40px'>
            {/* Main Fields */}
            <Grid
                templateColumns={{
                    base: '1fr',
                    lg: '1.34fr 1fr 1.62fr',
                }}
                templateRows={{
                    base: 'repeat(2, 1fr)',
                    lg: '1fr',
                }}
                gap={{ base: '20px', xl: '20px' }}
                display='flex'
                mb='50px'
            >
                <Banner
                    gridArea='1 / 1 / 2 / 2'
                    banner={banner}
                    // avatar={avatar}
                    name={fullname}
                    job={user.role}
                />
            </Grid>

            <SimpleGrid
                mb='20px' mx='auto'
                columns={{ sm: 1, md: 2 }}
                spacing={{ base: '20px', xl: '20px' }}>
                {/* update user information */}
                <Flex
                    direction='column'
                    w={{ base: '100%', md: '420px' }}
                    maxW='100%'
                    background="#111c44"
                    borderRadius='15px'
                    mx='auto'
                    me='auto'
                    mb={{ base: '20px', md: 'auto' }}
                    p='50px'
                >
                    <Text className="fs-3 text-center text-white">Update User Informations</Text>
                    <FormControl>
                        <FormLabel
                            display='flex'
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color='white'
                            mb='8px'>
                Full Name<Text color={brandStars}>*</Text>
                        </FormLabel>
                        <Input
                            isRequired={true}
                            variant='auth'
                            fontSize='sm'
                            ms={{ base: '0px', md: '0px' }}
                            type='email'
                            placeholder='full name'
                            mb='24px'
                            fontWeight='500'
                            size='lg'
                            onChange={e => setFullname(e.target.value)}
                            value={fullname}
                            color='white'
                        />
                        <FormLabel
                            display='flex'
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color='white'
                            mb='8px'>
                Email<Text color={brandStars}>*</Text>
                        </FormLabel>
                        <Input
                            isRequired={true}
                            variant='auth'
                            fontSize='sm'
                            ms={{ base: '0px', md: '0px' }}
                            type='email'
                            placeholder='mail@simmmple.com'
                            mb='24px'
                            fontWeight='500'
                            size='lg'
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            color='white'
                        />
                        <Flex justifyContent='space-between' align='center' mb='24px'>
                            <FormControl display='flex' alignItems='center'>
                                <Text ms='0px' fontSize='sm' color='darkorange' mx='auto'>
                                    {errUI}
                                </Text>
                            </FormControl>
                        </Flex>
                        <Button
                            fontSize='sm'
                            variant='brand'
                            fontWeight='500'
                            w='100%'
                            h='50'
                            mb='24px'
                            onClick={UpdateUI}
                        >
                Update
                        </Button>
                    </FormControl>
                </Flex>

                {/* update password */}
                <Flex
                    direction='column'
                    w={{ base: '100%', md: '420px' }}
                    maxW='100%'
                    background="#111c44"
                    borderRadius='15px'
                    mx='auto'
                    me='auto'
                    mb={{ base: '20px', md: 'auto' }}
                    p='50px'
                >
                    <Text className="fs-3 text-center text-white">Update Password</Text>
                    <FormControl>
                        <FormLabel
                            p='0px'
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color='white'
                            display='flex'>
                Old Password<Text color={brandStars}>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                isRequired={true}
                                fontSize='sm'
                                placeholder='Min. 8 characters'
                                mb='24px'
                                size='lg'
                                type={show ? 'text' : 'password'}
                                variant='auth'
                                onChange={e => setOldPass(e.target.value)}
                                color='white'
                            />
                            <InputRightElement display='flex' alignItems='center' mt='4px'>
                                <Icon
                                    color={textColorSecondary}
                                    _hover={{ cursor: 'pointer' }}
                                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                                    onClick={handleClick}
                                />
                            </InputRightElement>
                        </InputGroup>
                        <FormLabel
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color='white'
                            display='flex'>
                New Password<Text color={brandStars}>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                isRequired={true}
                                fontSize='sm'
                                placeholder='Min. 8 characters'
                                mb='24px'
                                size='lg'
                                type={show ? 'text' : 'password'}
                                variant='auth'
                                onChange={e => setNewPass(e.target.value)}
                                color='white'
                            />
                            <InputRightElement display='flex' alignItems='center' mt='4px'>
                                <Icon
                                    color={textColorSecondary}
                                    _hover={{ cursor: 'pointer' }}
                                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                                    onClick={handleClick}
                                />
                            </InputRightElement>
                        </InputGroup>
                        <FormLabel
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color='white'
                            display='flex'>
                Confirm New Password<Text color={brandStars}>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                isRequired={true}
                                fontSize='sm'
                                placeholder='Min. 8 characters'
                                mb='24px'
                                size='lg'
                                type={show ? 'text' : 'password'}
                                variant='auth'
                                onChange={e => setConfirmPass(e.target.value)}
                                color='white'
                            />
                            <InputRightElement display='flex' alignItems='center' mt='4px'>
                                <Icon
                                    color={textColorSecondary}
                                    _hover={{ cursor: 'pointer' }}
                                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                                    onClick={handleClick}
                                />
                            </InputRightElement>
                        </InputGroup>
                        <Flex justifyContent='space-between' align='center' mb='24px'>
                            <FormControl display='flex' alignItems='center'>
                                <Text ms='0px' fontSize='sm' color='darkorange' mx='auto'>
                                    {errPass}
                                </Text>
                            </FormControl>
                        </Flex>
                        <Button
                            fontSize='sm'
                            variant='brand'
                            fontWeight='500'
                            w='100%'
                            h='50'
                            mb='24px'
                            onClick={UpdatePass}
                        >
                Update
                        </Button>
                    </FormControl>
                </Flex>
            </SimpleGrid>
        </Box>
    );
});
