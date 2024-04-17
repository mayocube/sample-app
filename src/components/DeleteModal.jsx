import { Box, Button, CircularProgress, Typography } from '@mui/material'
import React from 'react'
import Modal from "@mui/material/Modal"
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  boxShadow: 24,
  padding: "38px 60px",
  borderRadius: "10px"
};
const DeleteModal = ({ openDeleteModal, deleteLoading = false, handleDeleteModalClose, handleDeleteModalOk, text = '' }) => {
  return (
    <div>
      <Modal
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "18px", lineHeight: "21px", textAlign: "center", fontWeight: "700", color: "#0F1621" }} id="modal-modal-title" variant="h6" component="h2">
            {text}
          </Typography>
          <Box className="deleteBtnContainer" sx={{
            marginTop: "80px", display: "flex", justifyContent: "center"
          }}>

            <Button disabled={deleteLoading} onClick={handleDeleteModalClose} sx={{ width: "100px", height: "45px" }} color="dark" variant="outlined">Cancel</Button>
            <Button disabled={deleteLoading} onClick={handleDeleteModalOk} sx={{ marginLeft: "40px", width: "100px", height: "45px", backgroundColor: "#D61F1F" }} variant="contained">
              {
                deleteLoading ?
                  <CircularProgress sx={{ width: 25, height: 25, color: 'white' }} />
                  :
                  "Delete"
              }

            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default DeleteModal