import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import moment from 'moment';

const Actions = ({ handleDeleteModalOpen = () => { }, setColumnToUpdate = () => { }, onRefresh = () => { }, disabled = false }) => {
  const [lastUpdatedText, setLastUpdatedText] = useState(moment(JSON.parse(localStorage.getItem('lastUpdated'))).fromNow());

  const updateLastUpdatedText = () => {
    setLastUpdatedText(moment(JSON.parse(localStorage.getItem('lastUpdated'))).fromNow());
  };

  useEffect(() => {
    updateLastUpdatedText();
    const intervalId = setInterval(updateLastUpdatedText, 30000);
    return () => clearInterval(intervalId);
  }, [JSON.parse(localStorage.getItem('lastUpdated'))]);
  return (
    <Grid item xs={12} lg={12} marginTop={1} display={"flex"} alignItems={"center"} justifyContent={"space-between"} paddingBottom={0} marginBottom={0} paddingLeft={0} paddingRight={0}>
      <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={1}>
        <Button
          color='default'
          disabled={disabled}
          className='actionBtn'
          onClick={() => {
            handleDeleteModalOpen()
          }}
          startIcon={<DeleteOutlinedIcon className='actionIcon' fontSize="large" />}
        >
          Delete
        </Button>
        <Button
          disabled={disabled}
          color='default'
          className='actionBtn'
          onClick={() => {
            setColumnToUpdate('priority');
          }}
          startIcon={<NotificationsNoneIcon className='actionIcon' fontSize="large" />}
        >
          Set Priority
        </Button>
        <Button
          disabled={disabled}
          color='default'
          className='actionBtn'
          onClick={() => {
            setColumnToUpdate('agent');
          }}
          startIcon={<PersonOutlineIcon className='actionIcon' fontSize="large" />}
        >
          Assign
        </Button>
      </Box>
      <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={2}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "14px", color: "#394762", lineHeight: "21px", fontWeight: "400" }} variant="filterText" marginBottom={0} gutterBottom>Last updated {lastUpdatedText}</Typography>
        <Button
          color='default'
          sx={{ color: "#606B85" }}
          className='actionBtn refresh'
          startIcon={<CachedIcon className='actionIcon' fontSize="large" />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </Box>
    </Grid>
  )
}

export default Actions