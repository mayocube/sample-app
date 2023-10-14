import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const Actions = ({ setOpenSidebar = () => { }, setForPriority = () => { }, setSideBarTitle = () => { }, setForAgent = () => { }, actionTime, onRefresh = () => { } }) => {
    return (
        <Grid item xs={12} lg={12} marginTop={1} display={"flex"} alignItems={"center"} justifyContent={"space-between"} paddingBottom={0} marginBottom={0} paddingLeft={0} paddingRight={0}>
            <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={1}>
                <Button color='default' className='actionBtn' startIcon={<DeleteOutlinedIcon className='actionIcon' fontSize="large" />}>Delete</Button>
                <Button color='default' className='actionBtn' onClick={() => {
                    setForAgent(false)
                    setForPriority(true)
                    setSideBarTitle("Select priority")
                    setOpenSidebar(true)
                }} startIcon={<NotificationsNoneIcon className='actionIcon' fontSize="large" />}>Set Priority</Button>
                <Button color='default' className='actionBtn' onClick={() => {
                    setForPriority(false)
                    setForAgent(true)
                    setSideBarTitle("Select agent to assign email/s to")
                    setOpenSidebar(true)
                }} startIcon={<PersonOutlineIcon className='actionIcon' fontSize="large" />}>Assign</Button>
            </Box>
            <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={2}>
                <Typography sx={{ fontFamily: "calibri", fontSize: "14px", color: "#394762", lineHeight: "21px", fontWeight: "400" }} variant="filterText" marginBottom={0} gutterBottom>{actionTime ?? ""}</Typography>
                <Button color='default' sx={{ color: "#606B85" }} className='actionBtn refresh' startIcon={<CachedIcon className='actionIcon' fontSize="large" />} onClick={onRefresh}>Refresh</Button>
            </Box>
        </Grid >
    )
}

export default Actions