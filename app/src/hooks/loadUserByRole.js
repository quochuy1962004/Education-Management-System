import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
export const loadUserByRole = async (role) => {
  const q = query(collection(db, 'users'), where('role', '==', role));
  const store = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    store.push(doc.data());
  });
  return store;
};
export const loadUserByEmail = async (email) => {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const store = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    store.push(doc.data());
  });
  return store;
};
