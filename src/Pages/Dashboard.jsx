import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { Autocomplete, Box, Container, FormControl, Grid, TextField, Typography } from '@mui/material'
import { formReducer } from '../utils/RequestHandler';
import { clearData, deleteData, getData, saveData, updateData } from '../utils/indexedDBService';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import CustomSelect from '../components/CustomSelect';
import Actions from '../components/Actions';
import { useOktaAuth } from '@okta/okta-react';
import { setEmailPriority, deleteEmailTasks, getAgents, getEmailDetails, getEmailTasks, assignEmailTaskToAgent } from '../apiService/EndPoints';
import DataTable from '../components/DataTable';
import SnackAlert from '../components/SnackAlert';
import SideBar from '../components/SideBar';
import CustomAccordian from '../components/CustomAccordian';
import DeleteModal from '../components/DeleteModal';
import moment from 'moment/moment';
import { createColumnHelper } from '@tanstack/react-table';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const location = useHistory()
  const triggerLogin = async (route) => {
    if (process.env.NODE_ENV === "development") {
      location.replace(`/login/${route}?code=sYmm2mzsJBrJ7LSxkwvlsL3V2UJlwaUf5l5Le9dNSXg&state=pnRCq7Dlw6HerG7EvgvW62VQqS4PWistWLncaqsgX4RFV0Z74GTi6wrDE1En4gU6`);
      window.location.reload();
    } else {
      await oktaAuth.signInWithRedirect();
      const oktaAccessToken = encodeURIComponent(oktaAuth.getAccessToken());
      console.log(`okta access token generated: ${oktaAccessToken}`);
    }
    await clearData();
  };

  if (authState && !authState.isPending && !authState.isAuthenticated) {
    return (
      <div style={{ height: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <button onClick={() => triggerLogin('callback')} className="button">Login</button>
      </div>
    );
  }

  const [openSideBar, setOpenSidebar] = useState(false);
  const [gridLoading, setGridLoading] = useState(false);
  const [sideBarLoading, setSideBarLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState("")
  const [columnToUpdate, setColumnToUpdate] = useState('')
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleDeleteModalOpen = () => setOpenDeleteModal(true);
  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setDeleteLoading(false);
  };
  const [formData, setFormData] = useReducer(formReducer, {
    customerEmail: '',
    priority: "",
    brand: "",
    status: "",
    age: [],
    agent: {
      fullName: '',
      workerSid: ''
    }
  });
  const [resetData, setResetData] = useState(false)
  const [data, setData] = useState([]);
  const [agent, setAgent] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [emailDetails, setEmailDetails] = useState(null);
  const columnHelper = createColumnHelper();
  const pageSize = 20;

  const deleteTasks = async (taskSids) => {
    try {
      const res = await deleteEmailTasks(taskSids);
      if (!res.isAllTaskDeleted) {
        setMessage(`Error: ${res.tasksNotDeletedCount} emails were not deleted`);
      }
      setMessage(res.message);
      return res.deletedTaskSids;
    } catch (error) {
      setMessage(`Error: ${error.response?.data || error.message}`);
      return false;
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const deletedTaskSids = await deleteTasks(selectedRowIds);
    if (deletedTaskSids) {
      deleteData(deletedTaskSids);
    }
    setData(data?.filter(x => !selectedRowIds.includes(x.taskSid)))
    handleDeleteModalClose();
  }
  const getSelectedRows = (selectedRows) => {
    setSelectedRows(selectedRows);
    setSelectedRowIds(selectedRows.map(x => x.taskSid));
  }

  const getAgentsData = async () => {
    try {
      //let token = authState.accessToken;
      const res = await getAgents()
      if (res) {
        let temp = [];
        res?.filter(x => {
          if (!temp?.find(y => y.fullName === x.fullName)) {
            temp.push(x)
          }
        })
        setAgent(temp);
      }
    } catch (error) {
      setMessage("Error: While fetching agents")
    }
  }

  const getEmailTasksData = async (prevData, Page, PageToken) => {
    setGridLoading(true);
    var args = {};
    if (Page >= 1) {
      args = { Page, PageToken }
    }
    const res = await getEmailTasks(args);
    if (res?.data) {
      const temp = res?.data.map((x, i) => {
        if (x.age) {
          const duration = moment.duration(x.age, 'seconds');
          x.age = Math.floor(duration.asHours()).toString().padStart(2, '0') + ':' + duration.minutes().toString().padStart(2, '0');
        }
        return x;
      })
      const newData = [...prevData, ...temp];
      setData(newData);
      saveData(newData);
      localStorage.setItem('lastUpdated', JSON.stringify(moment()))
      if (res?.PageToken != null) {
        setTimeout(async () => {
          await getEmailTasksData(newData, parseInt(res?.Page), res?.PageToken);
        }, 200);
      } else {
        setGridLoading(false);
      }
    } else {
      setData([]);
      clearData();
      setMessage(res?.message);
      setGridLoading(false);
    }
  }

  const handleRefresh = async () => {
    await clearData();
    await getEmailTasksData([], 0, null);
    localStorage.setItem('lastUpdated', JSON.stringify(moment()))
  };

  const getEmailDetailsData = async (channelSid) => {
    try {
      const res = await getEmailDetails({ channelSid });
      setEmailDetails(res?.email ?? null);
    } catch (error) {
      setEmailDetails("NONE");
    }
  }

  const handleResetClick = () => {
    setResetData(true);
  }

  const handleResetTable = () => {
    const temp = [
      {
        target: {
          name: 'customerEmail',
          value: ''
        }
      },
      {
        target: {
          name: 'brand',
          value: ''
        }
      },
      {
        target: {
          name: 'age',
          value: []
        }
      },
      {
        target: {
          name: 'agent',
          value: {
            fullName: '',
            workerSid: ''
          }
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

  const assignTaskPriority = async (tasks) => {
    try {
      const res = await setEmailPriority(tasks);
      if (!res.isAllTaskPrioritySet) {
        setMessage(`Error: Could not set priority for ${res.tasksWithPriorityNotSetCount} emails`);
      }
      setMessage(res.message);
      return res.tasksWithPrioritySet;
    } catch (error) {
      setMessage(`Error: ${error.response?.data || error.message}`);
      return false;
    }
  };

  const assignAgent = async (tasks) => {
    try {
      const res = await assignEmailTaskToAgent(tasks);
      if (!res.isAllTasksAssigned) {
        setMessage(`Error: Failed to assign ${res.tasksNotAssignedCount} emails to agent`);
        return { success: false, message: res.message };
      }
      setMessage(res.message);
      return { success: true, data: res.assignedTasks };
    } catch (error) {
      setMessage(`Error: ${error.response?.data || error.message}`);
      return { success: false, message: error.response?.data || error.message };
    }
  };

  const handlePriorityAndAssignment = async (value) => {
    let temp = JSON.parse(JSON.stringify(data));
    let selected = JSON.parse(JSON.stringify(selectedRows));
    let error = 0;
    if (columnToUpdate === 'priority') {
      temp = temp?.filter(x => {
        if (selectedRowIds.includes(x.taskSid)) {
          x.priority = value
        }
        return x;
      });
      selected = selected?.filter(x => {
        if (selectedRowIds.includes(x.taskSid)) {
          x.priority = value
        }
        return x;
      })
      const assignedTaskPriorityResult = await assignTaskPriority(selected);
      if (assignedTaskPriorityResult) {
        updateData(assignedTaskPriorityResult);
      } else {
        error++;
      }
    }
    if (columnToUpdate === 'agent') {
      const agentDetail = agent.find(item => item.fullName === value);
      temp = temp?.filter(x => {
        if (selectedRowIds.includes(x.taskSid)) {
          x.agent = value
        }
        return x;
      })
      selected = selected?.filter(x => {
        if (selectedRowIds.includes(x.taskSid)) {
          x.agent = value
        }
        return x;
      })
      if (agentDetail && agentDetail.workerSid) {
        selected = selected.map(item => ({
          ...item,
          agentSid: agentDetail.workerSid
        }));
        const assignedAgentsResult = await assignAgent(selected);
        if (assignedAgentsResult.success) {
          updateData(assignedAgentsResult.data);
        }
        else {
          error++;
          console.error("Error in assigning agents:", assignedAgentsResult.message);
        }
      }
    }
    if (error === 0) {
      setData(temp);
    } else {
      setOpenSidebar(false);
    }
    setSideBarLoading(false);
  }

  const environmentName = (origin) => {
    if (origin.includes('localhost')) {
      return '{Local}';
    } else if (origin.includes('ccc-admin-dev')) {
      return '{Dev}';
    } else if (origin.includes('ccc-admin-qa')) {
      return '{QA}';
    } else if (origin.includes('ccc-admin-preprod')) {
      return '{Pre-Prod}';
    } else {
      return '';
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("checkbox", {
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
        cell: ({ row, getValue }) => {
          return (
            <div>
              {row.original.status.toLowerCase() === "pending" &&
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
      }),
      columnHelper.accessor("brand", {
        header: () => "Brand",
        cell: (row) => (
          <CustomAccordian
            onClick={(expanded) => {
              setEmailDetails(null);
              if (expanded) {
                getEmailDetailsData(row?.row?.original?.channelSid);
                setRowId(row?.row?.id)
              } else {
                setRowId(null);
              }
            }}
            title={row?.row?.original?.brand}
          />
        )
      }),
      columnHelper.accessor("priority", {
        header: () => "Priority",
        filterFn: 'isWithinRange',
        cell: (row) => <div>{row?.row?.original?.priority}</div>,
      }),
      columnHelper.accessor("agent", {
        header: () => "Agent",

      }),
      columnHelper.accessor("age", {
        header: () => "Age",
        filterFn: 'filterAge',
        cell: (row) => <div>{row?.row?.original?.age}</div>
      }),
      columnHelper.accessor("status", {
        header: () => "Status",
      }),
      columnHelper.accessor("taskSid", {
        header: () => "Task Sid",
      }),
      columnHelper.accessor("customerEmail", {
        header: () => "Customer Email",
      }),
    ],
    []
  );

  useEffect(() => {
    if (authState != null || process.env.NODE_ENV === "development") {
      (async () => {
        const res = await getData();
        if (res.length === 0) {
          await getEmailTasksData([], 0, null);
        } else {
          setData(res);
          localStorage.setItem('lastUpdated', JSON.stringify(moment()))
        }
        await getAgentsData(); //get agent data first
      })()
    }
  }, [authState])

  useEffect(() => {
    if (selectedRows.length === 0) {
      setOpenSidebar(false);
    }
  }, [selectedRows])

  return (
    <>
      <TopBar navbarTitle={
        <>
          NM Twilio Super Admin
          <span style={{ color: 'yellow' }}>{` ${environmentName(window.location.origin)}`}</span>
        </>
      } />

      <Container maxWidth={"100%"} sx={{ position: "relative" }}>
        <Header headerTitle={"Customer Email Queue"} handleReset={handleResetClick} />
        <Grid container spacing={1} paddingBottom={1} paddingTop={0}>
          <CustomInput
            title={'Customer email'}
            name='customerEmail'
            value={formData["customerEmail"]}
            onChange={setFormData}
          />
          <CustomSelect
            title={"Brand"}
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
          <CustomSelect
            title={"Priority"}
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
                freeSolo
                value={formData['agent'] ?? ''}
                name="agent"
                id="combo-box-demo"
                onChange={(e, value) => {
                  setFormData({
                    ...formData,
                    target: {
                      name: 'agent',
                      value: value ?? { fullName: '', workerSid: '' }
                    }
                  })
                }}
                options={agent}
                className={"custom-select"}
                getOptionLabel={(option) => option.fullName}
                sx={{
                  height: 36, fontSize: 14, borderColor: "#EEEEEE", color: "#5c5c5c", ":hover": {
                    borderColor: "#EEEEEE",
                    color: "#333333",
                  }
                }}
                popupIcon={<KeyboardArrowDown />}
                renderInput={(params) => <TextField {...params} placeholder="Select one" />}
              />
            </FormControl>
          </Grid>
          <CustomSelect
            title={"Age"}
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
              { text: "Less than 1 hour", value: "Less than 1 hour" },
              { text: "Between 1-23 hours", value: "Between 1-23 hours" },
              { text: "Between 24-48 hours", value: "Between 24-48 hours" },
              { text: "Between 49-71 hours", value: "Between 49-71 hours" },
              { text: "Greater than 72 hours", value: "Greater than 72 hours" }
            ]}
          />
          <CustomSelect
            title={"Status"}
            name='status'
            value={formData["status"]}
            onChange={setFormData}
            id="status"
            items={[
              { text: "Select one", value: "" },
              { text: "Pending", value: "pending" },
              { text: "Reserved", value: "reserved" },
              { text: "Wrapping", value: "wrapping" }
            ]}
          />

          <Actions
            disabled={selectedRows?.length === 0}
            gridLoading={gridLoading}
            handleDeleteModalOpen={handleDeleteModalOpen}
            setColumnToUpdate={(e) => { setColumnToUpdate(e); setOpenSidebar(true); }}
            onRefresh={handleRefresh}
          />
        </Grid>

        <Box sx={{ position: "absolute", top: "20px", width: "100%" }}>
          <SnackAlert message={message} setMessage={setMessage} />
        </Box>
        <Box>
          <DeleteModal
            text={`Are you sure you want to delete ${selectedRows?.length} email${selectedRows?.length > 1 ? 's' : ''}?`}
            handleDeleteModalOk={() => { handleDelete(); }}
            handleDeleteModalClose={() => { handleDeleteModalClose() }}
            openDeleteModal={openDeleteModal}
            deleteLoading={deleteLoading}
          />
        </Box>
        <SideBar
          handlePriorityAndAssignment={handlePriorityAndAssignment}
          columnToUpdate={columnToUpdate}
          setColumnToUpdate={setColumnToUpdate}
          openSideBar={openSideBar}
          setOpenSidebar={setOpenSidebar}
          sideBarLoading={sideBarLoading}
          setSideBarLoading={setSideBarLoading}
          options={agent}
        />

        <DataTable
          rowId={rowId}
          getSelectedRows={getSelectedRows}
          emailDetails={emailDetails}
          resetData={resetData}
          handleReset={handleResetTable}
          columns={columns}
          data={data}
          formData={formData}
        />
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
