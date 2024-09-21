import { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { CircularProgress } from '@mui/material';
import CourseRegistrationTable from 'ui-component/table/CourseRegistrationTable';
import { loadAllCourse } from 'hooks/loadAllCourse';
const CourseRegistration = () => {
    const [allCourse, setallCourse] = useState([]);
    const studentID = localStorage.getItem("userId");
    const fetchUserData = async () => {
        try {
            const data = await loadAllCourse();
            setallCourse(data);
        }
        catch (error) {
            console.error('Error fetching user data: ', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);
    console.log(allCourse);
    return (
        <MainCard
            title="CourseRegistration"
        >
            {allCourse ? <CourseRegistrationTable data={allCourse} studentID={studentID} currentRole="student" /> : <CircularProgress />}
        </MainCard>
    );
};

export default CourseRegistration;
