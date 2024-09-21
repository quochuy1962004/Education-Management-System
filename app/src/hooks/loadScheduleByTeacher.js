import { doc, getDoc } from 'firebase/firestore';
import { db } from 'services/firebase';

export const loadScheduleByTeacher = async (teacherID) => {
    const teacherRef = doc(db, "users", teacherID);
    const teacherDoc = await getDoc(teacherRef);
    const teacher = teacherDoc.data();

    const courseIds = Object.keys(teacher.listStudents).map(item => item);

    let courseWithClasses = [];

    courseIds.map(item => courseWithClasses.push({ 'courseID': item}));

    let result = [];

    for (const courseWithClass of courseWithClasses) {
        // Get info based on classID and courseID
        const courseRef = doc(db, "courses", courseWithClass.courseID);
        const courseDoc = await getDoc(courseRef);
        const course = courseDoc.data();

        // Get time based on teacherID
        const classInfo = course.classArray?.find(item => item.teacherID === teacherID);


        result.push({
            'courseID': course.courseCode,
            'courseName': course.courseName,
            'classID': classInfo?.classID,
            'date': classInfo?.date,
            'startTime': classInfo?.startTime,
            'endTime': classInfo?.endTime,
            'credit': course.credit
        });
    }
    
    console.log(result, "result of schedule")
    return result;
};