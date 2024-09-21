// project imports
import { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

// assets
import LinkIcon from '@mui/icons-material/Link';
import { CircularProgress } from '@mui/material';
import { loadAllCourse } from 'hooks/loadAllCourse';
import CourseRegistrationTable from 'ui-component/table/CourseRegistrationTable';
import AddCourseDialog from 'ui-component/dialog/AddCourseDialog';
import AddClassDialog from 'ui-component/dialog/AddClassDialog';
import { loadUserByRole } from 'hooks/loadUserByRole';

const CourseManagement = () => {
  const [openAddCourseDialog, setOpenAddCourseDialog] = useState(false);
  const [openAddClassDialog, setOpenAddClassDialog] = useState(false);

  const [allCourse, setAllCourse] = useState([]);

  const [teachers, setTeachers] = useState([]);


  const fetchCourses = async () => {
      try {
          const data = await loadAllCourse();
          setAllCourse(data);
          return data;
      }
      catch (error) {
          console.error('Error fetching user data: ', error);
      }
  };

  const fetchTeachers = async () => {
    try {
        const data = await loadUserByRole("teacher");
        setTeachers(data);
    }
    catch (error) {
        console.error('Error fetching teachers: ', error);
    }

  }

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

const handleAddCourseDialogOpen = () => {
    setOpenAddCourseDialog(true);
    fetchCourses();
}

const handleAddCourseDialogClose = () => setOpenAddCourseDialog(false);

const handleAddClassDialogOpen = () => {
    setOpenAddClassDialog(true);
    fetchCourses();
    fetchTeachers();
}
const handleAddClassDialogClose = () => setOpenAddClassDialog(false);

 
  return (
  <MainCard title="Course Management" secondary={<SecondaryAction icon={<LinkIcon fontSize="small" />} link="https://tablericons.com/" />}>
    {allCourse? 
    <CourseRegistrationTable data={allCourse} openCourseModal={handleAddCourseDialogOpen} openClassModal={handleAddClassDialogOpen} currentRole="admin" />: <CircularProgress/>}
   
    <AddCourseDialog openAddDialog={openAddCourseDialog} handleAddDialogClose={handleAddCourseDialogClose} fetchCourses={fetchCourses}/>

    <AddClassDialog courses={allCourse} teachers={teachers} openClassDialog={openAddClassDialog} handleAddClassDialogClose={handleAddClassDialogClose} fetchCourses={fetchCourses}/>

  </MainCard>
)};

export default CourseManagement;
