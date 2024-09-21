// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { IconAlertCircleFilled } from "@tabler/icons-react";

const DeleteDocumentDialog = ({open, handldeDialogClose, deleteDocument}) => {
  return (
    <>
      <Dialog fullWidth open={open} onClose={handldeDialogClose} sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 512 } }}>
        <DialogContent>
          <Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",  gap: 2, textAlign: "center", "& svg": { color: "warning.main" } }}>
              <IconAlertCircleFilled fontSize='5.5rem' />
              <Typography variant='h4' sx={{ color: "text.secondary" }}>
                Are you sure?
              </Typography>
              <Typography>You won&apos;t be able to revert document!</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingTop: 4, paddingBottom: 8 }}>
          <Button color= 'error' variant='contained' onClick={deleteDocument}>
            Yes, Delete this document!
          </Button>
          <Button variant='outlined' color='secondary' onClick={()=> handldeDialogClose()}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteDocumentDialog;
