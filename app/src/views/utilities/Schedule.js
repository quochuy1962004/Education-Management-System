import { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { CircularProgress } from '@mui/material';
import ScheduleTable from 'ui-component/table/ScheduleTable';
import { loadScheduleByStudent } from 'hooks/loadScheduleByStudent';
const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const fetchUserData = async () => {
    try {
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) {
          const data = await loadScheduleByStudent(currentUserId);
          setSchedule(data);
        }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  console.log(schedule);
  return (
    <MainCard
      title="Schedule"
    >
      {schedule ? <ScheduleTable data={schedule}/> : <CircularProgress />}
    </MainCard>
  );
};

export default Schedule;
