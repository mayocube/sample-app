import React, { useState } from 'react'
import { AppBar, Container, IconButton, Toolbar, Typography, Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import DraftsIcon from '@mui/icons-material/Drafts';

const MenuSider = ({ openSideBar, setOpenSidebar }) => {

  const toggleDrawer = () => () => {
    setOpenSidebar(!openSideBar);
  };

  const handleListItemClick = (event, route) => {

  }

  return (
    <Drawer
      hideBackdrop={true}
      anchor={'left'}
      open={openSideBar}
      onClose={toggleDrawer()}
    >
      <Box
        sx={{ width: "300px" }}
        role="presentation"
      >
        <Box className="titleContainer">
          <span> Menu </span>
          <span>
            <CloseIcon onClick={() => { setOpenSidebar(false) }} />
          </span>
        </Box>

      </Box>
      <Box sx={{ position: 'sticky', bottom: 0 }}>
        <Box sx={{ backgroundColor: "white" }}>
          <List component="nav" aria-label="main mailbox folders">
            <ListItemButton onClick={(event) => handleListItemClick(event, 'Email')} >
                <ListItemIcon>
                  <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Email Dashboard" />
              </ListItemButton>
            <ListItemButton onClick={(event) => handleListItemClick(event, 'HOOPs')} >
              <ListItemIcon>
                <WatchLaterIcon />
              </ListItemIcon>
              <ListItemText primary="HOOPs" />
            </ListItemButton>
          </List>
        </Box>
      </Box>
    </Drawer>
  )
}

const TopBar = ({ navbarTitle }) => {
  const [openSideBar, setOpenSidebar] = useState(false);

  return (
    <>
      <AppBar position="static" color='dark' >
        <Container maxWidth="l00%" >
          <Toolbar className='navBar' disableGutters>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setOpenSidebar(!openSideBar)}> <MenuIcon /> </IconButton>
            <Typography variant="h6" className='navTitle' color="inherit" component="div">{navbarTitle ?? ""}</Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <MenuSider openSideBar={openSideBar} setOpenSidebar={setOpenSidebar} />
    </>
  )
}

export default TopBar