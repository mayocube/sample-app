import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './../index.css'
import { useState } from 'react';
import { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

const CustomAccordian = ({ title = "", detail = "" }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true)
        }, 3000);
    }, [])

    return (
        <div className='customAccordian'>
            <Accordion style={{ maxWidth: 250 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{title}</Typography>
                </AccordionSummary>
                {isLoaded ?
                    <AccordionDetails>
                        <Typography>
                            {detail}
                        </Typography>
                    </AccordionDetails>

                    : <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress size={25} sx={{ width: "5px", height: "5px" }} />
                    </Box>}
            </Accordion>
        </div>

    );
}

export default CustomAccordian