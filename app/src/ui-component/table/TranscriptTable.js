import React, { useMemo, useCallback } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Table = ({ data,gpa }) => {
    const columns = useMemo(
        () => [
            {
                accessorFn: (row) => `${row.courseName}`,
                id: 'courseName',
                header: 'Course Name',
                size: 250,
                Cell: ({ renderedCellValue, isExpanded, toggleRowExpanded }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <span>{renderedCellValue}</span>
                        <IconButton
                            onClick={() => toggleRowExpanded(!isExpanded)}
                            aria-label="expand row"
                            size="small"
                        >
                            {isExpanded ? <ExpandMoreIcon /> : null}
                        </IconButton>
                    </Box>
                ),
            },
            {
                accessorFn: (row) => `${row.courseCode}`,
                id: 'courseCode',
                header: 'Course Code',
                size: 150,
            },
            {
                accessorFn: (row) => `${row.credit}`,
                id: 'credit',
                header: 'Credit',
                size: 100,
            },
            {
                accessorFn: (row) => `${row.average}`, 
                id: 'average', 
                header: 'Average', 
                size: 100,
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor:
                                cell.getValue() < 5.0
                                    ? theme.palette.error.dark
                                    : cell.getValue() >= 5.0 && cell.getValue() < 8.0
                                    ? theme.palette.warning.dark
                                    : theme.palette.success.dark,
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        {cell.getValue()}
                    </Box>
                ),
            },
        ],
        []
    );

    const renderDetailPanel = useCallback(({ row }) => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom component="div" style={{ paddingLeft: 80,textAlign: 'left' }}>
                Grade Details:
            </Typography>
            <Typography variant="body1" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ paddingLeft: 80 }}>Midterm:</span> <span style={{ paddingRight: 600 }}>{row.original.midterm}</span>
            </Typography>
            <Typography variant="body1" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ paddingLeft: 80 }}>Final:</span> <span style={{ paddingRight: 600 }}>{row.original.final}</span>
            </Typography>
            <Typography variant="body1" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ paddingLeft: 80 }}>Average:</span> <span style={{ paddingRight: 600 }}>{row.original.average}</span>
            </Typography>
        </Box>

    ), []);

    return (
        <div>
            
            <MaterialReactTable
                columns={columns}
                data={data}
                renderDetailPanel={renderDetailPanel}
            />
            <Box
                sx={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '0.25rem',
                }}
            >
                <Typography variant="h4" style={{ fontWeight: 'bold', textAlign: 'left' ,color: 'blue', paddingLeft: 100 }}>
                    GPA :  {gpa?.toFixed(1)}
                </Typography>
            </Box>
        </div>
    );
};

export default Table;
