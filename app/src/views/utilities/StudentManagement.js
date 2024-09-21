// project imports
import { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

// assets
import LinkIcon from '@mui/icons-material/Link';
import { loadUserByRole } from 'hooks/loadUserByRole';
import { CircularProgress } from '@mui/material';
import StudentTable from 'ui-component/table/StudentTable';
import AddStudentDialog from 'ui-component/dialog/AddStudentDialog';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchStudents = async() => {
    const studentList = await loadUserByRole("student");
    if (studentList) {
      setStudents(studentList);
    }
  }
  useEffect(() =>{
    fetchStudents();
   },[])
  const handleAddDialogOpen = () => setOpenAddDialog(true);
  const handleAddDialogClose = () => setOpenAddDialog(false);
 
  return (
  <MainCard title="Student Management" secondary={<SecondaryAction icon={<LinkIcon fontSize="small" />} link="https://tablericons.com/" />}>
    {students? <StudentTable data={students} openModal={handleAddDialogOpen} />: <CircularProgress/>}

    <AddStudentDialog openAddDialog={openAddDialog} handleAddDialogClose={handleAddDialogClose} fetchStudents={fetchStudents}/>

  </MainCard>
)};

export default StudentManagement;
