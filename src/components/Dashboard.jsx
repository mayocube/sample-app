import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { Autocomplete, Box, Button, Container, FormControl, Grid, TextField, Typography } from '@mui/material'
import { formReducer } from '../utils/RequestHandler';
import { getData, saveData } from '../utils/indexedDBService';
import TopBar from './TopBar';
import Header from './Header';
import CustomInput from './CustomInput';
import CustomSelect from './CustomSelect';
import Actions from './Actions';
import { useOktaAuth } from '@okta/okta-react';
import { getAllAgents, getmntasks } from '../apiService/EndPoints';
import DataTable from './DataTable';
import SnackAlert from './SnackAlert';
import SideBar from './SideBar';
import CustomAccordian from './CustomAccordian';
import { getAgeLimit, getPriority } from '../utils/globalFunctions';

const Dashboard = () => {
    const { oktaAuth, authState } = useOktaAuth();
    const triggerLogin = async () => {
        await oktaAuth.signInWithRedirect();
    };

    // if (authState && !authState.isPending && !authState.isAuthenticated) {
    //     return (<>
    //         <div style={{ height: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
    //             <button onClick={triggerLogin} className="button">Login to continue</button>
    //         </div>
    //     </>)
    // }

    const [openSideBar, setOpenSidebar] = React.useState(false);
    const [sideBarTitle, setSideBarTitle] = useState("")
    const [message, setMessage] = useState("")
    const [forAgent, setForAgent] = useState(false)
    const [ForPriority, setForPriority] = useState(false)
    const [open, setOpen] = useState(false)
    const [autoCompleAgent, setAutoCompleAgent] = useState("")
    const [formData, setFormData] = useReducer(formReducer, {
        priority: "",
        brand: "",
        status: "",
        age: "",
        agent: ""
    });
    const [data, setData] = useState([]);
    const [agent, setAgent] = useState([]);
    const pageSize = 20;

    const getAgents = async () => {
        try {
            const res = await getAllAgents()
            if (res) {
                setAgent(res?.data?.data)
            }

        } catch (error) {
            setMessage("Error: While fetching agents")
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
            setTimeout(async () => {
                await getnmTasksData(newData, res?.data?.pageNo, res?.data?.pageToken);
            }, 200);
        }
    }

    const handleRefresh = async () => {
        await getnmTasksData([], 1, null);
    };

    useEffect(() => {
        if (authState != null) {
            getAgents();
            (async () => {
                const res = await getData();
                if (res.length === 0) {
                    await getnmTasksData([], 1, null);
                } else {
                    setData(res);
                }
            })()
        }
    }, [authState])

    const columns = useMemo(
        () => [
            {
                accessorKey: "ads",
                header: ({ table }) => (
                    <>
                        <IndeterminateCheckbox
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                indeterminate: table.getIsSomeRowsSelected(),
                                onChange: table.getToggleAllRowsSelectedHandler(),
                            }}
                        />
                        <span style={{ marginLeft: "20px" }}> {table.getIsAllRowsSelected() ? " Deselect All" : " Select All"}</span>

                    </>
                ),
                cell: ({ row, getValue }) => (
                    <div
                    >
                        <>
                            <IndeterminateCheckbox
                                {...{
                                    checked: row.getIsSelected(),
                                    indeterminate: row.getIsSomeSelected(),
                                    onChange: row.getToggleSelectedHandler(),
                                }}
                            />{' '}
                            {row.getCanExpand()}
                            {getValue()}
                        </>
                    </div>
                ),
            },

            {
                header: "Brand",
                accessorKey: "brand",
                cell: (row) => (
                    <CustomAccordian detail={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt itaque tempora corrupti? Officiis, ipsa dolorem deleniti nam velit vero dignissimos."} title={row?.row?.original?.brand} />
                ),
            },
            {
                header: "Priority",
                accessorKey: "priority",
                cell: (row) => (
                    <div>{getPriority(row?.row?.original?.priority)}</div>
                ),
            },
            {
                header: "Agent",
                accessorKey: "agent",
            },
            {
                header: "Age",
                accessorKey: "age",
                cell: (row) => (
                    <div>{getAgeLimit(row?.row?.original?.age)}</div>
                )
            },
            {
                header: "Status",
                accessorKey: "status",
            },
            {
                header: "Task Sid",
                accessorKey: "taskSid",

            },
            {
                header: "CustomerEmailId",
                accessorKey: "customerEmailId",
            },
        ],
        []
    );

    useEffect(() => {
        setFormData({
            agent: autoCompleAgent
        })
    }, [autoCompleAgent])
    return (
        <>
            <TopBar navbarTitle={" NM Twilio Super Admin Dev "} />
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
                                name="agent"
                                id="combo-box-demo"
                                onSelect={(e) => setAutoCompleAgent(e.target.value)}
                                options={agent}
                                getOptionLabel={(option) => option.agentName}
                                key={(option) => option.workerSid}
                                className={"custom-select"}
                                autoComplete={true}
                                sx={{
                                    height: 36, fontSize: 14, borderColor: "#EEEEEE", color: "#5c5c5c", ":hover": {
                                        borderColor: "#EEEEEE",
                                        color: "#333333",
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} placeholder="Select one" />}
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
                            { text: '7825', value: '7825' },
                            { text: "Between 24-48 hours old", value: "Between 24-48 hours old" },
                            { text: "Between 48-72 hours old", value: "Between 48-72 hours old" },
                            { text: "Greater than 72 hours old", value: "Greater than 72 hours old" }
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

                    <Actions setForPriority={setForPriority} setSideBarTitle={setSideBarTitle} setForAgent={setForAgent} setOpenSidebar={setOpenSidebar} onRefresh={handleRefresh} actionTime={"last updated 6 minutes ago"} />
                </Grid>

                <Box sx={{ position: "absolute", top: "20px", width: "100%" }}>
                    <SnackAlert message={message} />
                </Box>

                <SideBar ForPriority={ForPriority} sideBarTitle={sideBarTitle} setForAgent={setForAgent} forAgent={forAgent} openSideBar={openSideBar} setOpenSidebar={setOpenSidebar} title={"Select agent to assign email/s to"} options={agent} open={open} />
                <DataTable columns={columns} data={data} formData={formData} />
            </Container>

        </>
    )
}

const IndeterminateCheckbox = ({ indeterminate, className = '', ...rest }) => {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer customCheckBox'}
            {...rest}
        />
    );
};

export default Dashboard
