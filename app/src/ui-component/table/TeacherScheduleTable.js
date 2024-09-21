import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {  autocompleteClasses } from '@mui/material';

const TeacherScheduleTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        id: 'teacher',
        columns: [
          {
            accessorKey: 'courseName',
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Course Name',
            enableEditing: false,
            size: autocompleteClasses,
          },
          {
            accessorKey: 'classID',
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'ClassID',
            enableEditing: false,
            size: autocompleteClasses,
          },
          {
            accessorKey: 'date',
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Date',
            enableEditing: false,
            size: autocompleteClasses,
          },
          {
            accessorKey: 'startTime',
            enableClickToCopy: true,
            filterVariant: 'date',
            filterFn: 'lessThan',
            header: 'Start Time',
            enableEditing: false,
            size: autocompleteClasses,
          },
          {
            accessorKey: 'endTime',
            enableClickToCopy: true,
            filterVariant: 'date',
            filterFn: 'lessThan',
            header: 'End Time',
            enableEditing: false,
            size: autocompleteClasses,
          },

        ],
      },
    ],
    [],
  );
  // Sort the data initially by the 'date' column
  const defaultSortBy = useMemo(() => [{ id: 'date', desc: true }], []);

  return (
    <div>
      <MaterialReactTable
        columns={columns}
        data={data}
        initialState={defaultSortBy}
      />
    </div>
  );
};

export default TeacherScheduleTable;
