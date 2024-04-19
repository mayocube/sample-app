import React, { useEffect, useReducer, useState } from 'react'
import TopBar from '../components/TopBar'
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material'
import CustomInput from '../components/CustomInput'
import CustomSelect from '../components/CustomSelect'
import { formReducer } from '../utils/RequestHandler'
import CustomTimePicker from '../components/CustomTimePicker'
import moment from 'moment-timezone';
import { useHistory } from 'react-router-dom'
import SnackAlert from '../components/SnackAlert'
import { createUpdateHoops, getHoopsById } from '../apiService/EndPoints'

const HoopsEdit = () => {
    const history = useHistory();
    const timezones = moment.tz.names();
    const id = history.location.state?.id;

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {
        name: '',
        description: '',
        timezone: '',
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
            let temp = {
                ...formData,
                schedule: JSON.stringify(formData.schedule)
            }
            if (id) {
                temp.id = id;
            } else {
                temp.id = Math.random() * 9999;
            }
            const res = await createUpdateHoops(temp);
            if (res?.status === 'success') {
                setMessage(res?.message ?? `HOOP ${id ? 'updated' : 'created'} successfully.`);
                setLoading(false);
                history.goBack();
            }
        } catch (e) {
            setMessage(`Error occured please try again!`);
            setLoading(false);
            console.log('catch', e)
        }
    }

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    const res = await getHoopsById(id);
                    console.log('first', res)
                    if (res?.status === 'success') {
                        let data = res?.data[0];
                        setFormData({
                            name: data?.name,
                            description: data?.description,
                            timezone: data?.timezone,
                            schedule: data?.schedule
                        })
                    }

                } catch (e) {
                    setMessage(`Error occured while fetching hoops details!`);
                    console.log('catch', e)
                }
            })();
        }
    }, [id])

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
                            HOOPs
                        </Typography>
                        <Button
                            disabled={loading}
                            className='headerBtn'
                            onClick={handleAddUpdate}
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 30, paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1 }}
                        >
                            {loading ? <CircularProgress sx={{ width: '30px !important', height: '30px !important' }} /> : (id ? 'Update' : 'Add')}
                        </Button>
                    </Box>
                    <CustomInput
                        title={'Name'}
                        name={'name'}
                        value={formData["name"]}
                        onChange={setFormData}
                    />
                    <CustomInput
                        title={'Description'}
                        name={'description'}
                        value={formData["description"]}
                        onChange={setFormData}
                    />
                    <CustomSelect
                        title='Timezone'
                        name='timezone'
                        value={formData["timezone"]}
                        onChange={setFormData}
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
            <Box sx={{ position: "absolute", top: "20px", width: "100%" }}>
                <SnackAlert message={message} setMessage={setMessage} />
            </Box>
        </>
    )
}

export default HoopsEdit