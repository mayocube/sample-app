import { Select, MenuItem, Grid, FormControl, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';


const CustomSelect = ({ name, selectedValue, setSelectedValue, items, title }) => {
    const [open, setOpen] = useState(false);

    const handleChange = (event) => {
        setSelectedValue({ ...selectedValue, [event.target.name]: event.target.value });
    };

    const toggleSelect = () => {
        setOpen(open ? false : true);
    };

    return (


        <Grid item xs={2} marginTop={0}>
            <FormControl className='customSelects' sx={{ width: "100%" }}>
                <Typography className='customSelectTitle' variant="textLabel" sx={{ textTransform: "uppercase" }}>{title ?? ""}</Typography>
                <Select
                    name={name}
                    open={open}
                    onClose={toggleSelect}
                    onOpen={toggleSelect}
                    value={selectedValue[name]}
                    onChange={handleChange}
                    className={"custom-select"}
                    IconComponent={() => <KeyboardArrowDownIcon onClick={toggleSelect} />}
                    sx={{
                        height: 36, fontSize: 14, borderColor: "#EEEEEE", color: "#5c5c5c", ":hover": {
                            borderColor: "#EEEEEE",
                            color: "#333333",
                        }
                    }}>
                    {
                        items.map((item, index) => <MenuItem key={index} value={item.value}>{item.text}</MenuItem>)
                    }
                </Select>
            </FormControl>
        </Grid>
    );
};
export default CustomSelect;