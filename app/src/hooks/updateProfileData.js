import { db, storage } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { loadUserByEmail } from './loadUserByRole';

export const updateProfileInformation = async (e, currentUser) => {
  const target = e.target;
  const name = target.name.value;
  const phone = target.phone.value;
  const identitycard = target.identitycard.value;
  const address = target.address.value;
  try {
    if (currentUser) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        uid: currentUser.uid,
        name,
        phone,
        identitycard,
        address
      });
      console.log('Profile updated successfully');
      return '/'; // Assuming "/" is the success route
    }
  } catch (error) {
    console.error('Error submitting profile:', error);
    throw error;
  }
};

export const updateActiveStatus = async (email, activeStatus) => {
  try {
    if (email) {
      const user = await loadUserByEmail(email);
      const isActive = activeStatus;
      if (user.length > 0) {
        await updateDoc(doc(db, 'users', user[0].uid), {
          uid: user[0].uid,
          isActive
        });
        console.log('Status updated successfully');
      }
    }
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

export const updateStudentDetail = async (values) => {
  try {
    const email = values.email;
    if (email) {
      const user = await loadUserByEmail(email);
      if (user.length > 0) {
        await updateDoc(doc(db, 'users', user[0].uid), {
          uid: user[0].uid,
          name: values.name,
          major: values.major,
          department: values.department,
          startDate: values.startDate
        });
        console.log('Student Information updated successfully');
      }
    }
  } catch (error) {
    console.error('Error updating information:', error);
    throw error;
  }
};

export const updateTeacherDetail = async (values) => {
  try {
    const email = values.email;
    if (email) {
      const user = await loadUserByEmail(email);
      if (user.length > 0) {
        await updateDoc(doc(db, 'users', user[0].uid), {
          uid: user[0].uid,
          name: values.name,
          salary: values.salary,
          jobTitle: values.jobTitle,
          department: values.department,
          startDate: values.startDate
        });
        console.log('Student Information updated successfully');
      }
    }
  } catch (error) {
    console.error('Error updating information:', error);
    throw error;
  }
};

export const updateProfileImage = async (e, currentUser) => {
  const date = new Date().getTime();
  const file = e.target.file.files[0];
  const storageRef = ref(storage, `avatar_${date}`);
  try {
    await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    if (currentUser) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        uid: currentUser.uid,
        image: downloadURL
      });
      console.log('Avatar updated successfully');
      return downloadURL; // Assuming "/" is the success route
    }
  } catch (error) {
    console.error('Error submitting profile:', error);
    throw error; // Rethrow the error to be caught by the calling code
  }
};
