import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
export const loadData = async (currentUser) => {
  const docRef = doc(db, 'users', currentUser.uid);
  const docSnap = await getDoc(docRef);
  console.log('Data: ', docSnap.data());
  console.log('Id: ', docSnap.data()?.uid);
  return {
    name: docSnap.data().name,
    role: docSnap.data().role,
    image: docSnap.data().image,
    phone: docSnap.data().phone,
    address: docSnap.data().address,
    identitycard: docSnap.data().identitycard,
    listCourses: docSnap.data().listCourses,
    GPA: docSnap.data().GPA
  };
};
export const loadUserById = async (userId) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return {
    name: docSnap.data().name,
    image: docSnap.data().image,
    email: docSnap.data().email,
  };
};
