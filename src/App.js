import { DataGrid } from '@mui/x-data-grid';
import './App.css';
import { AppBar, Box, Button, Container, FormControl, FormLabel, Grid, IconButton, MenuItem, Select, TextField, ThemeProvider, Toolbar, Typography } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import React from 'react';
import theme from './Util/theme';
import MenuIcon from '@mui/icons-material/Menu';

function App() {
  const [selectedValue, setSelectedValue] = React.useState({ brand: 0, priority: 0, agent: 0, age: 0, status: 0 });
  
  const handleChange = (event) => {
    setSelectedValue({...selectedValue, [event.target.name]: event.target.value });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color='dark'>
        <Container maxWidth="l00%">
          <Toolbar disableGutters>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}> <MenuIcon /> </IconButton>
            <Typography variant="h6" color="inherit" component="div"> NEIMAN MARCUS Twilio Super Admin Dev </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth={"100%"}>
        <Grid container spacing={1} sx={{ display: "flex", alignItems: "center", lineHeight : "28px", minHeight: "36px", marginTop: 0, paddingTop: "24px", paddingBottom: "24px" }}>
          <Grid item xs={12} display={"flex"} alignItems={"center"} justifyContent={"space-between"} paddingTop={0}>
            <Box sx={{ display: "flex", alignItems: "center", marginTop: 0, paddingTop: 0, paddingBottom: 0 }}><Typography variant="headingText" gutterBottom>Customer Email Queue</Typography></Box>
            <Box sx={{ display: "flex", alignItems: "center", marginTop: 0, paddingTop: 0, paddingBottom: 0, gap: 3 }}>
              <Button variant="contained" color="error" sx={{ borderRadius: 30, paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1 }}>reset</Button>
              <Button variant="contained" sx={{ borderRadius: 30, paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1 }}>filter</Button>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2} paddingBottom={1} paddingTop={0}>
          <Grid item xs={2} marginTop={0}>
            <FormControl sx={{ width: "100%" }}>
              <Typography variant="textLabel" sx={{ textTransform: "uppercase" }}>Customer email</Typography>
              <TextField sx={{ width: "100%" }} />
            </FormControl>
          </Grid>
          <Grid item xs={2} marginTop={0}>
            <FormControl sx={{ width: "100%" }}>
              <Typography variant="textLabel" sx={{ textTransform: "uppercase" }}>Brand</Typography>
              <Select
                name='brand'
                value={selectedValue.brand}
                onChange={handleChange}
                className={"custom-select"}
                IconComponent={() => <KeyboardArrowDownIcon />}
                sx={{ height: 36, fontSize: 14, borderColor: "#F4F4F6" }}>
                <MenuItem value={0}>Select one</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} marginTop={0}>
            <FormControl sx={{ width: "100%" }}>
              <Typography variant="textLabel" sx={{ textTransform: "uppercase" }}>Priority</Typography>
              <Select
                name='priority'
                value={selectedValue.priority}
                onChange={handleChange}
                className={"custom-select"}
                IconComponent={() => <KeyboardArrowDownIcon />}
                sx={{ height: 36, fontSize: 14, borderColor: "#F4F4F6" }}>
                <MenuItem value={0}>Select one</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} marginTop={0}>
            <FormControl sx={{ width: "100%" }}>
              <Typography variant="textLabel" sx={{ textTransform: "uppercase" }}>Agent</Typography>
              <Select
                name='agent'
                value={selectedValue.agent}
                onChange={handleChange}
                className={"custom-select"}
                IconComponent={() => <KeyboardArrowDownIcon />}
                sx={{ height: 36, fontSize: 14, borderColor: "#F4F4F6" }}>
                <MenuItem value={0}>Select one</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} marginTop={0}>
            <FormControl sx={{ width: "100%" }}>
              <Typography variant="textLabel" sx={{ textTransform: "uppercase" }}>Age</Typography>
              <Select
                name='age'
                value={selectedValue.age}
                onChange={handleChange}
                className={"custom-select"}
                IconComponent={() => <KeyboardArrowDownIcon />}
                sx={{ height: 36, fontSize: 14, borderColor: "#F4F4F6" }}>
                <MenuItem value={0}>Select one</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} marginTop={0}>
            <FormControl sx={{ width: "100%" }}>
              <Typography variant="textLabel" sx={{ textTransform: "uppercase" }}>Status</Typography>
              <Select
                name='status'
                value={selectedValue.status}
                onChange={handleChange}
                className={"custom-select"}
                IconComponent={() => <KeyboardArrowDownIcon />}
                sx={{ height: 36, fontSize: 14, borderColor: "#F4F4F6" }}>
                <MenuItem value={0}>Select one</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} lg={12} marginTop={1} display={"flex"} alignItems={"center"} justifyContent={"space-between"} paddingBottom={0} marginBottom={0} paddingLeft={0} paddingRight={0}>
            <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={1}>
              <Button color='default' startIcon={<DeleteOutlinedIcon fontSize="large" />}>Delete</Button>
              <Button color='default' startIcon={<NotificationsNoneIcon fontSize="large" />}>Set Priority</Button>
              <Button color='default' startIcon={<PersonOutlineIcon fontSize="large" />}>Assign</Button>
            </Box>
            <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={2}>
              <Typography variant="filterText" marginBottom={0} gutterBottom>last updated 6 minutes ago</Typography>
              <Button color='default' startIcon={<CachedIcon fontSize="large" />}>Refresh</Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

    </ThemeProvider>
  );
}

export default App;
