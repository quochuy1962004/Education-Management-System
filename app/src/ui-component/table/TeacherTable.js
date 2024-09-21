import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table';

import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  lighten,
} from '@mui/material';
import { userIcon } from 'ui-component/icons';
//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';
import { updateActiveStatus } from 'hooks/updateProfileData';
import toast, {Toaster} from 'react-hot-toast';
import { updateTeacherDetail } from 'hooks/updateProfileData';
// import PropTypes from 'prop-types'

const Table = ({data, openModal}) => {
  const columns = useMemo(
    () => [
      {
        id: 'teacher', //id used to define `group` column
        header: 'Teacher' ,
        columns: [
          {
            accessorFn: (row) => `${row.name}`, //accessorFn used to join multiple data into a single cell
            id: 'name', //id is still required when using accessorFn instead of accessorKey
            header: 'Name',
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
              <div style={{width: '30px', height: '30px', objectFit: 'contain', borderRadius: '50%' }}>
                <img
                  alt="avatar"
                  width={'100%'}
                  height={'100%'}
                  src={row.original.image? row.original.image : userIcon}
                  loading="lazy"
                  style={{borderRadius: '50%'}}
                />
              </div>
                {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: 'email', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Email',
            enableEditing: false,
            size: 300,
          },
          {
            accessorKey: 'isActive', //hey a simple column for once
            accessorFn: (row) => `${row.isActive? 'Active' : "Inactive"}`, //accessorFn used to join multiple data into a single cell
            header: 'Active Status',
            enableEditing: false,
            size: 100,
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue() === 'Active'
                      ? theme.palette.info.light
                      : "#808080",
                  borderRadius: '0.25rem',
                  color: '#fff',
                  maxWidth: '9ch',
                  p: '0.25rem',
                })}
              >
                {cell.getValue()}
              </Box>
            )
          },
        ],
      },
      {
        id: 'id',
        header: 'Job Info',
        columns: [
          {
            accessorKey: 'salary',
            enableHiding: true,
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            filterFn: 'between',
            header: 'Salary',
            size: 200,
            //custom conditional format and styling
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue() < 15000000
                      ? theme.palette.error.dark
                      : cell.getValue() >= 15000000 && cell.getValue() < 30000000
                        ? theme.palette.warning.dark
                        : theme.palette.success.dark,
                  borderRadius: '0.25rem',
                  color: '#fff',
                  maxWidth: '9ch',
                  p: '0.25rem',
                })}
              >
                { Number(cell.getValue())?.toLocaleString?.('en-US', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
                }
              </Box>
            ),
          },
          {
            accessorKey: 'department', //hey a simple column for once
            header: 'Department',
            size: 350,
          },
          {
            accessorKey: 'jobTitle', //hey a simple column for once
            header: 'Job Title',
            size: 350,
          },
          {
            accessorFn: (row) => new Date(row.startDate), //convert to Date for sorting and filtering
            id: 'startDate',
            header: 'Start Date',
            filterVariant: 'date',
            filterFn: 'lessThan',
            sortingFn: 'datetime',
            muiEditTextFieldProps: {
              type: 'date',
              required: true,
            },
            Cell: ({ cell }) => new Date(cell.getValue())?.toLocaleDateString(), //render Date as a string
            Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
            muiFilterTextFieldProps: {
              sx: {
                minWidth: '250px',
              },
            },
          },
        ],
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableEditing: true,
    editDisplayMode: 'modal', //default
    onEditingRowSave: async({ table, values }) => {
      //validate data
      //save data to api
      console.log(values)
      await updateTeacherDetail(values);

      table.setEditingRow(null); //exit editing mode
    },
    onEditingRowCancel: () => {
      //clear any validation errors
    },
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
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
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-around',
          left: '30px',
          maxWidth: '1000px',
          position: 'sticky',
          width: '100%',
        }}
      >
      <div style={{width: '150px', height: '150px', objectFit: 'contain', borderRadius: '50%' }}>
        <img
          alt="avatar"
          width='100%'
          height='100%'
          src={row.original.image? row.original.image : userIcon}
          loading="lazy"
          style={{ borderRadius: '50%'}}
        />
      </div>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4">Department:</Typography>
          <Typography variant="h1">
            {row.original.department}
          </Typography>
        </Box>
      </Box>
    ),
    renderRowActionMenuItems: ({ closeMenu }) => [
      <MenuItem
        key={0}
        onClick={() => {
          // View profile logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        View Profile
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          // Send email logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Send />
        </ListItemIcon>
        Send Email
      </MenuItem>,
    ],
    renderTopToolbar: ({ table }) => {
      const handleDeactivate = async() => {
        table.getSelectedRowModel().flatRows.map((row) => {
          updateActiveStatus(row.getValue('email'), false)
          toast.success('Deactivating ' + row.getValue('name'));
        });
      };

      const handleActivate = async() => {
        table.getSelectedRowModel().flatRows.map((row) => {
          updateActiveStatus(row.getValue('email'), true)
          toast.success('Activating ' + row.getValue('name'));
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
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                color="error"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleDeactivate}
                variant="contained"
              >
                Deactivate
              </Button>
              <Button
                color="success"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleActivate}
                variant="contained"
              >
                Activate
              </Button>
              <Button
                color="info"
                onClick={openModal}
                variant="contained"
              >
                Add New Teacher Account
              </Button>
            </Box>
          </Box>
        </Box>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const TeacherTable = ({data, openModal}) => (
  //App.tsx or AppProviders file
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div><Toaster position='top-right'/></div>
    <Table data={data} openModal={openModal}/>
  </LocalizationProvider>
);

export default TeacherTable;

// Table.propTypes = {
//   data: PropTypes.any,
// };
