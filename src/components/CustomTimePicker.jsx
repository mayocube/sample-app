import React from 'react'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { TextField } from '@mui/material';

const CustomTimePicker = ({ label = '', name = '', value = null, onChange = () => { } }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker
                label={label}
                name={name}
                value={value ? moment(value, 'HH:mm') : null}
                onChange={onChange}
                className='custom_timepicker'
            />
        </LocalizationProvider>
    )
}

export default CustomTimePicker