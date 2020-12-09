import React from 'react';
import Box from '@material-ui/core/Box';

const PageOne = () => {
    return ( 
        <Box>
            <Box component='h4' mb={3} fontSize={20}>
                Page One
            </Box>
            <Box component='p' fontSize={16}>
                You can start from here..
            </Box>
        </Box>
    );
};

export default PageOne;

