import { DataGrid } from '@mui/x-data-grid';
import './App.css';
import { AppBar, Box, Button, Container, FormControl, FormLabel, Grid, IconButton, MenuItem,  Select, TextField, ThemeProvider, Toolbar, Typography } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import React from 'react';
import theme from './Util/theme';
import MenuIcon from '@mui/icons-material/Menu';

function App() {
  const [age, setAge] = React.useState(0);
  const handleChange = (event) => {
    setAge(event.target.value);
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
        <Grid container spacing={2} paddingBottom={1} paddingTop={3}>
          <Grid item xs={10}>
            <Typography variant="h6" gutterBottom>Customer Email Queue</Typography>
          </Grid>
          <Grid item xs={2} gap={2} display={"flex"} alignItems={"center"}>
            <Button variant="contained" color="error" sx={{ borderRadius: 30, paddingLeft: 5, paddingRight: 5 }}>reset</Button>
            <Button variant="contained" sx={{ borderRadius: 30, paddingLeft: 5, paddingRight: 5 }}>filter</Button>
          </Grid>
  
          <Grid item xs={2} marginTop={2}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel variant="textLabel">Customer email</FormLabel>
              <TextField sx={{ width: "100%" }} />
            </FormControl>
          </Grid>
          <Grid item xs={2} marginTop={2}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>Brand</FormLabel>
              <Select value={age} onChange={handleChange}>
                <MenuItem value={0}>Select one</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} marginTop={2}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>Priority</FormLabel>
              <Select value={age} onChange={handleChange}>
                <MenuItem value={0}>Select one</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} marginTop={2}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>Agent</FormLabel>
              <Select value={age} onChange={handleChange}>
                <MenuItem value={0}>Select one</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} marginTop={2}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>Age</FormLabel>
              <Select value={age} onChange={handleChange}>
                <MenuItem value={0}>Select one</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} marginTop={2}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>Status</FormLabel>
              <Select value={age} onChange={handleChange}>
                <MenuItem value={0}>Select one</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} lg={12} marginTop={1} display={"flex"} alignItems={"center"} justifyContent={"space-between"}  paddingBottom={0} marginBottom={0} paddingLeft={0} paddingRight={0}>
            <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={1}>
              <Button color='default' startIcon={<DeleteOutlinedIcon />}>Delete</Button>
              <Button color='default' startIcon={<NotificationsNoneIcon />}>Set Priority</Button>
              <Button color='default' startIcon={<PersonOutlineIcon />}>Assign</Button>
            </Box>
            <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={2}>
              <Typography color='default' variant="body1" gutterBottom>last updated 6 minutes ago</Typography>
              <Button color='default' startIcon={<CachedIcon />}>Assign</Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box className={"custom-grid"} maxWidth={"100%"}>
        <DataGrid
          columns={[
            { field: 'Brand', headerName: 'Brand' },
            { field: 'Priority', headerName: 'Priority' },
            { field: 'Agent', headerName: 'Agent', type: 'number' },
            { field: 'Age', headerName: 'Age', type: 'number' },
            { field: 'Status', headerName: 'Status', type: 'number' },
            { field: 'TaskSID', headerName: 'Task SID', type: 'number' },
            { field: 'CustomerEmail', headerName: 'Customer Email', type: 'number'  },
          ]}
          rows={[
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },
          ]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ width: "100%" }}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
