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
          const res = await getHoopsById(hoopsId);
          console.log('first', res)
          if (res?.status === 'Success') {
            let data = res?.data;
            setFormData({
              name: data?.name,
              description: data?.description,
              timezone: data?.timezone,
              schedule: data?.schedule,
              closedHOOPFileName: data?.closedHOOPFileName,
            })
          }

        } catch (e) {
          setMessage(`Error occured while fetching hoops details!`);
          console.log('catch', e)
        }
      })();
    }
  }, [hoopsId])

  return (
    <>
      <div className='hoops_edit'>
        <TopBar navbarTitle={'NEIMAN MARCUS Twilio Super Admin Dev'} />
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
                    <CustomSelect
                      name='day'
                      value={val}
                      onChange={() => { }}
                      items={[
                        { text: "Monday", value: "Monday" },
                        { text: "Tuesday", value: "Tuesday" },
                        { text: "Wednesday", value: "Wednesday" },
                        { text: "Thursday", value: "Thursday" },
                        { text: "Friday", value: "Friday" },
                        { text: "Saturday", value: "Saturday" },
                        { text: "Sunday", value: "Sunday" },
                      ]}
                    />
                  </Typography>
                  <Typography className='body_text'>
                    <CustomTimePicker
                      value={formData.schedule[val].open}
                      onChange={(e) => {
                        let item = {
                          target: {
                            name: 'schedule',
                            value: {
                              ...formData.schedule,
                              [val]: {
                                ...formData.schedule[val],
                                open: e ? (e.isValid() ? e.format('HH:mm') : null) : null
                              }
                            }
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
                        let item = {
                          target: {
                            name: 'schedule',
                            value: {
                              ...formData.schedule,
                              [val]: {
                                ...formData.schedule[val],
                                close: e ? (e.isValid() ? e.format('HH:mm') : null) : null
                              }
                            }
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