import { doc, getDoc } from 'firebase/firestore';
import { db } from 'services/firebase';

export const loadScheduleByStudent = async (studentID) => {
    const studentRef = doc(db, "users", studentID);
    const studentDoc = await getDoc(studentRef);
    const student = studentDoc.data();
    const listCourses = student.listCourses;

    const courseIds = Object.keys(student.listCourses).map(item => item);

    let courseWithClasses = [];

    courseIds.map(item => courseWithClasses.push({ 'courseID': item, 'classID': listCourses[item]['classID'] }));

    let result = [];

    for (const courseWithClass of courseWithClasses) {
        // Get info based on classID and courseID
        const courseRef = doc(db, "courses", courseWithClass.courseID);
        const courseDoc = await getDoc(courseRef);
        const course = courseDoc.data();

        // Get time based on class
        const classInfo = course.classArray?.find(item => item.classID === courseWithClass.classID);

        // Get info of teacher
        const teacherRef = doc(db, "users", classInfo.teacherID);
        const teacherDoc = await getDoc(teacherRef);
        const teacherName = teacherDoc.data().name;

        result.push({
            'courseID': course.courseCode,
            'courseName': course.courseName,
            'classID': classInfo?.classID,
            'date': classInfo?.date,
            'startTime': classInfo?.startTime,
            'endTime': classInfo?.endTime,
            'teacherName': teacherName,
            'credit': course.credit
        });
    }
    
    console.log(result, "result of schedule")
    return result;
};