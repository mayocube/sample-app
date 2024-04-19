import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, Grid } from '@mui/material'
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

const HOOPs = () => {

  const history = useHistory();

  const [name, setName] = useState('');
  const [resetData, setResetData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedRowId, setSelectedRowId] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
                onClick={() => history.push(`/hoops/add-update`, { id: row.original.id })}
                startIcon={<EditNoteIcon className='actionIcon' fontSize="large" />}
              >
                Edit
              </Button>
              <Button
                className='actionBtn'
                onClick={() => { setSelectedRowId(row.original.id); setShowModal(true) }}
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

  const [data, setData] = useState([]);
  const getHoopsData = async () => {
    try {
      const res = await getHoops()
      if (res?.status === 'success') {
        setData(res?.data ?? []);
      }
    } catch (error) {
      setMessage("Error: While fetching hoops")
    }
  }

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await deleteHoop(selectedRowId);
      if (res?.status === 'success') {
        getHoopsData();
        setDeleteLoading(false);
        setShowModal(false);
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
        <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={1} my={1}>
          <Button
            className='actionBtn'
            onClick={() => history.push(`/hoops/add-update`)}
            startIcon={<PermIdentityOutlinedIcon className='actionIcon' fontSize="large" />}
          >
            Add
          </Button>
        </Box>
        <DataTable
          columns={columns}
          resetData={resetData}
          handleReset={handleReset}
          data={data}
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
    </>
  )
};

export default HOOPs
