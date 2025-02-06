import React from 'react';

// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { HSeparator } from 'components/separator/Separator';

import { Heading } from '@chakra-ui/react';

export function SidebarBrand() {
    //   Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');

    return (
        <Flex align='center' direction='column'>
            <Heading color={textColor} fontSize='36px' mb='10px'>
        TMS
            </Heading>
            <HSeparator mb='20px' />
        </Flex>
    );
}

export default SidebarBrand;
