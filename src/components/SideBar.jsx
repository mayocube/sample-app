import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useEffect } from 'react';
import Input from '@mui/material/Input';
import { CircularProgress, Radio } from '@mui/material';
import CustomInput from './CustomInput';

const SideBar = ({
  options = [],
  openSideBar = false,
  columnToUpdate = '',
  sideBarLoading = false,
  setColumnToUpdate = () => { },
  setOpenSidebar = () => { },
  setSideBarLoading = () => { },
  handlePriorityAndAssignment = () => { }
}) => {

  const [filter, setFilter] = useState(options);
  const [priority, setPriority] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  const handleFilter = (term) => {
    setFilter(options.filter(ele => ele?.fullName?.toLowerCase().includes(term)))
  }

  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenSidebar(!openSideBar);
  };

  useEffect(() => {
    if (openSideBar) {
      setFilter(options);
    }
    setPriority('');
    setSelectedAgent('');
  }, [options, openSideBar]);

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
            }}>
              {columnToUpdate === 'priority' ? 'Set priority' : 'Select agent to assign email/s to'}
            </span>
            <span>
              <CloseIcon
                onClick={() => {
                  setOpenSidebar(false)
                  setColumnToUpdate('')
                }}
              />
            </span>
          </Box>
          {columnToUpdate === 'agent' &&
            <>
              <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }} className="customInputMui">
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
              <List className='MuiCustomList'>
                {filter.map((agent, index) => (
                  <ListItem key={`${index}${agent}`} disablePadding>
                    <ListItemButton sx={{ borderTop: "1px solid #D9D9D9", padding: "16px, 16px, 8px, 16px" }}>
                      <ListItemIcon>
                        <Radio
                          checked={selectedAgent === agent?.fullName}
                          onChange={() => setSelectedAgent(agent?.fullName)}
                          name="radio-buttons"
                          inputProps={{ 'aria-label': 'A' }}
                        />
                      </ListItemIcon>
                      <ListItemText sx={{
                        lineHeight: "21px", fontSize: "14px", fontWeight: "400", color: "#000000"
                      }} primary={agent?.fullName} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          }
          {columnToUpdate === 'priority' &&
            <Box sx={{ px: "16px" }}>
              <CustomInput
                title={''}
                type='number'
                value={priority}
                onChange={(e) => { if (e.target.value >= 0) { setPriority(e.target.value) } }}
              />
            </Box>
          }
        </Box>
        <Box sx={{ position: 'sticky', bottom: 0 }}>
          <Box sx={{ padding: "16px", backgroundColor: "white" }}>
            <Button
              disabled={sideBarLoading || (columnToUpdate === 'priority' && priority === "")}
              onClick={() => {
                setSideBarLoading(true);
                handlePriorityAndAssignment(columnToUpdate === 'priority' ? priority : selectedAgent);
              }}
              sx={{ width: "100%", backgroundColor: "#0263E0", height: "40px", padding: "8px 12px", gap: "4px" }} variant="contained"
            >
              {sideBarLoading ?
                <CircularProgress />
                :
                <>
                  {columnToUpdate === 'priority' ? 'Set Priority' : 'Assign'}
                </>
              }
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}

export default SideBar;