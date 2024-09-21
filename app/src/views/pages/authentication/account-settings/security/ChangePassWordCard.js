// ** React Imports
import {  useState } from "react";

// ** MUI Imports
import { Card } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";


// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


// ** Third Party Imports
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { auth } from "services/firebase";
import { updatePassword } from "firebase/auth";

const ChangePasswordCard = () => {
  // ** States

  const defaultValues = {
    newPassword: "",
    confirmNewPassword: "",
  };
  
  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .min(8)
      .matches(
          // eslint-disable-next-line
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special case character",
      )
      .required(),
    confirmNewPassword: yup
      .string()
      .required()
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });


  const [values, setValues] = useState({
    showNewPassword: false,
    showConfirmNewPassword: false,
  });

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(schema) });


  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };
  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword });
  };
  const handleMouseDownConfirmNewPassword = (event) => {
    event.preventDefault();
  };

  const onPasswordFormSubmit = (data) => {
    const { newPassword } = data;
    updatePassword(auth.currentUser, newPassword)
    .then(() => {
      toast.success("Password Changed Successfully");
      reset(defaultValues);
      })
    .catch((error) => {
      toast.error(error.message);
    });

  };


  return (
    <>
      <div><Toaster position="top-right"/></div>
      <Grid container direction="column" justifyContent="center" sx={{ minHeight: '100vh' }}>
        <Card sx={{justifyContent: "center" }}>
          <CardHeader title='Change Password' />
          <CardContent>
            <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='input-new-password' error={Boolean(errors.newPassword)}>
                      New Password
                    </InputLabel>
                    <Controller
                      name='newPassword'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <OutlinedInput
                          value={value}
                          label='New Password'
                          onChange={onChange}
                          id='input-new-password'
                          error={Boolean(errors.newPassword)}
                          type={values.showNewPassword ? "text" : "password"}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowNewPassword}
                                onMouseDown={handleMouseDownNewPassword}
                              >
                                {values.showNewPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      )}
                    />
                    {errors.newPassword && (
                      <FormHelperText sx={{ color: "error.main" }}>{errors.newPassword.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='input-confirm-new-password' error={Boolean(errors.confirmNewPassword)}>
                      Confirm New Password
                    </InputLabel>
                    <Controller
                      name='confirmNewPassword'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <OutlinedInput
                          value={value}
                          label='Confirm New Password'
                          onChange={onChange}
                          id='input-confirm-new-password'
                          error={Boolean(errors.confirmNewPassword)}
                          type={values.showConfirmNewPassword ? "text" : "password"}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowConfirmNewPassword}
                                onMouseDown={handleMouseDownConfirmNewPassword}
                              >
                                {values.showConfirmNewPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      )}
                    />
                    {errors.confirmNewPassword && (
                      <FormHelperText sx={{ color: "error.main" }}>{errors.confirmNewPassword.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, color: "text.secondary" }}>Password Requirements:</Typography>
                  <Box component='ul' sx={{ pl: 4, mb: 0, "& li": { mb: 1, color: "text.secondary" } }}>
                    <li>Minimum 8 characters long - the more, the better</li>
                    <li>At least one lowercase & one uppercase character</li>
                    <li>At least one number, symbol, or whitespace character</li>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button variant='contained' type='submit' sx={{ mr: 3 }}>
                    Save Changes
                  </Button>
                  <Button type='reset' variant='outlined' color='secondary' onClick={() => reset()}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default ChangePasswordCard;
