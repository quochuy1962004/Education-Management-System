import { useState, useEffect } from 'react';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

// assets
import LinkIcon from '@mui/icons-material/Link';
import TeacherScheduleTable from 'ui-component/table/TeacherScheduleTable';
import { CircularProgress } from '@mui/material';
import { loadScheduleByTeacher } from 'hooks/loadScheduleByTeacher';


const TeacherSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const currentTeacherId = localStorage.getItem("userId");


    const fetchSchedule = async () => {
        const schedule = await loadScheduleByTeacher(currentTeacherId);
        if (schedule) {
            setSchedule(schedule);
        }
    }
    useEffect(() => {
        fetchSchedule();
    }, [])


    return (
        <MainCard title="Schedule" secondary={<SecondaryAction icon={<LinkIcon fontSize="small" />} link="https://tablericons.com/" />}>
            {schedule ? <TeacherScheduleTable data={schedule} /> : <CircularProgress />}
        </MainCard>
    )
};

export default TeacherSchedule;
