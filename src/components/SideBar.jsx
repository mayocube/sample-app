import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useEffect } from 'react';
import Input from '@mui/material/Input';
import { Radio } from '@mui/material';

const SideBar = ({
    sideBarTitle = "", options = [], openSideBar = false, forAgent = false, setForAgent = () => { }, ForPriority = false, setOpenSidebar = () => { } }) => {
    const [filter, setFilter] = useState(options)

    useEffect(() => {
        setFilter(options)
    }, [options]);

    // const [openSideBar, setOpenSidebar] = React.useState(false);

    const handleFilter = (term) => {
        setFilter(options.filter(ele => ele?.agentName?.toLowerCase().includes(term)))
    }

    const toggleDrawer = () => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenSidebar(!openSideBar);
    };

    return (
        <div>
            <Drawer
                hideBackdrop={true}
                anchor={'right'}
                open={openSideBar}
                onClose={toggleDrawer()}
            >
                <Box
                    sx={{ width: "446px" }}
                    role="presentation"
                >
                    <Box className="titleContainer">
                        <span style={{
                            fontSize: " 0.875rem",
                            fontStyle: " normal",
                            fontWeight: " 400",
                            lineHeight: " 1.3125rem"
                        }}>{sideBarTitle} </span><span>{<CloseIcon onClick={() => {
                            setOpenSidebar(false)
                            setForAgent(false)
                        }} />} </span>
                    </Box>
                    {forAgent && <><Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <Input
                            placeholder='Search for an agent'
                            sx={{
                                height: "36px", minWidth: "414px", margin: "0 auto", gap: "10px", padding: "8px, 12px, 8px, 12px"
                            }}
                            onChange={(e) => {
                                handleFilter(e?.target?.value?.toLowerCase())
                            }}
                        />
                    </Box>
                        <List>
                            {filter.map((agent, index) => (
                                <ListItem key={`${index}${agent}`} disablePadding>
                                    <ListItemButton sx={{ borderTop: "1px solid #D9D9D9", padding: "16px, 16px, 8px, 16px" }}>
                                        <ListItemIcon>
                                            <Radio
                                                checked={''}
                                                onChange={""}
                                                value="a"
                                                name="radio-buttons"
                                                inputProps={{ 'aria-label': 'A' }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText sx={{
                                            lineHeight: "21px", fontSize: "14px", fontWeight: "400", color: "#000000"
                                        }} primary={agent?.agentName} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List></>}


                    {ForPriority &&
                        <List>
                            {["0", "40", "100"].map((priority, index) => (
                                <ListItem key={`${index}${priority}`} disablePadding>
                                    <ListItemButton sx={{ borderTop: "1px solid #D9D9D9", padding: "16px, 16px, 8px, 16px" }}>
                                        <ListItemIcon>
                                            <Radio
                                                checked={''}
                                                onChange={""}
                                                value="a"
                                                name="radio-buttons"
                                                inputProps={{ 'aria-label': 'A' }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText sx={{
                                            lineHeight: "21px", fontSize: "14px", fontWeight: "400", color: "#000000"
                                        }} primary={priority} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>}
                </Box >

            </Drawer >
        </div >
    );
}

export default SideBar;