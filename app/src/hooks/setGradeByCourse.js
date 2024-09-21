import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from 'services/firebase';
import { setGPA } from './setStudentGPA';

export const setGrade = async (midleScore, finalScore, studentId, courseCode) => {
  console.log(typeof m);
  if (midleScore >= 0 && midleScore <= 10 && finalScore >= 0 && finalScore <= 10) {
    const docRefUser = doc(db, 'users', studentId);
    const docSnapUser = await getDoc(docRefUser);
    const listCourses = await docSnapUser.data()?.listCourses;
    console.log(listCourses[courseCode]['classID'])

    await updateDoc(doc(db, `users`, studentId), {
      [`listCourses.${courseCode}`]: {
        midterm: midleScore,
        final: finalScore,
        average: (finalScore + midleScore) / 2.0,
        classID: listCourses[courseCode]['classID']
      }
    }
  );
    await setGPA(studentId);
  } else {
    alert('Enter the score again');
  }
};
