import { signInWithEmailAndPassword, updateEmail, updatePassword } from 'firebase/auth';

export const signIn = (e, auth) => {
  e.preventDefault();
  // get email and password from form input
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('user data: ', userCredential);
      navigate('/');
    })
    .catch((error) => {
      console.log(error);
    });
};
export const updateAuthEmail = (auth, newEmail) => {
  updateEmail(auth.currentUser, newEmail)
    .then(() => {
      console.log('email updated successfully');
      navigate('/');
    })
    .catch((error) => {
      console.log(error);
    });
};
export const updateAuthPassword = (auth, newPassword) => {
  updatePassword(auth.currentUser, newPassword)
    .then(() => {
      console.log('password updated successfully');
    })
    .catch((error) => {
      console.log(error);
    });
};
