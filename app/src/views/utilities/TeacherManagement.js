import { useState, useEffect } from 'react';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

// assets
import LinkIcon from '@mui/icons-material/Link';
import TeacherTable from 'ui-component/table/TeacherTable';
import { loadUserByRole } from 'hooks/loadUserByRole';
import { CircularProgress } from '@mui/material';
import AddTeacherDialog from 'ui-component/dialog/AddTeacherDialog';


const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  
  const fetchTeachers = async() => {
    const teacherList = await loadUserByRole("teacher");
    if (teacherList) {
      setTeachers(teacherList);
    }
  }
  useEffect(() =>{
    fetchTeachers();
   },[])
  
  const handleAddDialogOpen = () => setOpenAddDialog(true);
  const handleAddDialogClose = () => setOpenAddDialog(false);

  return (
    <MainCard title="Teacher Management" secondary={<SecondaryAction icon={<LinkIcon fontSize="small" />} link="https://tablericons.com/" />}>
      {teachers? <TeacherTable data={teachers} openModal={handleAddDialogOpen} />: <CircularProgress/>}
      <AddTeacherDialog openAddDialog={openAddDialog} handleAddDialogClose={handleAddDialogClose} fetchTeachers={fetchTeachers}/>
    </MainCard>
  )};

export default TeacherManagement;
