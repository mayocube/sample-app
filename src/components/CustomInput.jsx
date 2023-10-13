import { FormControl, Grid, TextField, Typography } from '@mui/material'
import React from 'react'

const CustomInput = ({ title }) => {
    return (
        <Grid item xs={2} marginTop={0}>
            <FormControl className='customInputs' sx={{ width: "100%" }}>
                <Typography className='customInputTitle' variant="textLabel" sx={{ textTransform: "uppercase", fontFamily: "calibri" }}>{title}</Typography>

                <TextField className={"custom-Input"} sx={{ width: "100%" }} />
            </FormControl>
        </Grid>
    )
}

export default CustomInput