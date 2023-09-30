import React, { useEffect, useState } from 'react';
import {
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    styled,
    Checkbox, // Import Checkbox from MUI
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const Root = styled('div')({
    padding: (theme) => theme.spacing(2),
});

const TableContainerStyled = styled(TableContainer)({
    minHeight: 'auto',
});

const PaginationContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
});

const PaginationText = styled('span')({
    marginLeft: (theme) => theme.spacing(2),
    marginRight: (theme) => theme.spacing(2),
});

function DataTable({ title, columns, data = [], formData }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [selected, setSelected] = useState([]); // State to track selected items

    let [filteredData, setFilteredData] = useState(data);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setSelected([]); // Reset selected items when changing page
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setSelected([]); // Reset selected items when changing rows per page
    };

    useEffect(() => {
        const { priority, brand, status, age } = formData;
        let filtered = data;
        if (priority !== "") {
            filtered = filtered.filter((item) => item.priority === priority);
        }
        if (brand !== "") {
            filtered = filtered.filter((item) => item.brand === brand);
        }
        if (status !== "") {
            filtered = filtered.filter((item) => item.status === status);
        }
        if (age !== "") {
            filtered = filtered.filter((item) => item.age === age);
        }

        setFilteredData(filtered);
    }, [formData, data, filteredData]);

    // Function to handle checkbox selection
    const handleCheckboxChange = (event, itemId) => {
        if (event.target.checked) {
            setSelected([...selected, itemId]);
        } else {
            setSelected(selected.filter((id) => id !== itemId));
        }
    };

    // Function to handle header checkbox selection (selects all items)
    const handleHeaderCheckboxChange = (event) => {
        if (event.target.checked) {
            const allItemIds = filteredData.map((item) => item.id);
            setSelected(allItemIds);
        } else {
            setSelected([]);
        }
    };

    // Function to check if a specific item is selected
    const isItemSelected = (itemId) => selected.indexOf(itemId) !== -1;

    // Function to check if all items are selected
    const isAllSelected = () => selected.length === filteredData.length;

    return (
        <Root>
            <TableContainerStyled component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Checkbox
                                    checked={isAllSelected()}
                                    onChange={handleHeaderCheckboxChange}
                                />
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell key={column.id}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={isItemSelected(row.id)}
                                        onChange={(event) =>
                                            handleCheckboxChange(event, row.id)
                                        }
                                    />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        {row[column.accessor]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainerStyled>
            <PaginationContainer sx={{ marginTop: 2 }}>
                <FormControl variant="outlined" size="small">
                    <InputLabel>Show</InputLabel>
                    <Select
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        label="Show"
                    >
                        {[100, 250, 500].map((pageSize) => (
                            <MenuItem key={pageSize} value={pageSize}>
                                {pageSize}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <PaginationText>
                    Showing {page * rowsPerPage + 1} to{' '}
                    {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{' '}
                    {filteredData.length} entries
                </PaginationText>
                <div>
                    <IconButton
                        onClick={() => handleChangePage(null, page - 1)}
                        disabled={page === 0}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleChangePage(null, page + 1)}
                        disabled={
                            page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                        }
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </div>
            </PaginationContainer>
        </Root>
    );
}

export default DataTable;
