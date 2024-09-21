import { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { CircularProgress } from '@mui/material';
import TranscriptTable from 'ui-component/table/TranscriptTable';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'services/firebase';
import { loadData } from 'hooks/loadUserData';
import { auth } from 'services/firebase';
import { setGPA } from 'hooks/setStudentGPA';
const StudentTranscript = () => {
  const [courses, setCourses] = useState([]);
  const [currentGPA, setCurrentGPA] = useState(null);
  const fetchUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const data = await loadData(currentUser);
        await setGPA(currentUser.uid)
        const listCourses = data.listCourses || {};
        const promises = Object.keys(listCourses).map(async (courseCode) => {
          const docRefCourse = doc(db, 'courses', courseCode);
          const docSnapCourse = await getDoc(docRefCourse);
          if (docSnapCourse.exists()) {
            const credit = docSnapCourse.data().credit;
            const courseName = docSnapCourse.data().courseName;
            return { ...listCourses[courseCode], courseCode, courseName, credit ,gpa: data.GPA};
          } else {
            return { ...listCourses[courseCode], courseCode, courseName: 'Unknown', credit: 0 };
          }
        });
        const coursesWithDetails = await Promise.all(promises);
        setCourses(coursesWithDetails);
        setCurrentGPA(data.GPA);
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  console.log(courses);
  return (
    <MainCard
      title="Student Transcript"
    >
      {courses ? <TranscriptTable data={courses} gpa={currentGPA}/> : <CircularProgress />}
    </MainCard>
  );
};

export default StudentTranscript;
