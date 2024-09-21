// ** MUI Imports
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { IconBellCheck } from "@tabler/icons-react";

const DialogUpdateNotification = ({open, handldeDialogClose, updateNotification, selectedNotification}) => {
  const [notification, setNotification] = useState(selectedNotification?.content?selectedNotification?.content : "" );
  return (
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={handldeDialogClose}
      >
    <Card>
      <CardContent sx={{ textAlign: "center", "& svg": { mb: 2 } }}>
        <IconBellCheck fontSize='2rem' />
        <Typography variant='h6' sx={{ mb: 4 }}>
          Edit Notification
        </Typography>
        <Typography sx={{ mb: 3 }}>Use this modal to modify the existing course&prime;s notifications.</Typography>
      </CardContent>

        <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: "relative" }}>
          <Grid container spacing={6}>
              <TextField 
                onChange={e => {
                  setNotification(e.target.value);
                }}
                fullWidth
                multiline
                defaultValue={selectedNotification?.content} />
        </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: "center" }}>
          <Button variant='contained' sx={{ mr: 2 }} onClick={()=>updateNotification(selectedNotification, notification)}>
            Submit
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handldeDialogClose()}>
            Discard
          </Button>
        </DialogActions>
    </Card>
      </Dialog>
  );
};

export default DialogUpdateNotification;
