import React, { useEffect, useReducer, useState } from 'react'
import TopBar from '../components/TopBar'
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import CustomInput from '../components/CustomInput'
import CustomSelect from '../components/CustomSelect'
import { formReducer } from '../utils/RequestHandler'
import CustomTimePicker from '../components/CustomTimePicker'
import { useHistory } from 'react-router-dom'
import SnackAlert from '../components/SnackAlert'
import { createUpdateHoops, getHoopsById } from '../apiService/EndPoints'
import { timezones } from '../utils'
import moment from 'moment'

const HoopsEdit = () => {
  const history = useHistory();
  const hoopsId = history.location.state?.name;

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, {
    name: '',
    description: '',
    timezone: '',
    closedHOOPFileName: '',
    schedule: {
      "Monday": { open: null, close: null },
      "Tuesday": { open: null, close: null },
      "Wednesday": { open: null, close: null },
      "Thursday": { open: null, close: null },
      "Friday": { open: null, close: null },
      "Saturday": { open: null, close: null },
      "Sunday": { open: null, close: null },
    }
  });

  const handleAddUpdate = async () => {
    if (!formData.name) {
      setMessage('Error: Name is required!');
      return;
    }
    if (!formData.description) {
      setMessage('Error: Description is required!');
      return;
    }
    if (!formData.timezone) {
      setMessage('Error: Timezone is required!');
      return;
    }
    for (const x of Object.keys(formData.schedule)) {
      let temp = formData.schedule[x];
      if ((temp.open && !temp.close) || (!temp.open && temp.close)) {
        setMessage(`Error: Please enter valid time for ${x}!`);
        return;
      }

      // Check if both times are provided
      if (temp.open && temp.close) {
        const openTime = moment(temp.open, 'HH:mm');
        const closeTime = moment(temp.close, 'HH:mm');

        // Check if Start Time is 12:00 PM
        if (openTime.format('HH:mm') === '12:00') {
          setMessage(`Error: Start Time cannot be 12:00 PM for ${x}!`);
          return;
        }

        // Check if End Time is greater than 11:59 PM
        if (closeTime.format('HH:mm') > '23:59') {
          setMessage(`Error: End Time cannot be greater than 11:59 PM for ${x}!`);
          return;
        }

        // Check if End Time is greater than Start Time
        if (!closeTime.isAfter(openTime)) {
          setMessage(`Error: End Time must be greater than Start Time for ${x}!`);
          return;
        }
      }

      if (Object.keys(formData.schedule).filter(x => formData.schedule[x].open || formData.schedule[x].close)?.length === 0) {
        setMessage(`Error: Please select time for atleast one day!`);
        return;
      }
    }
    setLoading(true);

    try {
      const res = await createUpdateHoops(formData, hoopsId);
      if (res?.status === 'Success') {
        setMessage(res?.message ?? `HOOP ${hoopsId ? 'updated' : 'created'} successfully.`);
        setLoading(false);
        setTimeout(() => {
          history.goBack();
        }, 1500);
      }
    } catch (e) {
      setMessage(`Error occured please try again!`);
      setLoading(false);
      console.log('catch', e)
    }
  }

  useEffect(() => {
    if (hoopsId) {
      (async () => {
        try {
          setLoading(true);
          const res = await getHoopsById(hoopsId);
          if (res?.status === 'Success') {
            let data = res?.data;
            setFormData({
              name: data?.name,
              description: data?.description,
              timezone: data?.timezone,
              schedule: data?.schedule,
              closedHOOPFileName: data?.closedHOOPFileName,
            })
            setLoading(false);
          }

        } catch (e) {
          setMessage(`Error occured while fetching hoops details!`);
          setLoading(false);
          console.log('catch', e)
        }
      })();
    }
  }, [hoopsId])

  return (
    <>
      <div className='hoops_edit'>
        <TopBar navbarTitle={'NEIMAN MARCUS Twilio Super Admin Dev'} />
        {loading &&
          <Box sx={{ opacity: 0.8, backgroundColor: '#fff' }} zIndex={99} justifyContent={"center"} alignItems={"center"} position={"fixed"} top={0} bottom={0} left={0} right={0} padding={20} width={'100%'} textAlign={"center"}>
            <CircularProgress sx={{ width: '50px !important', height: '50px !important' }} />
          </Box>
        }
        <Box mx='20px'>
          <Box
            gap={'20px'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Typography className='heading'>
              Hoops
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                className='headerBtn'
                onClick={() => { history.goBack(); }}
                variant="contained"
                color="error"
                sx={{ borderRadius: 30, paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1 }}
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                className='headerBtn'
                onClick={handleAddUpdate}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 30, paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1 }}
              >
                {loading ? <CircularProgress sx={{ width: '30px !important', height: '30px !important' }} /> : (hoopsId ? 'Update' : 'Add')}
              </Button>

            </Box>
          </Box>
          <Grid container spacing={2} paddingBottom={1} paddingTop={0}>
            <CustomInput
              title={'Name'}
              name={'name'}
              width={6}
              value={formData["name"]}
              onChange={setFormData}
              required={true}
            />
            <CustomInput
              title={'Description'}
              name={'description'}
              width={6}
              value={formData["description"]}
              onChange={setFormData}
              required={true}
            />
            <CustomSelect
              title='Timezone'
              name='timezone'
              width={6}
              value={formData["timezone"]}
              onChange={setFormData}
              required={true}
              MenuStyle={{
                maxHeight: '400px !important'
              }}
              items={
                timezones?.map((tz) => ({
                  value: tz,
                  text: tz,
                }))
              }
            />
            <CustomInput
              width={6}
              title={'Closed HOOP Filename'}
              name={'closedHOOPFileName'}
              value={formData["closedHOOPFileName"]}
              onChange={setFormData}
              required={false}
            />
          </Grid>
        </Box>
        <Box className='time_table'>
          <Box className='header_row'>
            <Typography className='header_text'>
              Day
            </Typography>
            <Typography className='header_text'>
              Start
            </Typography>
            <Typography className='header_text'>
              End
            </Typography>
          </Box>
          <Box px={'10px'} width={'100%'}>
            {[...new Array(7)].map((_, i) => {
              const val = Object.keys(formData.schedule)[i];
              return (
                <Box className='body_row' key={i}>
                  <Typography className='body_text'>
                    <div className='custom-textarea'>{val}</div>
                  </Typography>
                  <Typography className='body_text'>
                    <CustomTimePicker
                      value={formData.schedule[val].open}
                      onChange={(e) => {
                        const startTime = e ? (e.isValid() ? e.format('HH:mm') : null) : null;
                        let item = {
                          target: {
                            name: 'schedule',
                            value: { ...formData.schedule, [val]: { ...formData.schedule[val], open: startTime } }
                          }
                        }
                        setFormData(item);
                      }}
                    />
                  </Typography>
                  <Typography className='body_text'>
                    <CustomTimePicker
                      value={formData.schedule[val].close}
                      onChange={(e) => {
                        const closeTime = e ? (e.isValid() ? e.format('HH:mm') : null) : null;
                        let item = {
                          target: {
                            name: 'schedule',
                            value: { ...formData.schedule, [val]: { ...formData.schedule[val], close: closeTime } }
                          }
                        }
                        setFormData(item);
                      }}
                    />
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Box>
      </div>
      <SnackAlert message={message} setMessage={setMessage} />
    </>
  )
}

export default HoopsEdit