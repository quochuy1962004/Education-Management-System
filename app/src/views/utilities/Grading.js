// project imports
import { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

// assets
import LinkIcon from '@mui/icons-material/Link';
import { loadUserByRole } from 'hooks/loadUserByRole';
import { CircularProgress } from '@mui/material';
import GradingTable from 'ui-component/table/GradingTable';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'services/firebase';
import { loadAllCourse } from 'hooks/loadAllCourse';

const Grading = () => {
    const [courseCodes, setCourseCodes] = useState([]);
    const [listStudents, setListStudents] = useState([]);
    const [listCourses, setListCourses] = useState([]);

    const currentUserId = localStorage.getItem("userId");

    const fetchCourses = async () => {
        const listCourses = await loadAllCourse();
        if(listCourses) {
            setListCourses(listCourses);
        }
    }

    const getListStudent = async (currentUserId) => {
        const docRef = doc(db, 'users', currentUserId);
        const docSnap = await getDoc(docRef);
        const listStudentsData = await docSnap.data()?.listStudents;
        const studentList = await loadUserByRole("student");
        const resultMap = {};
        Object.keys(listStudentsData || []).forEach((courseCode) => {
            const studentIds = listStudentsData[courseCode];
            studentIds.forEach((studentId) => {
                const foundStudent = studentList.find((student) => student.uid === studentId);
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
        setCourseCodes(Object.keys(resultMap));
    };

    useEffect(() => {
        getListStudent(currentUserId);
        fetchCourses();
    }, [])
    
    return (
        <MainCard title="Grading" secondary={<SecondaryAction icon={<LinkIcon fontSize="small" />} link="https://tablericons.com/" />}>
            {courseCodes.map(item => {
                return (
                    <>
                        {listCourses.map(course => {
                            if(course.courseCode == item) {
                                return (
                                    <h4 key={course.courseCode}>Couse name: {course.courseName}</h4>
                                )
                            }
                        })}
                        
                        {listStudents ?
                        <GradingTable
                            data={listStudents[item]} 
                            courseCode={item}
                        /> : <CircularProgress />}
                        <br /><br />
                    </>
                )
            })}
        </MainCard>
    )
};

export default Grading;
