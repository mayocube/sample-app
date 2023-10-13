import React, { useEffect, useState } from 'react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { Box, Button, Table } from '@mui/material'
const DataTable = ({ data = [], columns, formData }) => {
    const [sorting, setSorting] = useState([{ id: columns[0]?.accessorKey, desc: false }]);
    const [refresh, setRefresh] = useState(data)

    useEffect(() => {
        setRefresh(data)
    }, [refresh])
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
        }
    })

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
                                            {
                                                header.column.getIsSorted() === 'asc' ?
                                                    <span>▲</span>
                                                    :
                                                    header.column.getIsSorted() === 'desc' ?
                                                        <span >▼</span>
                                                        : header.column.getCanSort() ?
                                                            <span></span> :
                                                            null
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
                <tbody className='tbody' style={{ fontFamily: "calibri" }}>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className='tableRows'>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td className='align-middle py-2 ' key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>

            </Table >
            <Box sx={{ display: "flex", justifyContent: "end", margin: "20px 0" }}>
                <div className={!table.getCanPreviousPage() && "disabled displayNone"}>
                    <button
                        onClick={e => { e.preventDefault(); table.previousPage(); }}
                        tabIndex="-1"
                        disabled={!table.getCanPreviousPage()}
                        className='pagiantionBtb'
                    >
                        {/* <i className="fa fa-angle-left" />
                                 */}
                        <div>
                            {'ᐸ PREVIOUS'}
                        </div>
                    </button>
                </div>
                <Box sx={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}><span className='ml-2'> <span className="paginationDarkColor">
                    {(table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1} - {(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize > data.length ? data.length : (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize}</span> <span className="paginationGrayColor">of {data.length}</span> </span></Box>


                <Box className={!table.getCanNextPage() && "disabled displayNone"}>
                    <button
                        onClick={e => { e.preventDefault(); table.nextPage(); }}
                        tabIndex="-1"
                        disabled={!table.getCanNextPage()}
                        className='pagiantionBtb'
                    >
                        {'NEXT ᐳ'}
                    </button>
                </Box>
            </Box >
        </>
    )
}

const Filter = ({ column, value }) => {
    useEffect(() => {
        column.setFilterValue(value[column.id])
        console.log(column);
    }, [value])

    return (
        <input
            type="text"
            style={{ display: "none" }}
            value={value[column.id]}
            onChange={() => column.setFilterValue(value[column.id])}
        />
    )

}
export default DataTable