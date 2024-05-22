import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, CircularProgress, Container, Grid, Typography } from '@mui/material'
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import { deleteHoop, getHoops } from '../apiService/EndPoints';
import DataTable from '../components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import CustomInput from '../components/CustomInput';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteModal from '../components/DeleteModal';
import { useHistory } from 'react-router-dom';
import SnackAlert from '../components/SnackAlert';
import CachedIcon from '@mui/icons-material/Cached';
import moment from 'moment';

const Hoops = () => {

  const history = useHistory();
  const [fetchTime, setFetchTime] = useState(null);
  const [lastUpdatedText, setLastUpdatedText] = useState(moment().fromNow());

  const [name, setName] = useState('');
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [resetData, setResetData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedRowId, setSelectedRowId] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onRefresh = () => { 
     getHoopsData();
}
  const updateLastUpdatedText = () => {
    setLastUpdatedText(moment(fetchTime).fromNow());
};

useEffect(() => {
    updateLastUpdatedText();
    const intervalId = setInterval(updateLastUpdatedText, 30000);
    return () => clearInterval(intervalId);
}, [fetchTime]);

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

  const handleResetClick = () => {
    setResetData(true);
  }

  const handleReset = () => {
    setName('');
    setDescription('');
    setResetData(false)
  }

  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => "Name",
      }),
      columnHelper.accessor("description", {
        header: () => "Description",
      }),
      columnHelper.accessor("timezone", {
        header: () => "Timezone",
      }),
      columnHelper.accessor("closedHOOPFileName", {
        header: () => "Closed Hoop File Name",
      }),
      columnHelper.accessor("action", {
        header: () => "",
        cell: ({ row }) => {
          return (
            <Box
              sx={{
                gap: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Button
                className='actionBtn'
                onClick={() => history.push(`/hoop/${row.original.name}`, { name: row.original.name } )}
                startIcon={<EditNoteIcon className='actionIcon' fontSize="large" />}
              >
                Edit
              </Button>
              <Button
                className='actionBtn'
                onClick={() => { setSelectedRowId(row.original.name); setShowModal(true) }}
                startIcon={<DeleteOutlinedIcon className='actionIcon' fontSize="large" />}
              >
                Delete
              </Button>
            </Box>
          )
        },
      }),
    ],
    []
  );

  const getHoopsData = async () => {
    const date = new Date();

    try {
      setDataLoading(true);
      const res = await getHoops()
      if (res?.status === 'Success') {
        setData(res?.data ?? []);
      
      }
      setFetchTime(date)
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);
      setMessage("Error: While fetching hoops")
    }
  }

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await deleteHoop(selectedRowId);
      if (res?.status === 'Success') {
        getHoopsData();
        setDeleteLoading(false);
        setShowModal(false);
        setMessage(res?.message);
      }
    } catch (error) {
      setDeleteLoading(false);
      setMessage("Error: An error has occured please try again!");
    }
  }

  useEffect(() => {
    getHoopsData();
  }, [])

  return (
    <>
      <TopBar navbarTitle={<> NM Twilio Super Admin <span style={{ color: 'yellow' }}>{` ${environmentName(window.location.origin)}`}</span> </>} />
      <Container maxWidth={"100%"} sx={{ position: "relative" }}>
        <Header
          headerTitle={"Hours of Operations"}
          handleReset={handleResetClick}
        />
        <Grid container spacing={1}>
          <CustomInput
            width={4}
            title={'Name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CustomInput
            width={4}
            title={'Description'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} lg={12} marginTop={1} display={"flex"} alignItems={"center"} justifyContent={"space-between"} paddingBottom={0} marginBottom={0} paddingLeft={0} paddingRight={0}>
        <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={1} my={1}>
          <Button
            className='actionBtn'
            onClick={() => history.push(`/hoop`)}
            startIcon={<PermIdentityOutlinedIcon className='actionIcon' fontSize="large" />}
          >
            Add
          </Button>
        </Box>
        <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={2}>
                        <Typography sx={{ fontFamily: "Inter", fontSize: "14px", color: "#394762", lineHeight: "21px", fontWeight: "400" }} variant="filterText" marginBottom={0} gutterBottom>Last updated {lastUpdatedText}</Typography>
                        <Button
                            color='default'
                            sx={{ color: "#606B85" }}
                            className='actionBtn refresh'
                            startIcon={dataLoading ? null : <CachedIcon className='actionIcon' fontSize="large" />}
                            onClick={onRefresh}
                            disabled={dataLoading}
                        >
                            {dataLoading ? <CircularProgress size={20} /> : "Refresh"}
                        </Button>
                    </Box>
                    </Grid>
        <DataTable
          columns={columns}
          resetData={resetData}
          handleReset={handleReset}
          data={data}
          isLoading={dataLoading}
          formData={{ name, description }}
        />
      </Container>
      <DeleteModal
        text={`Are you sure you want to delete this hoop?`}
        handleDeleteModalOk={handleDelete}
        handleDeleteModalClose={() => setShowModal(false)}
        openDeleteModal={showModal}
        deleteLoading={deleteLoading}
      />
      <SnackAlert message={message} setMessage={setMessage} />
    </>
  )
};

export default Hoops
