import {  Select, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';


const CustomSelect = (props) => {
    const [open, setOpen] = useState(false);
    const [selectedValue,setSelectedValue] =  useState(0);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    }

    const toggleSelect = () => {
        setOpen(open ? false : true);
    };
    
    return <Select
        name={props.name}
        open={open}
        onClose={toggleSelect}
        onOpen={toggleSelect}
        value={selectedValue}
        onChange={handleChange}
        className={"custom-select"}
        IconComponent={() => <KeyboardArrowDownIcon onClick={toggleSelect}/>}
        sx={{ height: 36, fontSize: 14, borderColor: "#F4F4F6" }}>
            {
                props.items.map((item,index) => <MenuItem key={index} value={item.value}>{item.text}</MenuItem> )
            }
    </Select>;
};
export default CustomSelect;