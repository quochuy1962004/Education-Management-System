// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import { FormHelperText } from "@mui/material";
import toast, {Toaster} from "react-hot-toast";
import { checkDuplicateTeacherSchedule, createClassForCourse } from "hooks/createCourseByAdmin";
import { checkActiveStatus } from "hooks/createCourseByAdmin";

const AddClassDialog = ({
  courses,
  teachers,
  openClassDialog,
  handleAddClassDialogClose,
  fetchCourses,
}) => {


  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseCodeError, setCourseCodeError] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teacherError, setTeacherError] = useState("");

  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");

  const [startTime, setStartTime] = useState("");
  const [startTimeError, setStartTimeError] = useState("");

  const [endTime, setEndTime] = useState("");
  const [endTimeError, setEndTimeError] = useState("");

  const hasNumber = (text) => new RegExp(/^[0-9]+$/).test(text);

  const onAdd = async () => {
    const valid = await checkDuplicateTeacherSchedule(Number(date), Number(startTime), Number(endTime), selectedTeacher);
    const isActive = await checkActiveStatus(selectedTeacher)
    let resultOfCheck = [];

    if (selectedCourse === "") {
        setCourseCodeError("This field cannot be empty");
        resultOfCheck.push(selectedCourse === "")
      }
      if (selectedTeacher === "") {
        setTeacherError("This field cannot be empty");
        resultOfCheck.push(selectedTeacher === "")
      }

      if (date === "") {
        setDateError("This field cannot be empty");
        resultOfCheck.push(date === "")
      }

      if(startTime === "") {
        setStartTimeError("This field cannot be empty");
        resultOfCheck.push(startTime === "")
      }

      if(endTime === "") {
        setEndTimeError("This field cannot be empty")
        resultOfCheck.push(endTime === "")
      }

      if(!hasNumber(date)) {
        setDateError("This field must be a valid number");
        resultOfCheck.push(!hasNumber(date))
      }

      if(!hasNumber(startTime)) {
        setStartTimeError("This field must be a valid number");
        resultOfCheck.push(!hasNumber(startTime))
      }

      if(!hasNumber(endTime)) {
        setEndTimeError("This field must be a valid number");
        resultOfCheck.push(!hasNumber(endTime))
      }

      if(!valid) {
        console.log(valid)
        setTeacherError("The schedule for this class conflicts with the selected teacher's current schedule. Please adjust the time or select a different teacher")
        resultOfCheck.push(!valid)
      }

      if(!isActive) {
        console.log(isActive)
        setTeacherError("Selected teacher is not active. Please re-check")
        resultOfCheck.push(!isActive)
      }


      if (resultOfCheck.includes(true)) return;

      const result = await createClassForCourse(selectedCourse, Number(date), Number(startTime), Number(endTime), selectedTeacher);
      toast.success(result.message);
    
    fetchCourses();
    onClose();
  };

  const clearError = () => {
    setCourseCodeError("");
    setTeacherError("");
    setDateError("");
    setStartTimeError("");
    setEndTimeError("");
  };

  const onClose = () => {
    setSelectedCourse("");
    setSelectedTeacher("");
    setDate("");
    setStartTime("");
    setEndTime("");
    clearError();
    handleAddClassDialogClose();
  };


  return (
    <>
    <div><Toaster position="top-right"/></div>
      <Dialog
        open={openClassDialog}
        onClose={onClose}
        aria-labelledby='user-view-edit'
        sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 900, p: [2, 10] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: "center", fontSize: "1.5rem !important" }}>
          Add Class For Course
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: "center", mb: 7 }}>
            Adding a new class with the following information.
          </DialogContentText>
          <form>
            <Grid container spacing={6}>
              {courses !== undefined && (
                <Grid item xs={12} sm={6}>
                  <FormControl error={courseCodeError !== ""} fullWidth>
                    <InputLabel id='user-view-country-label'>Courses</InputLabel>
                    <Select
                      label='Courses'
                      value={selectedCourse}
                      onChange={(e) => {
                        setSelectedCourse(e.target.value);
                        setCourseCodeError("");
                      }}
                      id='user-view-country'
                      labelId='user-view-country-label'
                    >
                      {courses.map((option) => (
                        <MenuItem key={option.courseCode} value={option.courseCode}>
                          {option.courseCode + " - " + option.courseName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText id='component-error-text'>{courseCodeError}</FormHelperText>
                  </FormControl>
                </Grid>
              )}
              {teachers !== undefined && (
                <Grid item xs={12} sm={6}>
                  <FormControl error={teacherError !== ""} fullWidth>
                    <InputLabel id='user-view-country-label'>Teacher</InputLabel>
                    <Select
                      label='Teacher'
                      value={selectedTeacher}
                      onChange={(e) => {
                        setSelectedTeacher(e.target.value);
                        setTeacherError("");
                      }}
                      id='user-view-country'
                      labelId='user-view-country-label'
                    >
                      {teachers.length > 0 ? (
                        teachers.map((option) => (
                          <MenuItem key={option.uid} value={option.uid}>
                            {option.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No teacher</MenuItem>
                      )}
                    </Select>
                    <FormHelperText id='component-error-text'>{teacherError}</FormHelperText>
                  </FormControl>
                </Grid>
              )}

                <Grid item xs={12} sm={6}>
                <FormControl error={dateError !== ""} fullWidth>
                    <TextField
                        error={dateError !== ""}
                        label='Date'
                        value={date}
                        onChange={e => {
                        setDate(e.target.value);
                        setDateError("");
                        }}
                    />
                    <FormHelperText id='component-error-text'>{dateError}</FormHelperText>
                    </FormControl>
                </Grid>

             
                <Grid item xs={12} sm={6}>
                  <FormControl error={startTimeError !== ""} fullWidth>
                    <TextField
                        error={startTimeError !== ""}
                        label='Start Time'
                        value={startTime}
                        onChange={e => {
                        setStartTime(e.target.value);
                        setStartTimeError("");
                        }}
                    />
                    <FormHelperText id='component-error-text'>{startTimeError}</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl error={endTimeError !== ""} fullWidth>
                    <TextField
                        error={endTimeError !== ""}
                        label='End Time'
                        value={endTime}
                        onChange={e => {
                        setEndTime(e.target.value);
                        setEndTimeError("");
                        }}
                    />
                    <FormHelperText id='component-error-text'>{endTimeError}</FormHelperText>
                    </FormControl>
                </Grid>

            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant='contained' sx={{ mr: 1 }} onClick={onAdd}>
            Add
          </Button>
          <Button variant='outlined' color='secondary' onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddClassDialog;
