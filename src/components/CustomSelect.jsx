import { Select, MenuItem, Grid, FormControl, Typography, Checkbox, ListItemText } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
const CustomSelect = ({ isOpen = false, name, onChange, value = '', items, onClick, title, multiple = false, checkboxSelect = false, MenuStyle = {}, required = false, width = 2, createable, getOptionLabel = 'text', disabled = false }) => {
  const [open, setOpen] = useState(false);
  const toggleSelect = () => {
    setOpen(open ? false : true);
  };

  return (
    <Grid item xs={width} marginTop={0}>
      <FormControl className='customSelects' sx={{ width: "100%" }} >
        {title && <Typography className='customSelectTitle' variant="textLabel" sx={{ textTransform: "uppercase", fontFamily: "Inter" }}>{title ?? ""} {required && <span style={{ color: "#bd1721" }}>*</span>}</Typography>}
        <Select
          multiple={multiple}
          disabled={disabled}
          displayEmpty
          name={name}
          open={open}
          onClose={toggleSelect}
          onOpen={toggleSelect}
          onClick={() => { isOpen }}
          value={value}
          onChange={onChange}
          input={createable}
          className={"custom-select"}
          renderValue={(selected) => {
            if (!selected || selected?.length === 0) {
              return <div>Select one</div>;
            }
            if (multiple) {
              return selected.join(', ')
            }
            return selected
          }}
          IconComponent={() => <KeyboardArrowDownIcon style={{ cursor: "pointer"}} onClick={ !disabled ? toggleSelect : () => {}}
          />}
          MenuProps={{
            sx: MenuStyle
          }}
          sx={{
            height: 36, fontSize: 14, borderColor: "#EEEEEE", color: "#5c5c5c", ":hover": {
              borderColor: "#EEEEEE",
              color: "#333333",
            }
          }}>
          {items.map((item, index) => (
            <MenuItem key={index} value={item.value}>
              {checkboxSelect && <Checkbox checked={value.includes(item.value)} />}
              <ListItemText primary={item[getOptionLabel]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};
export default CustomSelect;