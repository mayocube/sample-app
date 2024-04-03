import React, { useState } from 'react'
import { AppBar, Container, IconButton, Toolbar, Typography, Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import DraftsIcon from '@mui/icons-material/Drafts';
import { useHistory } from 'react-router-dom';

const MenuSider = ({ openSideBar, setOpenSidebar }) => {
  const location = useHistory();
  const toggleDrawer = () => () => {
    setOpenSidebar(!openSideBar);
  };

  const handleListItemClick = (event, route) => {
    location.replace(`/login/${route}?code=sYmm2mzsJBrJ7LSxkwvlsL3V2UJlwaUf5l5Le9dNSXg&state=pnRCq7Dlw6HerG7EvgvW62VQqS4PWistWLncaqsgX4RFV0Z74GTi6wrDE1En4gU6`);
  }

  return (
    <Drawer
      hideBackdrop={true}
      anchor={'left'}
      open={openSideBar}
      onClose={toggleDrawer()}
    >
      <Box sx={{ position: 'sticky', bottom: 0, width: "300px" }}>
        <Box sx={{ backgroundColor: "white" }}>
          <List component="nav" aria-label="main mailbox folders">
            <ListItemButton onClick={(event) => handleListItemClick(event, 'callback')} >
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="Email Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={(event) => handleListItemClick(event, 'callback2')} >
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