import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const Actions = ({ actionTime }) => {
    return (
        <Grid item xs={12} lg={12} marginTop={1} display={"flex"} alignItems={"center"} justifyContent={"space-between"} paddingBottom={0} marginBottom={0} paddingLeft={0} paddingRight={0}>
            <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={1}>
                <Button color='default' className='actionBtn' startIcon={<DeleteOutlinedIcon className='actionIcon' fontSize="large" />}>Delete</Button>
                <Button color='default' className='actionBtn' startIcon={<NotificationsNoneIcon className='actionIcon' fontSize="large" />}>Set Priority</Button>
                <Button color='default' className='actionBtn' startIcon={<PersonOutlineIcon className='actionIcon' fontSize="large" />}>Assign</Button>
            </Box>
            <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={2}>
                <Typography variant="filterText" marginBottom={0} gutterBottom>{actionTime ?? ""}</Typography>
                <Button color='default' className='actionBtn' startIcon={<CachedIcon className='actionIcon' fontSize="large" />}>Refresh</Button>
            </Box>
        </Grid>
    )
}

export default Actions