import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { Autocomplete, Box, Button, Container, Drawer, FormControl, Grid, TextField, Typography } from '@mui/material'
import { formReducer } from '../utils/RequestHandler';
import { getAllAgents, getmntasks } from '../apiService/endPoints';
import { getData, saveData } from '../utils/indexedDBService';
import NavBar from './NavBar';
import Header from './Header';
import CustomInput from './CustomInput';
import CustomSelect from './CustomSelect';
import Actions from './Actions';
import DataTable from './DataTable';
import SnackAlert from './SnackAlert';
import SideBar from './SideBar';

const Dashboard = () => {
    const [open, setOpen] = useState(true)
    const [formData, setFormData] = useReducer(formReducer, {
        priority: "",
        brand: "",
        status: "",
        age: ""
    });

    const [data, setData] = useState([]);
    const [agent, setAgent] = useState([]);

    const pageSize = 20;

    const getAgents = async () => {
        const res = await getAllAgents()
        if (res) {
            setAgent(res?.data?.data)
        }
    }

    const getnmTasksData = async (prevData, pageNo, pageToken) => {
        var args = {};
        if (pageNo > 1) {
            args = { pageNo, pageSize, pageToken }
        }

        const res = await getmntasks(args);
        if (res?.data?.pageToken != null) {
            const newData = [...prevData, ...res?.data?.data];
            setData(newData);
            saveData(newData);
            console.log(newData);
            setTimeout(async () => {
                await getnmTasksData(newData, res?.data?.pageNo, res?.data?.pageToken);
            }, 200);
        }
    }

    const handleRefresh = async () => {
        getnmTasksData([], 1, null);
    };

    useEffect(() => {
        getAgents();
        (async () => {
            const res = await getData();
            if (res.length === 0) {
                await getnmTasksData([], 1, null)
            } else {
                console.log("dbData==>", res);
                setData(res);
            }
        })()
    }, [])
    const columns = useMemo(
        () => [
            {
                header: "Select All",
                accessorKey: "", // Update accessorKey key to "brand"
                cell: () => (
                    <label className="custom-toggle">
                        <input className='checkBox' onChange={() => {
                        }} checked={1} type="checkbox" />
                        <span className="custom-toggle-slider  rounded-circle" />
                    </label>
                )
            },
            {
                header: "Brand",
                accessorKey: "brand", // Update accessorKey key to "brand"
            },
            {
                header: "Priority",
                accessorKey: "priority", // Update accessorKey key to "priority"
            },
            {
                header: "Agent",
                accessorKey: "agent", // Update accessorKey key to "agent"
            },
            {
                header: "Age",
                accessorKey: "age", // Update accessorKey key to "age"
            },
            {
                header: "Status",
                accessorKey: "status", // Update accessorKey key to "status"
            },
            {
                header: "Task Sid",
                accessorKey: "taskSid", // Update accessorKey key to "taskSid"
            },
            {
                header: "CustomerEmailId",
                accessorKey: "customerEmailId", // Update accessorKey key to "customerEmailId"
            },
        ],
        []
    );

    return (
        <>
            <NavBar navbarTitle={" NM Twilio Super Admin Dev "} />
            <Container maxWidth={"100%"} sx={{ position: "relative" }}>
                <Header headerTitle={"Customer Email Queue"} />
                <Grid container spacing={1} paddingBottom={1} paddingTop={0}>
                    <CustomInput title={'Customer email'} />
                    <CustomSelect title={"Brand"}
                        name='brand'
                        value={formData["brand"]}
                        onChange={setFormData}
                        id="brand"
                        items={[
                            { text: "Select one", value: "" },
                            { text: "Neiman Marcus", value: "Neiman Marcus" },
                            { text: "Bergdorf Goodman", value: "Bergdorf Goodman" },
                            { text: "Horchow", value: "Horchow" }
                        ]}
                    />
                    <CustomSelect title={"Priority"}
                        name='priority'
                        value={formData["priority"]}
                        onChange={setFormData}
                        id="priority"
                        items={[
                            { text: "Select one", value: "" },
                            { text: "0-40", value: "0-40" },
                            { text: "41-100", value: "41-100" },
                            { text: "101+", value: "101+" }
                        ]}
                    />
                    <Grid item xs={2} marginTop={0}>
                        <FormControl className='customSelects' sx={{ width: "100%" }}>
                            <Typography className='customSelectTitle' variant="textLabel" sx={{ textTransform: "uppercase" }}>Agent</Typography>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={agent}
                                getOptionLabel={(option) => option.agentName}
                                className={"custom-select"}
                                sx={{
                                    height: 36, fontSize: 14, borderColor: "#EEEEEE", color: "#5c5c5c", ":hover": {
                                        borderColor: "#EEEEEE",
                                        color: "#333333",
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Select one" />}
                            />
                        </FormControl>
                    </Grid>
                    <CustomSelect title={"Age"}
                        name='age'
                        value={formData["age"]}
                        onChange={setFormData}
                        id="age"
                        items={[
                            { text: "Select one", value: "" },
                            { text: "Less than one hours old", value: 3600000 },
                            { text: "Between 24-48 hours old", value: 172800000 },
                            { text: "Between 48-72 hours old", value: 259200000 },
                            { text: "Greater than 72 hours old", value: 259200001 }
                        ]}
                    />
                    <CustomSelect title={"Status"}
                        name='status'
                        value={formData["status"]}
                        onChange={setFormData}
                        id="status"
                        items={[
                            { text: "Select one", value: "" },
                            { text: "Pending", value: "Pending" },
                            { text: "Reserved", value: "Reserved" },
                            { text: "Wrapping", value: "Wrapping" }
                        ]}
                    />

                    <Actions onRefresh={handleRefresh} actionTime={"last updated 6 minutes ago"} />
                </Grid>
                <Box sx={{ position: "absolute", top: "20px", width: "100%" }}>
                    {/* <SnackAlert sx={{ position: "absolute" }} open={open} onClose={() => {
                        setOpen(false)
                    }} isSuccess={true} /> */}
                    <SideBar />
                </Box>
                <DataTable columns={columns} data={data} />
            </Container>
        </>
    )
}

export default Dashboard