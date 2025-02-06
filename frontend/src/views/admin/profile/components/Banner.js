// Chakra imports
import { Avatar, Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import React from 'react';

export default function Banner(props) {
    // eslint-disable-next-line react/prop-types
    const { banner, avatar, name, job} = props;
    // Chakra Color Mode
    const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
    const textColorSecondary = 'gray.400';
    const borderColor = useColorModeValue(
        'white !important',
        '#111C44 !important'
    );
    return (
        <Card mb={{ base: '0px', lg: '20px' }} align='center'>
            <Box
                bg={`url(${banner})`}
                bgSize='cover'
                borderRadius='16px'
                h='131px'
                w='100%'
            />
            <Avatar
                mx='auto'
                src={avatar}
                h='87px'
                w='87px'
                mt='-43px'
                border='4px solid'
                borderColor={borderColor}
            />
            <Text color={textColorPrimary} fontWeight='bold' fontSize='xl' mt='10px'>
                {name}
            </Text>
            <Text color={textColorSecondary} fontSize='sm'>
                {job}
            </Text>
            {
                localStorage.getItem('user') != null ? 
                    JSON.parse(localStorage.getItem('user')).role == 'product owner' ?
                        <>
                            <Flex direction='column' align='center'>
                                <Text color={textColorPrimary} fontSize='m' fontWeight='bold'>
                                    API Link : 
                                    <Text color={textColorSecondary} fontSize='sm'>
                                        http://localhost:5000/trans/get-trans/{JSON.parse(localStorage.getItem('user'))._id}/{'"Your App Name"'}/{'"Tag?OPTIONNEL"'}
                                    </Text>
                                </Text>
                            </Flex> 
                            <Flex direction='column' align='center'>
                                <Text display='flex' color={textColorPrimary} fontSize='m' fontWeight='bold'>
                                    Your secret key: 
                                    <Text pt='0.5' mx='2' color={textColorSecondary} fontSize='sm'>
                                        {JSON.parse(localStorage.getItem('user')).secretkey}
                                    </Text>
                                </Text>
                            </Flex>
                        </>
                        : '' : ''
            }
        </Card>
    );
}
