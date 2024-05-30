import { FormControl, Grid, TextareaAutosize, TextField, Typography } from '@mui/material'
import React from 'react'

const CustomInput = ({ title, onChange, value, name, type = 'text', width = 2, required = false }) => {
  return (
    <Grid item xs={width} marginTop={0}>
      <FormControl className='customInputs' sx={{ width: "100%" }}>
        <Typography className='customInputTitle' variant="textLabel" sx={{ textTransform: "uppercase", fontFamily: "Inter" }}>{title} {required && <span style={{ color: "#bd1721" }}>*</span>}</Typography>
        {
          type == "textarea" ?
            <TextareaAutosize className={"custom-textarea"} minRows={2} onChange={onChange} name={name} value={value} />
            :
            <TextField className={"custom-Input"} type={type} onChange={onChange} name={name} value={value} sx={{ width: "100%" }} />
        }
      </FormControl>
    </Grid>
  )
}

export default CustomInput