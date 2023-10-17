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
import { getAllAgents, getBrandDetails, getmntasks } from '../apiService/EndPoints';
import DataTable from './DataTable';
import SnackAlert from './SnackAlert';
import SideBar from './SideBar';
import CustomAccordian from './CustomAccordian';
import { getAgeLimit, getPriority } from '../utils/globalFunctions';
import DeleteModal from './DeleteModal';
import moment from 'moment/moment';

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
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const handleDeleteModalOpen = () => setOpenDeleteModal(true);
    const handleDeleteModalClose = () => setOpenDeleteModal(false);
    const [getClients, setGetClients] = useState([])
    const [formData, setFormData] = useReducer(formReducer, {
        priority: "",
        brand: "",
        status: "",
        age: [],
        agent: ""
    });
    const [resetData, setResetData] = useState(false)
    const [data, setData] = useState([]);
    const [agent, setAgent] = useState([]);
    const [rowId, setRowId] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [brandDetails, setBrandDetails] = useState([]);

    const pageSize = 20;
    const getDeletedArray = (arr) => {
        setGetClients(arr())
    }
    const updateClients = () => {
        setData(getClients)
    }
    const getSelectedRows = (selectedRows) => {
        setSelectedRows(selectedRows);
    }
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
        localStorage.setItem('lastUpdated', JSON.stringify(moment()))
    };

    const getTaskDetails = async (taskSid) => {
        const res = await getBrandDetails({ taskSid });
        if (res?.data?.status === "success") {
            setBrandDetails(res?.data?.data ?? []);
        } else {
            setBrandDetails([])
        }
    }

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
                accessorKey: "checkbox",
                header: ({ table }) => (
                    <>
                        <IndeterminateCheckbox
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                indeterminate: table.getIsSomeRowsSelected(),
                                onChange: table.getToggleAllRowsSelectedHandler(),
                            }}
                        />
                        {/* {console.log("all row selected", table.getIsAllRowsSelected())}
                        {console.log("some row selected", table.getIsSomeRowsSelected())} */}
                        <span style={{ marginLeft: "20px" }}> {table.getIsAllRowsSelected() ? " Deselect All" : " Select All"}</span>

                    </>
                ),
                cell: ({ row, getValue }) => {
                    return (
                        <div
                        >
                            {row.original.status === "Pending" &&
                                <>
                                    <IndeterminateCheckbox
                                        {...{
                                            checked: row.getIsSelected(),
                                            indeterminate: row.getIsSomeSelected(),
                                            onChange: row.getToggleSelectedHandler(),
                                        }}
                                    />{' '}
                                    {row.getCanExpand()}
                                    {row.getIsSelected()}
                                    {getValue()}
                                </>
                            }
                        </div>
                    )
                },
            },

            {
                header: "Brand",
                accessorKey: "brand",
                cell: (row) => (
                    <CustomAccordian onClick={(expanded) => { if (expanded) { getTaskDetails(row?.row?.original?.taskSid); setRowId(row?.row?.id) } else { setRowId(null) } }} title={row?.row?.original?.brand} />
                )
            },
            {
                header: "Priority",
                accessorKey: "priority",
                // filterFn: (rows, id, filterValue) => {
                //     console.log('rows', rows.getVisibleCells());
                //     return rows.getVisibleCells().filter(({ row }) => {
                //         console.log('rows', row.getValue(id));
                //         const priority = row.getValue(id);
                //         if (filterValue === "0-40" && priority <= 40) return true;
                //         if (filterValue === "41-100" && priority > 40 && priority <= 100) return true;
                //         if (filterValue === "+101" && priority > 100) return true;
                //         return false;
                //     });
                // },
                // filterFn: 'myCustomFilter',
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
    const handleResetClick = () => {
        setResetData(true);
    }
    // Define your custom filter method
    const inNumberRange = (rows, id, filterValue) => {
        return rows.filter((row) => {
            const priority = row.values[id];
            if (filterValue === "0-40" && priority <= 40) return true;
            if (filterValue === "41-100" && priority > 40 && priority <= 100) return true;
            if (filterValue === "+101" && priority > 100) return true;
            return false;
        });
    };
    const handleResetTable = () => {
        const temp = [
            {
                target: {
                    name: 'brand',
                    value: ''
                }
            },
            {
                target: {
                    name: 'age',
                    value: ''
                }
            },
            {
                target: {
                    name: 'agent',
                    value: ''
                }
            },
            {
                target: {
                    name: 'priority',
                    value: ''
                }
            },
            {
                target: {
                    name: 'status',
                    value: ''
                }
            },
        ];
        temp.map(x => setFormData(x));
        setResetData(false);
    }

    useEffect(() => {
        setFormData({
            agent: autoCompleAgent
        })
    }, [autoCompleAgent])

    useEffect(() => {
        localStorage.setItem('lastUpdated', JSON.stringify(moment()))
    }, [])

    return (
        <>
            <TopBar navbarTitle={" NM Twilio Super Admin Dev "} />
            <Container maxWidth={"100%"} sx={{ position: "relative" }}>
                <Header headerTitle={"Customer Email Queue"} handleReset={handleResetClick} />
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
                            { text: "+101", value: "+101" }
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
                        onChange={(e, prev) => {
                            const value = prev.props.value;
                            if (formData['age'].includes(value)) {
                                setFormData({
                                    ...formData,
                                    target: {
                                        name: 'age',
                                        value: formData['age']?.filter(x => x !== value)
                                    }
                                })
                            } else {
                                setFormData({
                                    ...formData,
                                    target: {
                                        name: 'age',
                                        value: [value, ...formData['age']]
                                    }
                                })
                            }
                        }}
                        id="age"
                        multiple={true}
                        checkboxSelect={true}
                        items={[
                            { text: 'Less than one hour old', value: 'Less than one hour old' },
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

                    <Actions disabled={selectedRows?.length === 0} handleDeleteModalOpen={handleDeleteModalOpen} setForPriority={setForPriority} setSideBarTitle={setSideBarTitle} setForAgent={setForAgent} setOpenSidebar={setOpenSidebar} onRefresh={handleRefresh} actionTime={moment(JSON.parse(localStorage.getItem('lastUpdated'))).fromNow()} />
                </Grid>

                <Box sx={{ position: "absolute", top: "20px", width: "100%" }}>
                    <SnackAlert message={message} />
                </Box>
                <Box>
                    <DeleteModal updateClients={updateClients} handleDeleteModalOpen={handleDeleteModalOpen} handleDeleteModalClose={handleDeleteModalClose} openDeleteModal={openDeleteModal} />
                </Box>
                <SideBar ForPriority={ForPriority} sideBarTitle={sideBarTitle} setForAgent={setForAgent} forAgent={forAgent} openSideBar={openSideBar} setOpenSidebar={setOpenSidebar} title={"Select agent to assign email/s to"} options={agent} open={open} />
                <DataTable rowId={rowId} getSelectedRows={getSelectedRows} brandDetails={brandDetails} resetData={resetData} handleReset={handleResetTable} getDeletedArray={getDeletedArray} columns={columns} data={data} formData={formData} />
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
