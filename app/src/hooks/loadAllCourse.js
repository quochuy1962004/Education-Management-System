import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
export const loadAllCourse = async () => {
  const store = [];
  const querySnapshot = await getDocs(collection(db, 'courses'));
  querySnapshot.forEach((doc) => {
    store.push(doc.data());
  });
  return store;
};
