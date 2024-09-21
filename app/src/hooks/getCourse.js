import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from 'services/firebase';

export const getCourse = async (courseCode) => {
  let course = null;
  console.log(courseCode);
  // Lấy course detail bằng courseCode
  const courseRef = doc(db, 'courses', courseCode);
  const courseDoc = await getDoc(courseRef);
  if (courseDoc.exists()) {
    course = courseDoc.data();
  }

  // Lấy danh sách học sinh đki trong khóa học
  if (course && course.studentRegister) {
    const studentRegister = [];
    const queryGetStudent = query(collection(db, 'users'), where('uid', 'in', course.studentRegister));

    const queryStudentSnapshot = await getDocs(queryGetStudent);
    queryStudentSnapshot.forEach((doc) => {
      studentRegister.push(doc.data());
    });

    course.studentRegister = studentRegister;
  }

  return course;
};
