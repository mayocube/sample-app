import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, Grid } from '@mui/material'
import TopBar from './TopBar';
import Header from './Header';
import { getHoops } from '../apiService/EndPoints';
import DataTable from './DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import CustomInput from './CustomInput';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import DeleteModal from './DeleteModal';

const HOOPs = () => {

  const [name, setName] = useState('');
  const [resetData, setResetData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState([]);
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

  const getSelectedRows = (selectedRows) => {
    setSelectedRowIds(selectedRows.map(x => x.taskSid));
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
          )
        },
      }),
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
        cell: () => {
          return (
            <>
              <Button
                className='actionBtn'
                onClick={() => { }}
                startIcon={<PermIdentityOutlinedIcon className='actionIcon' fontSize="large" />}
              >
                Edit
              </Button>
            </>
          )
        },
      }),
    ],
    []
  );

  const [data, setData] = useState([]);
  const getHoopsData = async () => {
    try {
      //let token = authState.accessToken;
      const res = await getHoops()
      if (res) {
        setData(res);
      }
    } catch (error) {
      setMessage("Error: While fetching hoops")
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true);
    // const deletedTaskSids = await deleteOperation(selectedRowIds);
    // if (deletedTaskSids) {
    //   deleteData(deletedTaskSids);
    // }
    setData(data?.filter(x => !selectedRowIds.includes(x.id)))
    setDeleteLoading(false);
    setShowModal(false);
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
            disabled={selectedRowIds?.length === 0}
            className='actionBtn'
            onClick={() => setShowModal(true)}
            startIcon={<DeleteOutlinedIcon className='actionIcon' fontSize="large" />}
          >
            Delete
          </Button>
          <Button
            className='actionBtn'
            onClick={() => { }}
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
          getSelectedRows={getSelectedRows}
        />
      </Container>
      <DeleteModal
        text={`Are you sure you want to delete ${selectedRowIds?.length} hoops?`}
        handleDeleteModalOk={handleDelete}
        handleDeleteModalClose={() => setShowModal(false)}
        openDeleteModal={showModal}
        deleteLoading={deleteLoading}
      />
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

export default HOOPs
