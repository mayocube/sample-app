import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import NavBar from '../components/NavBar'
import { Autocomplete, Container, FormControl, Grid, TextField, Typography } from '@mui/material'
import Header from '../components/Header'
import CustomSelect from '../components/CustomSelect'
import Actions from '../components/Actions'
import { getAllAgents, getmntasks } from '../EndPoint/EndPoints'
import CustomInput from '../components/CustomInput'
import { getData, saveData } from '../Util/indexedDBService'
import DataTable from '../components/DataTable'
import { formReducer } from '../Util/RequestHandler'
const Dashboard = () => {

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
                label: "Brand",
                accessor: "brand", // Update accessor key to "brand"
            },
            {
                label: "Priority",
                accessor: "priority", // Update accessor key to "priority"
            },
            {
                label: "Agent",
                accessor: "agent", // Update accessor key to "agent"
            },
            {
                label: "Age",
                accessor: "age", // Update accessor key to "age"
            },
            {
                label: "Status",
                accessor: "status", // Update accessor key to "status"
            },
            {
                label: "Task Sid",
                accessor: "taskSid", // Update accessor key to "taskSid"
            },
            {
                label: "CustomerEmailId",
                accessor: "customerEmailId", // Update accessor key to "customerEmailId"
            },
        ],
        []
    );

    return (
        <>
            <NavBar navbarTitle={" NM Twilio Super Admin Dev "} />
            <Container maxWidth={"100%"}>
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
                            { text: "Ten", value: 10 },
                            { text: "Twenty", value: 20 },
                            { text: "Thirty", value: 30 }
                        ]}
                    />
                    <CustomSelect title={"Priority"}
                        name='priority'
                        value={formData["priority"]}
                        onChange={setFormData}
                        id="priority"
                        items={[
                            { text: "Select one", value: "" },
                            { text: "Ten", value: 1 },
                            { text: "Twenty", value: 10 },
                            { text: "Thirty", value: 100 }
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
                            { text: "Ten", value: 7825 },
                            { text: "Twenty", value: 8122 },
                            { text: "Thirty", value: 8131 }
                        ]}
                    />
                    <CustomSelect title={"Status"}
                        name='status'
                        value={formData["status"]}
                        onChange={setFormData}
                        id="status"
                        items={[
                            { text: "Select one", value: "" },
                            { text: "Ten", value: 10 },
                            { text: "Twenty", value: 20 },
                            { text: "Thirty", value: 30 }
                        ]}
                    />

                    <Actions onRefresh={handleRefresh} actionTime={"last updated 6 minutes ago"} />
                </Grid>
                {/* <Box maxWidth={"100%"}>
                    <DataGrid
                        columns={[
                            { field: 'Brand', headerName: 'Brand' },
                            { field: 'Priority', headerName: 'Priority' },
                            { field: 'Agent', headerName: 'Agent', type: 'number' },
                            { field: 'Age', headerName: 'Age', type: 'number' },
                            { field: 'Status', headerName: 'Status', type: 'number' },
                            { field: 'TaskSID', headerName: 'Task SID', type: 'number' },
                            { field: 'CustomerEmail', headerName: 'Customer Email', type: 'number' },
                        ]}
                        rows={[
                            { id: 1, Brand: 'alllll', Priority: 'Jon', Agent: "al", Age: 35, Status: 35, TaskSID: 35, CustomerEmail: 35 },
                        ]}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 50 },
                            },
                        }}
                        pageSizeOptions={[50, 100]}
                        checkboxSelection
                    />
                </Box> */}
                < DataTable columns={columns} data={data} filterByStatus={""} formData={formData} filterByAge={""} filterByPriority={""} filterByBrand={""} />
            </Container>
        </>
    )
}

export default Dashboard