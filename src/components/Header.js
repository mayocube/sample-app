import React from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'

const Header = ({ headerTitle }) => {
    return (
        <Grid container spacing={1} sx={{ display: "flex", alignItems: "center", lineHeight: "28px", minHeight: "36px", marginTop: 0, paddingTop: "24px", paddingBottom: "24px" }}>
            <Grid item xs={12} display={"flex"} alignItems={"center"} justifyContent={"space-between"} paddingTop={0}>
                <Box sx={{ display: "flex", alignItems: "center", marginTop: 0, paddingTop: 0, paddingBottom: 0 }}><Typography className="Headertitle" variant="headingText" gutterBottom>{headerTitle ?? ""}</Typography></Box>
                <Box className="headerBtns" sx={{ display: "flex", alignItems: "center", marginTop: 0, paddingTop: 0, paddingBottom: 0, gap: 2 }}>
                    <Button className='headerBtn' variant="contained" color="error" sx={{ borderRadius: 30, paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1 }}>reset</Button>
                    <Button className='headerBtn' variant="contained" sx={{ borderRadius: 30, paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1 }}>filter</Button>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Header