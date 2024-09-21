import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box } from '@mui/material';

const Table = ({ data }) => {
    const columns = useMemo(
        () => [
            {
                accessorFn: (row) => `${row.courseName}`,
                id: 'courseName',
                header: 'Course Name',
                size: 250,
            },
            {
                accessorFn: (row) => `${row.courseID}`,
                id: 'courseCode',
                header: 'Course Code',
                size: 150,
            },
            {
                accessorFn: (row) => `${row.classID}`,
                id: 'classID',
                header: 'ClassID',
                size: 150,
            },
            {
                accessorFn: (row) => `${row.credit}`,
                id: 'credit',
                header: 'Credit',
                size: 100,
            },
            {
                accessorFn: (row) => `${row.date}`,
                id: 'date',
                header: 'Date',
                size: 100,
            },
            {
                accessorFn: (row) => `${row.startTime}`,
                id: 'startTime',
                header: 'StartTime',
                size: 100,
            },
            {
                accessorFn: (row) => `${row.endTime}`,
                id: 'endTime',
                header: 'EndTime',
                size: 100,
            },
            {
                accessorFn: (row) => `${row.teacherName}`,
                id: 'teacherName',
                header: 'TeacherName',
                size: 100,
            },
        ],
        []
    );

    return (
        <div>
            <MaterialReactTable
                columns={columns}
                data={data}
                initialState={{
                    sorting: [{ id: 'date', desc: false }],
                }}
            />
            <Box
                sx={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '0.25rem',
                }}
            />
        </div>
    );
};

export default Table;
