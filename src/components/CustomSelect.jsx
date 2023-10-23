import { Select, MenuItem, Grid, FormControl, Typography, Checkbox, ListItemText } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
const CustomSelect = ({ name, onChange, value = '', items, title, multiple = false, checkboxSelect = false }) => {
    const [open, setOpen] = useState(false);
    const toggleSelect = () => {
        setOpen(open ? false : true);
    };

    return (


        <Grid item xs={2} marginTop={0}>
            <FormControl className='customSelects' sx={{ width: "100%" }}>
                <Typography className='customSelectTitle' variant="textLabel" sx={{ textTransform: "uppercase", fontFamily: "Inter" }}>{title ?? ""}</Typography>
                <Select
                    multiple={multiple}
                    displayEmpty
                    name={name}
                    open={open}
                    onClose={toggleSelect}
                    onOpen={toggleSelect}
                    value={value}
                    onChange={onChange}
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
                    IconComponent={() => <KeyboardArrowDownIcon onClick={toggleSelect} />}
                    sx={{
                        height: 36, fontSize: 14, borderColor: "#EEEEEE", color: "#5c5c5c", ":hover": {
                            borderColor: "#EEEEEE",
                            color: "#333333",
                        }
                    }}>
                    {items.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                            {checkboxSelect && <Checkbox checked={value.includes(item.value)} />}
                            <ListItemText primary={item.text} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid >
    );
};
export default CustomSelect;