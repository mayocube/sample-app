import React, { useEffect, useState } from 'react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table'
import { Box, CircularProgress, Table, Typography } from '@mui/material'
import { ArrowDownward, ArrowUpward, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const DataTable = ({ data = [], columns, formData, resetData = false, handleReset, rowId, brandDetails = [], getSelectedRows }) => {
    const [sorting, setSorting] = useState([{ id: columns[0]?.accessorKey, desc: false }]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 20
            }
        },
        state: {
            sorting
        },
    })

    useEffect(() => {
        getSelectedRows(table?.getSelectedRowModel()?.rows.map(x => x.original).map(x => x.taskSid));
    }, [table?.getSelectedRowModel()])

    useEffect(() => {
        if (resetData) {
            table.reset();
            handleReset();
        }
    }, [resetData])

    useEffect(() => {
        table?.resetRowSelection();
    }, [data])

    return (
        <>
            <Table sx={{
                borderCollapse: 'separate',
                borderSpacing: '0 10px',
                backgroundColor: '#FAFAFA',
                border: '0px'
            }} >
                <thead className='tableHead'>
                    {table?.getHeaderGroups().map(headerGroup => (
                        <tr key={`headerGroup_${headerGroup.id}`} className='tableRows'>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (

                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none fontBold'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.columnDef.accessorKey !== 'checkbox' && (
                                                header.column.getIsSorted() === 'asc' ?
                                                    <ArrowUpward sx={{ ml: '16px', fontSize: '16px' }} />
                                                    :
                                                    header.column.getIsSorted() === 'desc' ?
                                                        <ArrowDownward sx={{ ml: '16px', fontSize: '16px' }} />
                                                        :
                                                        null
                                            )
                                            } {header.column.getCanFilter() ? (
                                                <Filter column={header?.column} value={formData} />
                                            ) : null}

                                        </div>
                                    )}

                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className='tbody' style={{ fontFamily: "Inter" }}>
                    {table.getRowModel().rows.map(row => (
                        <>
                            <tr key={row.id} className='tableRows'>
                                {row.getVisibleCells().map(cell => (
                                    <>
                                        <td className='align-middle py-2 ' key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>

                                    </>
                                )
                                )}
                            </tr>
                            {(rowId && rowId === row.id) &&
                                <tr className='tableRows accordion_row'>
                                    {row.getVisibleCells().filter(cell => (rowId === cell.row.id && cell.column.columnDef.accessorKey === 'brand'))[0] ?
                                        <>
                                            <td></td>
                                            <td colSpan={7}>
                                                {brandDetails?.length > 0 ?
                                                    brandDetails?.map(x => (
                                                        <>
                                                            <Typography className='accordion_body_main'>Email Address: {x?.customerEmailId} | Telephone: 212-293-1231</Typography>
                                                            <div className='accordion_body_text' dangerouslySetInnerHTML={{ __html: x?.emailBody }}></div>
                                                        </>
                                                    ))
                                                    :
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <CircularProgress color="dark" size={25} />
                                                    </Box>
                                                }
                                            </td>
                                        </>
                                        : null
                                    }
                                </tr>
                            }
                        </>
                    )
                    )}
                </tbody >

            </Table >
            <Box sx={{ display: "flex", justifyContent: "end", alignItems: 'center', margin: "20px 0" }}>
                <div className={!table.getCanPreviousPage() && "disabled displayNone"}>
                    <button
                        onClick={e => { e.preventDefault(); table.previousPage(); }}
                        tabIndex="-1"
                        disabled={!table.getCanPreviousPage()}
                        className='paginationBtn'
                    >
                        <KeyboardArrowLeft /> PREVIOUS
                    </button>
                </div>
                <Box sx={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}><span className='ml-2'> <span className="paginationDarkColor">
                    {(table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1}-{(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize > data.length ? data.length : (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize}</span> <span className="paginationGrayColor">of {data.length}</span> </span></Box>


                <Box className={!table.getCanNextPage() && "disabled displayNone"}>
                    <button
                        onClick={e => { e.preventDefault(); table.nextPage(); }}
                        tabIndex="-1"
                        disabled={!table.getCanNextPage()}
                        className='paginationBtn'
                    >
                        NEXT <KeyboardArrowRight />
                    </button>
                </Box>
            </Box >
        </>
    )
}

const Filter = ({ column, value }) => {
    useEffect(() => {
        if (column.id === 'agent') {
            column.setFilterValue(value[column.id]?.agentName)
        } else {
            column.setFilterValue(value[column.id]);
        }
    }, [value])

    return (
        <>
            <input
                type="text"
                style={{ display: "none" }}
                value={column.getFilterValue()}
                onChange={() => column.setFilterValue(value[column.id])}
            />
        </>
    )

}
export default DataTable