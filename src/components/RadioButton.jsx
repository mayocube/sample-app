import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Grid, Typography } from '@mui/material';

const RadioButtonsGroup = ({ title = "", name, onChange, value = false, required = false, width = 2, }) => {
  return (
    <Grid item xs={width} marginTop={0} marginLeft={5}>
      <FormControl className='customRadios' sx={{ width: "100%" }}>
        {title && <Typography className='customSelectTitle' variant="textLabel" sx={{ textTransform: "uppercase", fontFamily: "Inter" }}>{title ?? ""} {required && <span style={{ color: "#bd1721" }}>*</span>}</Typography>}
        <RadioGroup row name={name} value={value} onChange={onChange}>
          <FormControlLabel control={<Radio />} value={true} label="True" style={{ color: "grey" }} />
          <FormControlLabel control={<Radio />} value={false} label="False" style={{ color: "grey" }} />
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}
export default RadioButtonsGroup