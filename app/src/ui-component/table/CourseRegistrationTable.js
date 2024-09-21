import React, { useMemo, useEffect, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
} from 'material-react-table';
import { Box, Typography, Button } from '@mui/material';
import { lighten } from '@mui/material/styles';
import { courseSignOut, courseSignin } from 'hooks/registerCourseByStudent';
import toast, { Toaster } from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'services/firebase';

const Table = ({ data, studentID, currentRole, openCourseModal, openClassModal }) => {
    const [newData, setNewData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const newDataArray = [];
            for (const row of data) {
                for (const classInfo of row.classArray) {
                    const teacherRef = doc(db, "users", classInfo.teacherID);
                    const teacherDoc = await getDoc(teacherRef);
                    const teacherName = teacherDoc.data().name;

                    newDataArray.push({
                        ...row,
                        classID: classInfo.classID,
                        date: classInfo.date,
                        startTime: classInfo.startTime,
                        endTime: classInfo.endTime,
                        teacherName: teacherName
                    });
                }
            }
            setNewData(newDataArray);
        };

        fetchData();
    }, [data]);

    const columns = useMemo(
        () => [
            
            {
                accessorFn: (row) => `${row.courseName}`,
                id: 'courseName',
                header: 'Course Name',
                size: 250,
            },
            {
                accessorFn: (row) => `${row.courseCode}`,
                id: 'courseCode',
                header: 'Course Code',
                size: 150,
            },
            {
                accessorFn: (row) => `${row.classID}`,
                id: 'classID',
                header: 'Class ID',
                size: 150,
            },
            {
                accessorFn: (row) => `${row.credit}`,
                id: 'credit',
                header: 'Credit',
                size: 100,
            },

        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: newData,
        editDisplayMode: 'modal',
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowSelection: true,
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select'],
            },
            groupBy: ['courseCode']
        },

        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },
        muiPaginationProps: {
            color: 'secondary',
            rowsPerPageOptions: [10, 20, 30],
            shape: 'rounded',
            variant: 'outlined',
        },
        renderDetailPanel: ({ row }) => (
                <Box sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom component="div" style={{ paddingLeft: 150, textAlign: 'left' }}>
                        Course Details:
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ paddingLeft: 150 }}>Date:</span> <span style={{ paddingRight: 590 }}>{row.original.date}</span>
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ paddingLeft: 150 }}>Start Time:</span> <span style={{ paddingRight: 590 }}>{row.original.startTime}</span>
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ paddingLeft: 150 }}>End Time:</span> <span style={{ paddingRight: 590 }}>{row.original.endTime}</span>
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: 'left', display: 'flex'}}>
                        <span style={{ paddingLeft: 150 }}>Teacher Name:</span> <span style={{ paddingLeft: 245 }}>{row.original.teacherName}</span>
                    </Typography>
                </Box>
        ),
        renderTopToolbar: ({ table }) => {
            const handleCourseSignOut = async () => {
                table.getSelectedRowModel().flatRows.map(async (row) => {
                    const courseCode = row.getValue('courseCode');
                    const classID = row.getValue('classID');

                    const result = await courseSignOut(courseCode, classID, studentID);

                    if (result.status === 'success') {
                        toast.success('Signing out from ' + courseCode + ' successfully!');
                    } else {
                        toast.error('Error: ' + result.message);
                    }
                });
            };


            const handleCourseSignIn = async () => {
                table.getSelectedRowModel().flatRows.map(async (row) => {
                    const courseCode = row.getValue('courseCode');
                    const classID = row.getValue('classID');
                    const result = await courseSignin(courseCode, classID, studentID);

                    if (result.status === 'success') {
                        toast.success('Registering ' + courseCode + ' successfully!');
                    } else {
                        toast.error('Error: ' + result.message);
                    }
                });
            };


            return (
                <Box
                    sx={(theme) => ({
                        backgroundColor: lighten(theme.palette.background.default, 0.05),
                        display: 'flex',
                        gap: '0.5rem',
                        p: '8px',
                        justifyContent: 'space-between',
                    })}
                >
                    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {/* import MRT sub-components */}
                        <MRT_GlobalFilterTextField table={table} />
                        <MRT_ToggleFiltersButton table={table} />
                    </Box>
                    <Box>
                        {currentRole === 'student' && <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                             <Button
                                color="error"
                                disabled={!table.getIsSomeRowsSelected()}
                                onClick={handleCourseSignOut}
                                variant="contained"
                            >
                                Unenroll
                            </Button>
                            <Button
                                color="success"
                                disabled={!table.getIsSomeRowsSelected()}
                                onClick={handleCourseSignIn}
                                variant="contained"
                            >
                                Enroll
                            </Button>
                        </Box>}
                        {currentRole === 'admin' && <Box sx={{display: 'flex', gap: '0.5rem'}}>
                        <Button
                            color="primary"
                            onClick={openCourseModal}
                            variant="contained"
                        >
                            Add New Course
                        </Button>
                        <Button
                            color="inherit"
                            onClick={openClassModal}
                            variant="contained"
                        >
                            Add New Class
                        </Button>

                        </Box>
                            
                        }
                    </Box>
                </Box>
            );
        },
    });

    return (
        <div>
            <Toaster position='top-right' />
            <MaterialReactTable table={table} />
        </div>
    );
};
export default Table;
