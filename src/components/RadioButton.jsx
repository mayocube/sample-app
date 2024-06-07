import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Grid, Typography } from '@mui/material';

const RadioButtonsGroup = ({ title = "", name, onChange, value = false, required = false, width = 2, options = [] }) => {
  return (
    <Grid item xs={width} marginTop={0} marginLeft={0}>
      <FormControl className='customRadios' sx={{ width: "100%" }}>
        {title && <Typography className='customSelectTitle' variant="textLabel" sx={{ textTransform: "uppercase", fontFamily: "Inter" }}>{title ?? ""} {required && <span style={{ color: "#bd1721" }}>*</span>}</Typography>}
        <RadioGroup row name={name} value={value} onChange={onChange}>
          {options.map((x, i) => (
            <FormControlLabel key={`radio_${i}`} control={<Radio style={{zIndex:0}} />} value={x.value} label={x.label} style={{ color: "grey" }} />
          ))}
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}
export default RadioButtonsGroup