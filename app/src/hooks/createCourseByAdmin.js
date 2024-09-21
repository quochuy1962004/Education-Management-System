import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

import {loadScheduleByTeacher} from '../hooks/loadScheduleByTeacher'

export async function existCourse(courseCode){
  const courseRef=doc(db,"courses",courseCode);
  const courseDoc= await getDoc(courseRef);
  const course=courseDoc.data();
  return course!=undefined;
}

export const createCourse = async (output) => {
  if (await existCourse(output.courseCode)) return{status: "Error", message: "This course has existed!"};
  await setDoc(doc(db, 'courses', output.courseCode), {
    courseName: output.courseName,
    courseCode: output.courseCode,
    credit: output.credit,
    classArray: [],
    courseDocuments: []
  });
  return {status: "Success", message: "Create course successfully!"};
};

export async function checkDuplicateTeacherSchedule(date,startTime,endTime,teacherID){

    //get new time
    const currentSchedule = await loadScheduleByTeacher(teacherID);
  
    const sameDateClasses = currentSchedule.filter(item => item.date === date);
  
    const flag = sameDateClasses.map((item) => {
      if (
          ( (item.startTime >= startTime) && (item.startTime < endTime) ) ||
          ( (item.endTime > startTime) && (item.endTime <= endTime) ) ||
          ( (item.startTime < startTime) && (item.endTime > endTime) )
        )
      return false;
  
    return true;
    })
    return !flag.includes(false);
}
export async function checkActiveStatus(teacherID) {
  const teacherRef = doc(db, 'users', teacherID);
  const teacherDoc = await getDoc(teacherRef);
  return teacherDoc.data().isActive;
}

export const createClassForCourse=async(courseCode, date,startTime,endTime,teacherID)=>{

  if(!checkDuplicateTeacherSchedule(date,startTime,endTime,teacherID)) return{status: "Error", message: "Time overlapped!"};

  const courseRef=doc(db,"courses",courseCode);
  const courseDoc= await getDoc(courseRef);
  const course=courseDoc.data();
  const Class=course.classArray;

  var nextClassID = "";
  if(Class.length === 0) {
      nextClassID="L01";
  }
  else {
    const nextClassIDnum=parseInt(Class[Class.length-1].classID[1])*10+parseInt(Class[Class.length-1].classID[2])+1;
      nextClassID="L";
    if (nextClassIDnum<10) nextClassID=nextClassID+0+nextClassIDnum;
    else nextClassID+=nextClassIDnum;
  }

  const nextClass={
    classID: nextClassID,
    date: date,
    startTime:startTime,
    endTime:endTime,
    teacherID:teacherID
  }

  Class.push(nextClass);
  await updateDoc(doc(db, 'courses', courseCode), {
    classArray: Class
  });

  //update listStudents of Teacher
    const teacherRef = doc(db, 'users', teacherID);
    const teacherDoc = await getDoc(teacherRef);
    if (teacherDoc.exists()) {
      const isActive = teacherDoc.data().isActive;
      if(!isActive)
      {
        return {status: "Error", message: "Teacher is not active!"};
      }
    }

    const listStudents = teacherDoc.data().listStudents || {};
    const updatedListStudents = { ...listStudents };
    updatedListStudents[course.courseCode] = [];
    
  
    await updateDoc(doc(db, 'users', teacherID), {
      listStudents: updatedListStudents
    });


  return {status: "success", message: `Create class for ${courseCode} successfully!`};
}