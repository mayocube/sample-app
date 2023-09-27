import { AppBar, Container, IconButton, Toolbar, Typography } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
const NavBar = ({ navbarTitle }) => {
    return (
        <AppBar position="static" color='dark' >
            <Container maxWidth="l00%" >
                <Toolbar className='navBar' disableGutters>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}> <MenuIcon /> </IconButton>
                    <Typography variant="h6" className='navTitle' color="inherit" component="div">{navbarTitle ?? ""}</Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default NavBar