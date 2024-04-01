import { Alert, } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SuccessLogo from './../../src/assets/success.svg'
import ErrorLogo from './../../src/assets/error.svg'

const SnackAlert = ({ message = "", setMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  let timeout = null;

  useEffect(() => {
    if (message !== "") {
      setIsOpen(true);
      const hasError = message.includes("Error");
      setIsSuccess(!hasError);
      
      // Only auto-close for success messages
      if (!hasError) {
        timeout = setTimeout(() => {
          setIsOpen(false);
          setMessage('');
        }, 10000);
      }
    } else {
      if(timeout != null){
        clearTimeout(timeout);
      }
      setIsOpen(false);
      setMessage('');
    }
  }, [message]);

  return (
    isOpen &&
    <Alert
      onClose={() => { setMessage(''); }}
      icon={<img src={isSuccess ? SuccessLogo : ErrorLogo} />}
      variant="filled"
      sx={{
        backgroundColor: "#EDFDF3 ", display: 'flex',
        padding: '1.25rem',
        alignItems: 'flex-start',
        flex: '1 0 0',
        maxWidth: "fit-content",
        margin: "0 auto",
        color: isSuccess ? "#0B602D" : "#C72323",
        border: isSuccess ? "solid 1px #7BEAA5" : "solid 1px #F58A8A",
        boxShadow: "0px 16px 24px 4px rgba(18, 28, 45, 0.20)",
      }}
    >
      {message ?? ""}
    </Alert>
  )
}
export default SnackAlert