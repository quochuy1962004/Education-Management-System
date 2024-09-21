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
import { isValidEmail } from "utils/validEmail";
import { createAccount } from "hooks/createAccount";

const AddTeacherDialog = ({
  openAddDialog,
  handleAddDialogClose,
  fetchTeachers,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onAdd = async () => {

    if (email === "") {
      setEmailError("This field cannot be empty");
    }
    if (!isValidEmail(email)) {
        setEmailError("Must be a valid email");
    }
    else if(password === "") {
        setPasswordError("This field cannot be empty");
    }

    if (
      email === "" ||
      password === "" ||
      !isValidEmail(email)
    ) {
      return;
    }

    const output = {
      email: email,
      password: password,
      role: "teacher",
    };
    await createAccount(output);
    onClose();
    fetchTeachers();
};

  const clearError = () => {
    setEmailError("");
    setPasswordError("");
  };

  const onClose = () => {
    setEmail("");
    setPassword("");
    clearError();
    handleAddDialogClose();
  };

  return (
    <>
      <Dialog
        open={openAddDialog}
        onClose={onClose}
        aria-labelledby='user-view-edit'
        sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 650, p: [2, 10] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: "center", fontSize: "1.5rem !important" }}>
          Add New Teacher Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: "center", mb: 7 }}>
            Adding a new teacher account with the following information.
          </DialogContentText>
          <form>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <FormControl error={emailError !== ""} fullWidth>
                  <TextField
                    type="email"
                    error={emailError !== ""}
                    label='Email'
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                  />
                  <FormHelperText id='component-error-text'>{emailError}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl error={passwordError !== ""} fullWidth>
                  <TextField
                    error={passwordError !== ""}
                    label='Password'
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                  />
                  <FormHelperText id='component-error-text'>{passwordError}</FormHelperText>
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

export default AddTeacherDialog;
