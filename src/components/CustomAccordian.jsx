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
    const showLoader = () => {
        setTimeout(() => {
            setIsLoaded(!isLoaded)
        }, 1000);
    }
    useEffect(() => {
        showLoader()
    }, [])

    return (
        <div className='customAccordian'>
            <Accordion onClick={() => {
                showLoader()
            }} style={{ maxWidth: 250 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{title}</Typography>
                </AccordionSummary>
                {isLoaded ?

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress color="dark" size={25} sx={{ width: "5px", height: "5px" }} />
                    </Box>

                    : <AccordionDetails>
                        <Typography>
                            {detail}
                        </Typography>
                    </AccordionDetails>}
            </Accordion>
        </div>

    );
}

export default CustomAccordian