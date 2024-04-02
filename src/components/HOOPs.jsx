import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { Autocomplete, Box, Container, FormControl, Grid, TextField, Typography } from '@mui/material'
import { formReducer } from '../utils/RequestHandler';
import { clearData, deleteData, getData, saveData, updateData } from '../utils/indexedDBService';
import TopBar from './TopBar';
import Header from './Header';
import CustomInput from './CustomInput';
import CustomSelect from './CustomSelect';
import Actions from './Actions';
import { useOktaAuth } from '@okta/okta-react';
import { setEmailPriority, deleteEmailTasks, getAgents, getEmailDetails, getEmailTasks, assignEmailTaskToAgent, getHoops } from '../apiService/EndPoints';
import DataTable from './DataTable';
import SnackAlert from './SnackAlert';
import SideBar from './SideBar';
import CustomAccordian from './CustomAccordian';
import DeleteModal from './DeleteModal';
import moment from 'moment/moment';
import { createColumnHelper } from '@tanstack/react-table';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

const HOOPs = () => {

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

  useEffect(() => {
    getHoopsData();
  }, [])

  return (
    <>
      <TopBar navbarTitle={ <> NM Twilio Super Admin <span style={{ color: 'yellow' }}>{` ${environmentName(window.location.origin)}`}</span> </> } />
      <Container maxWidth={"100%"} sx={{ position: "relative" }}>
        <Header headerTitle={"Hours of Operations"} />
        <DataTable
          columns={columns}
          data={data}
          formData={{}}
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

export default HOOPs
