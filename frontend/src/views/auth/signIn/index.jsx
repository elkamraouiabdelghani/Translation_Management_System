import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// Chakra imports
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import DefaultAuth from 'layouts/auth/Default';
// Assets
import illustration from 'assets/img/auth/auth.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import axios from 'axios';
import Swal from 'sweetalert2';

export default React.memo(function SignIn() {
    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorSecondary = 'gray.400';
    const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
    const textColorBrand = useColorModeValue('brand.500', 'white');
    const brandStars = useColorModeValue('brand.500', 'brand.400');
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    // state
    const url = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // eslint-disable-next-line no-unused-vars
    const user = {
        email: email,
        password: password
    };

    //handelsubmit
    function handelsubmit(e){
        e.preventDefault();

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if(email == '' || password == ''){
            setError('Please fill in all fields');
        }else if(!regex.test(email)){
            setError('Invalid email address');
        }else if(password.length < 8){
            setError('Password must be Min. 8 characters');
        }else{
            const user = {
                email: email,
                password: password
            };

            // eslint-disable-next-line no-undef
            axios.post(process.env.REACT_APP_SECRET_KEY+'/auth/sign-in', user)
                .then(res => {
                    if(res.data.message == 'Connection successful'){
                        if(res.data.user.status == 'active'){
                            localStorage.setItem('token', res.data.token);
                            localStorage.setItem('user', JSON.stringify(res.data.user));
  
                            url('/admin');
                        }else{
                            Swal.fire({
                                background: '#0b1437',
                                color: 'white',
                                title: 'Your Account is desactivated !',
                                text: 'you can\'t sign in',
                                showDenyButton: false,
                                showCancelButton: false,
                                confirmButtonText: 'oki'
                            });
                        }
                    }else{
                        setError(res.data.message);
                    }
                })
                .catch(err => console.log(err));
        }
    }

    return (
        <DefaultAuth illustrationBackground={illustration} image={illustration}>
            <Flex
                maxW={{ base: '100%', md: 'max-content' }}
                w='100%'
                mx='auto'
                me='auto'
                h='100%'
                alignItems='start'
                justifyContent='center'
                mb={{ base: '30px', md: '60px' }}
                px={{ base: '25px', md: '0px' }}
                mt={{ base: '40px', md: '14vh' }}
                flexDirection='column'>
                <Box me='auto'>
                    <Heading color={textColor} fontSize='36px' mb='10px'>
            Sign In
                    </Heading>
                    <Text
                        mb='36px'
                        ms='4px'
                        color={textColorSecondary}
                        fontWeight='400'
                        fontSize='md'>
            Enter your email and password to sign in!
                    </Text>
                </Box>
                <Flex
                    zIndex='2'
                    direction='column'
                    w={{ base: '100%', md: '420px' }}
                    maxW='100%'
                    background='transparent'
                    borderRadius='15px'
                    mx={{ base: 'auto', lg: 'unset' }}
                    me='auto'
                    mb={{ base: '20px', md: 'auto' }}>
                    <FormControl>
                        <FormLabel
                            display='flex'
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color={textColor}
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
                        />
                        <FormLabel
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color={textColor}
                            display='flex'>
              Password<Text color={brandStars}>*</Text>
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
                                onChange={e => setPassword(e.target.value)}
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
                                    {error}
                                </Text>
                            </FormControl>
                        </Flex>
                        <Button
                            onClick={handelsubmit}
                            fontSize='sm'
                            variant='brand'
                            fontWeight='500'
                            w='100%'
                            h='50'
                            mb='24px'>
              Sign In
                        </Button>
                    </FormControl>
                    <Flex
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='start'
                        maxW='100%'
                        mt='0px'>
                        <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Not registered yet?
                            <NavLink to='/auth/sign-up'>
                                <Text
                                    color={textColorBrand}
                                    as='span'
                                    ms='5px'
                                    fontWeight='500'>
                  Create an Account
                                </Text>
                            </NavLink>
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </DefaultAuth>
    );
});

// export default SignIn;
