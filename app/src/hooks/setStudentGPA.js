import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from 'services/firebase';

export const setGPA = async (studentId) => {
  //console.log(studentId, courseCode)
  let totalScore = 0;
  let totalCredit = 0;
  const docRefUser = doc(db, 'users', studentId);
  const docSnapUser = await getDoc(docRefUser);
  const listCourses = await docSnapUser.data()?.listCourses;
  const promises = Object.keys(listCourses).map(async (item) => {
    const docRefCourse = doc(db, 'courses', item);
    const docSnapCourse = await getDoc(docRefCourse);
    const credit = await docSnapCourse.data()?.credit;
    const average = await listCourses[item]?.average;
    totalScore += credit * average;
    totalCredit += parseInt(credit);
    console.log(item, credit, average);
  });
  await Promise.all(promises);
  const gpa = totalScore / totalCredit;
  await updateDoc(doc(db, `users`, studentId), {
    GPA: gpa
  });
};
