import React, { useEffect, useState } from 'react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table'
import { Box, CircularProgress, Table, Typography } from '@mui/material'
import { ArrowDownward, ArrowUpward, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { filterAge, isWithinRange } from '../utils/globalFunctions';

const DataTable = ({ data = [], columns, formData, isLoading = false, resetData = false, handleReset, rowId, emailDetails = null, getSelectedRows = () => {} }) => {
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
        pageSize: 5
      }
    },
    state: {
      sorting
    },
    filterFns: {
      'isWithinRange': isWithinRange,
      'filterAge': filterAge
    }
  })

  useEffect(() => {
    getSelectedRows(table?.getSelectedRowModel()?.rows.map(x => x.original));
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
      }}>
        <thead className='tableHead'>
          {table?.getHeaderGroups().map(headerGroup => (
            <tr key={`headerGroup_${headerGroup.id}`} className='tableRows'>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <>
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
                      {header.column.columnDef.accessorKey === 'age' &&
                        <Typography
                          sx={{
                            display: 'block',
                            fontSize: 14,
                            pl: '24px'
                          }}
                          component={'span'}
                        >
                          H:M
                        </Typography>
                      }
                    </>
                  )}

                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='tbody' style={{ fontFamily: "Inter" }}>
          {
            !isLoading && table.getFilteredRowModel().rows.length === 0 && (
              <tr><td colSpan={20} style={{ textAlign: "center", color: "#bd1721" }}>No records found. Try resetting filters.</td></tr>
            )
          }
          {
            isLoading && (
              <tr><td colSpan={20} style={{ textAlign: "center" }}><CircularProgress /></td></tr>
            )
          }
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
                        {emailDetails ?
                          <>
                            {emailDetails !== "NONE" ?
                              <>
                                <Typography className='accordion_body_main'>Email Address: {emailDetails?.from?.address}</Typography>
                                <div className='accordion_body_text' dangerouslySetInnerHTML={{ __html: emailDetails?.body }}></div>
                              </>
                              :
                              <div style={{ color: 'red' }}>Unable to retrieve email content.</div>
                            }
                          </>
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
        </tbody>
      </Table>
      {table.getFilteredRowModel().rows.length !== 0 &&
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
          <Box sx={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className='ml-2'>
              <span className="paginationDarkColor">
                {(table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1}-{(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize > table.getFilteredRowModel().rows.length ? table.getFilteredRowModel().rows.length : (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize}
              </span>
              <span className="paginationGrayColor"> of {table.getFilteredRowModel().rows.length}</span>
            </span>
          </Box>

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
      }
    </>
  )
}

const Filter = ({ column, value }) => {
  useEffect(() => {
    if (column.id === 'agent') {
      column.setFilterValue(value[column.id]?.fullName)
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