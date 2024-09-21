import { DocumentData, doc, getDoc } from 'firebase/firestore';
import { loadUserByRole } from './loadUserByRole';
import { useState, useEffect } from 'react';
import { setGrade } from './setGradeByCourse';
import { db } from '../../firebase';
import { setGPA } from './setStudentGPA';

const StudentManagement = () => {
  const [students, setData] = useState([]);
  const [listStudents, setListStudents] = useState(null);
  const scoreCount = 10;
  const midtermScoreStates = Array.from({ length: scoreCount }, () => useState(0));
  const finalScoreStates = Array.from({ length: scoreCount }, () => useState(0));

  let count = 0;
  useEffect(() => {
    const fetchData = async () => {
      const studentList = await loadUserByRole('student');
      if (studentList) {
        setData(studentList);
      }
    };
    fetchData();
  }, []);

  const getListStudent = async (currentUserId) => {
    const docRef = doc(db, 'users', currentUserId);
    const docSnap = await getDoc(docRef);
    const listStudentsData = await docSnap.data()?.listStudents;
    const resultMap = {};
    Object.keys(listStudentsData).forEach((courseCode) => {
      const studentIds = listStudentsData[courseCode];
      studentIds.forEach((studentId) => {
        const foundStudent = students.find((student) => student.uid === studentId);
        if (foundStudent) {
          if (!resultMap[courseCode]) {
            resultMap[courseCode] = [foundStudent];
          } else {
            resultMap[courseCode].push(foundStudent);
          }
        }
      });
    });
    setListStudents(resultMap);
  };

  const handleSetGrade = (midleScore, finalScore, studentIds, courseCode) => {
    setGrade(midleScore, finalScore, studentIds, courseCode);
    setGPA(studentIds);
  };
  const currentUserId = localStorage.getItem('userId');
  return (
    <>
      <h3>Student Management</h3>
      {currentUserId && <button onClick={() => getListStudent(currentUserId)}>Load Student list</button>}
      {listStudents && (
        <>
          {Object.keys(listStudents).map((courseCode) => (
            <div key={courseCode}>
              <h4>Course: {courseCode}</h4>
              {listStudents[courseCode].map((student) => {
                const [midtermScore, setMidtermScore] = midtermScoreStates[count];
                const [finalScore, setFinalScore] = finalScoreStates[count];
                count++;
                return (
                  <div key={student.uid}>
                    <p>{student.name}</p>
                    <p>{student.email}</p>
                    <img style={{ width: 150 }} src={student.image} alt="Student" /> <br />
                    <br />
                    <div> Current midterm score: {student.listCourses[courseCode].midterm}</div>
                    <input
                      type="number"
                      value={midtermScore}
                      onChange={(event) => setMidtermScore(parseFloat(event.target.value))}
                      placeholder="Enter new midterm score"
                    />
                    <br />
                    <div> Current final score: {student.listCourses[courseCode].final}</div>
                    <input
                      type="number"
                      value={finalScore}
                      onChange={(event) => setFinalScore(parseFloat(event.target.value))}
                      placeholder="Enter new final score"
                    />
                    <br />
                    <div> Average score: {student.listCourses[courseCode].average}</div>
                    <button
                      onClick={() => {
                        handleSetGrade(midtermScore, finalScore, student.uid, courseCode);
                      }}
                    >
                      Set Grade
                    </button>
                    <div>-------------------------------------------------</div>
                  </div>
                );
              })}
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default StudentManagement;
