import { doc, getDoc } from 'firebase/firestore';
import { db } from 'services/firebase';
import { loadUserById } from './loadUserData';

const getClassFromUser = async (courseCode, role) => {
  if (role === 'student') {
    let studentClass = '';

    const userId = localStorage.getItem('userId');
    let docRef = doc(db, 'users', userId);
    let docSnap = await getDoc(docRef);
    const allCourse = docSnap.data().listCourses;
    let isAccessed = false;
    if (allCourse) {
      // console.log(allCourse);
      for (const i of Object.entries(allCourse)) {
        if (i[0] === courseCode) {
          // console.log(i);
          studentClass = i[1].classID;
          isAccessed = true;
          break;
        }
      }
    }
    if(!isAccessed) {
      return {
        status: "error",
        message: "You are not permitted to access this course!"
      }
    }
    docRef = doc(db, 'courses', courseCode);
    docSnap = await getDoc(docRef);
    let store = {};
    const classArray = docSnap.data().classArray;
    let teacherId = '';
    if (classArray) {
      for (const i of Object.entries(classArray)) {
        if (i[1].classID === studentClass) {
          // console.log(i[1]);
          store = i[1];
          teacherId = i[1].teacherID;
        }
      }
    }
    docRef = doc(db, 'users', teacherId);
    docSnap = await getDoc(docRef);
    const teacher = docSnap.data()?.name;
    const listStudents = docSnap.data()?.listStudents;
    const listStudentsId = [];
    for (const i of Object.entries(listStudents)) {
      if (i[0] === courseCode) {
        listStudentsId.push(i[1]);
        break;
      }
    }
    // console.log(listStudentsId);
    const studentList = [];
    for (const i of listStudentsId[0]) {
      // console.log('id: ', i);
      const student = await loadUserById(i);
      // console.log(student.name);
      studentList.push(student);
    }
    store['student'] = studentList;
    // console.log('name: ', teacher);
    store['teacherName'] = teacher;
    return store;
  } else if (role === 'teacher') {
    const userId = localStorage.getItem('userId');
    let docRef = doc(db, 'courses', courseCode);
    let docSnap = await getDoc(docRef);
    let store = {};
    const classArray = docSnap.data().classArray;
    let isAccessed = false;

    if (classArray) {
      for (const i of Object.entries(classArray)) {
        if (i[1].teacherID === userId) {
          // console.log(i[1]);
          isAccessed = true;
          store = i[1];
        }
      }
    }
    if(!isAccessed) return {
        status: "error",
        message: "You are not permitted to access this course!"
    }
    docRef = doc(db, 'users', userId);
    docSnap = await getDoc(docRef);
    const teacher = docSnap.data()?.name;
    store['teacherName'] = teacher;
    const listStudents = docSnap.data()?.listStudents;
    const listStudentsId = [];
    for (const i of Object.entries(listStudents)) {
      if (i[0] === courseCode) {
        listStudentsId.push(i[1]);
        break;
      }
    }
    // console.log(listStudentsId);
    const studentList = [];
    for (const i of listStudentsId[0]) {
      // console.log('id: ', i);
      const student = await loadUserById(i);
      // console.log(student.name);
      studentList.push(student);
    }
    store['student'] = studentList;
    return store;
  }
};
export default getClassFromUser;
