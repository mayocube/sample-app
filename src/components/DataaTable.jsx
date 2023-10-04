import React, { useEffect, useState } from 'react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { Table } from '@mui/material'
const DataaTable = ({ data = [], columns }) => {
    const [sorting, setSorting] = useState([{ id: columns[0]?.accessorKey, desc: false }]);
    const [globalFilter, setGlobalFilter] = React.useState('');
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
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            globalFilter
        }

    })
    return (
        <>
            <DebouncedInput
                value={globalFilter ?? ''}
                onChange={value => setGlobalFilter(String(value))}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search all columns..."
            />
            <Table sx={{
                borderCollapse: 'separate',
                borderSpacing: '0 10px',
                backgroundColor: '#FAFAFA',
                border: '0px'
            }} responsive>
                <thead className='tableHead'>

                    {table?.getHeaderGroups().map(headerGroup => (
                        <tr key={`headerGroup_${headerGroup.id}`} className='tableRows'>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (

                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
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
                                            }
                                        </div>
                                    )}

                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className='tbody'>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className='tableRows'>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td className='align-middle py-2' key={cell.id}>
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
        </>
    )
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}
export default DataaTable