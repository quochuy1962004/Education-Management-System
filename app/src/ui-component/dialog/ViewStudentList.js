// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { userIcon } from "ui-component/icons";

const StudentList = ({studentClass, open, handleDialogClose}) => {
  const onClose = () => handleDialogClose();
    
  return (
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='user-view-edit'
        sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 650, p: [2, 10] } }}
        aria-describedby='user-view-edit-description'
    >
        <DialogTitle id='user-view-edit' sx={{ textAlign: "center", fontSize: "1.5rem !important" }}>
        List of Students in Class {studentClass?.classID}
        </DialogTitle>
        <DialogContent>
            <Grid item xs={12} mt={4}>
            {studentClass?.student?.map(student => {
            return (
                <Box
                key={student.email}
                sx={{
                    gap: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "&:not(:last-of-type)": { mb: 4 },
                }}
                >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ mr: 4, display: "flex", justifyContent: "center" }}>
                    <img src={student.image? student.image : userIcon} alt={student.name} height='30' width='30' />
                    </Box>
                    <div>
                    <Typography sx={{ fontWeight: 500 }}>{student.name}</Typography>
                    <Typography variant='body2' sx={{ color: "text.disabled" }}>
                        {student.email}
                    </Typography>
                    </div>
                </Box>
                </Box>
            );
            })}
            </Grid>
        </DialogContent>
    </Dialog>
  );
};

export default StudentList;