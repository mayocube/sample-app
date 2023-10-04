import { Alert, } from '@mui/material'
import React from 'react'
import SuccessLogo from './../../src/assets/success.svg'
import ErrorLogo from './../../src/assets/error.svg'
const SnackAlert = ({ onClose = () => { }, open, isSuccess, message }) => {
    return (
        open && <Alert onClose={onClose} icon={<Logo isSuccess={isSuccess} />} variant="filled" sx={{
            backgroundColor: "#EDFDF3 ", display: 'flex',
            padding: '1.25rem',
            alignItems: 'flex-start'
            , flex: '1 0 0',
            maxWidth: "fit-content",
            margin: "0 auto",
            color: isSuccess ? "#0B602D" : "#C72323",
            border: isSuccess ? "solid 1px #7BEAA5" : "solid 1px #F58A8A",
            boxShadow: "0px 16px 24px 4px rgba(18, 28, 45, 0.20)",
        }}>
            {message ?? "This is a success Snackbar  — check it out!"}
        </Alert >
    )
}
export const Logo = ({ isSuccess }) => {
    return (
        <img src={isSuccess ? SuccessLogo : ErrorLogo} />
    )
}
export default SnackAlert