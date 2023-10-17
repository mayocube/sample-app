import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './../index.css'
import { useState } from 'react';
import { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

const CustomAccordian = ({ title = "", detail = "", onClick }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Box className='customAccordian' onClick={() => { onClick(!expanded); setExpanded(!expanded); }}>
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDownIcon />}
            <Typography>{title}</Typography>

        </Box>

    );
}

export default CustomAccordian