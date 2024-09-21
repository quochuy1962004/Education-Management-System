// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { FormHelperText } from "@mui/material";
import { createCourse } from "hooks/createCourseByAdmin";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const AddCourseDialog = ({
  openAddDialog,
  handleAddDialogClose,
  fetchCourses,
}) => {

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [credit, setCredit] = useState("");

  const [courseCodeError, setCourseCodeError] = useState("");
  const [courseNameError, setCourseNameError] = useState("");
  const [creditError, setCreditError] = useState("");

  const hasNumber = (text) => new RegExp(/^[0-9]+$/).test(text);

  const onAdd = async () => {

    if (courseCode === "") {
        setCourseCodeError("This field cannot be empty");
    }

    if (courseName === "") {
        setCourseNameError("This field cannot be empty");
    }

    if (credit === "0") {
        setCreditError("This field cannot be equal to 0");
    }

    if (!hasNumber(credit)) {
        setCreditError("This field must be a valid number");
    }


    const data = await fetchCourses();
    const isDuplicateCourse = data.filter(item => item.courseCode === courseCode).length > 0
    if(isDuplicateCourse)
    {
        setCourseCodeError("This course has already been created");
    }
    if (
      courseCode === "" ||
      courseName === ""||
      credit === 0 ||
      isDuplicateCourse ||
      !hasNumber(credit)
    ) {
      return;
    }

    const output = {
      courseCode: courseCode,
      courseName: courseName,
      credit: credit,
    };
    const result = await createCourse(output);
    if(result.status === "Success") toast.success(result.message)
    else toast.error(result.message)
    onClose();

  };

  const clearError = () => {
    setCourseCodeError("");
    setCourseNameError("");
    setCreditError("");
  };

  const onClose = () => {
    setCourseCode("");
    setCourseName("");
    setCredit("");
    clearError();
    handleAddDialogClose();
  };

  return (
    <>
        <div><Toaster position="top-right"/></div>
      <Dialog
        open={openAddDialog}
        onClose={onClose}
        aria-labelledby='user-view-edit'
        sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 650, p: [2, 10] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: "center", fontSize: "1.5rem !important" }}>
          Add New Course
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: "center", mb: 7 }}>
            Adding a new course with the following information.
          </DialogContentText>
          <form>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <FormControl error={courseCodeError !== ""} fullWidth>
                  <TextField
                    error={courseCodeError !== ""}
                    label='Course Code'
                    value={courseCode}
                    onChange={e => {
                      setCourseCode(e.target.value);
                      setCourseCodeError("");
                    }}
                  />
                  <FormHelperText id='component-error-text'>{courseCodeError}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl error={creditError !== ""} fullWidth>
                  <TextField
                    error={creditError !== ""}
                    label='Credit'
                    value={credit}
                    onChange={e => {
                      setCredit(e.target.value);
                      setCreditError("");
                    }}
                  />
                  <FormHelperText id='component-error-text'>{creditError}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl error={courseNameError !== ""} fullWidth>
                  <TextField
                    error={courseNameError !== ""}
                    label='Course Name'
                    value={courseName}
                    onChange={e => {
                      setCourseName(e.target.value);
                      setCourseNameError("");
                    }}
                  />
                  <FormHelperText id='component-error-text'>{courseNameError}</FormHelperText>
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

export default AddCourseDialog;
