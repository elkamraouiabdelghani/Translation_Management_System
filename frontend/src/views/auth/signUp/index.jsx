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
import { FaChevronLeft } from 'react-icons/fa';

// Assets
import illustration from 'assets/img/auth/auth.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import axios from 'axios';


export default React.memo(function SignUp() {
    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorSecondary = 'gray.400';
    const brandStars = useColorModeValue('brand.500', 'brand.400');
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

  
    // 
    const url = useNavigate();
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    // eslint-disable-next-line no-unused-vars
    const newuser = {
        fullname: fullname,
        email: email,
        password: password,
        role: 'product owner'
    };

    function handelsubmit(e){
        e.preventDefault();
    
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(fullname == '' || email == '' || password == '' || confirmPassword == '' ){
            setError('Please fill all the fields');
        }else if(!regex.test(email)){
            setError('Invalid email address');
        }else if(password != confirmPassword || password.length < 8 || confirmPassword.length < 8){
            setError('Passwords do not match (Min. 8 characters)');
        }else{
            const newuser = {
                fullname: fullname,
                email: email,
                password: password,
                role: 'product owner'
            };

            // eslint-disable-next-line no-undef
            axios.post(process.env.REACT_APP_SECRET_KEY+'/auth/sign-up',  newuser)
                .then((response) => {
                    if(response.data == 'Email already exists !'){
                        setError('Email already exists !');
                    }else{
                        url('/auth/sign-in');
                    }
                })
                .catch(err => console.log(err));
        }
    }
  
    return (
        <DefaultAuth illustrationBackground={illustration} image={illustration}>
            {/*  */}
            <NavLink
                to='/auth/sign-in'
                style={() => ({
                    width: 'fit-content',
                    marginTop: '40px',
                })}>
                <Flex
                    align='center'
                    ps={{ base: '25px', lg: '0px' }}
                    pt={{ lg: '0px', xl: '0px' }}
                    w='fit-content'>
                    <Icon
                        as={FaChevronLeft}
                        me='12px'
                        h='13px'
                        w='8px'
                        color='secondaryGray.600'
                    />
                    <Text ms='0px' fontSize='sm' color='secondaryGray.600'>
              Back to Sign In
                    </Text>
                </Flex>
            </NavLink>
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
                    <Heading color={textColor} fontSize='36px' mb='50px'>
          Create an Account
                    </Heading>
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
                        />
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
                        <FormLabel
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color={textColor}
                            display='flex'>
              Confirm Password<Text color={brandStars}>*</Text>
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
                                onChange={e => setConfirmPassword(e.target.value)}
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
                            fontSize='sm'
                            variant='brand'
                            fontWeight='500'
                            w='100%'
                            h='50'
                            mb='24px'
                            onClick={handelsubmit}
                        >
              Create an Account
                        </Button>
                    </FormControl>
                </Flex>
            </Flex>
        </DefaultAuth>
    );
});

// export default SignUp;