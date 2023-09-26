import { Select, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';


const CustomSelect = ({ name, selectedValue, setSelectedValue, items }) => {
    const [open, setOpen] = useState(false);

    const handleChange = (event) => {
        setSelectedValue({...selectedValue, [event.target.name]: event.target.value });
    };

    const toggleSelect = () => {
        setOpen(open ? false : true);
    };

    return <Select
        name={name}
        open={open}
        onClose={toggleSelect}
        onOpen={toggleSelect}
        value={selectedValue[name]}
        onChange={handleChange}
        className={"custom-select"}
        IconComponent={() => <KeyboardArrowDownIcon onClick={toggleSelect} />}
        sx={{ height: 36, fontSize: 14, borderColor: "#F4F4F6" }}>
        {
            items.map((item, index) => <MenuItem key={index} value={item.value}>{item.text}</MenuItem>)
        }
    </Select>;
};
export default CustomSelect;