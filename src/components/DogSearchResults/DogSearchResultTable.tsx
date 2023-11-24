// import { TableContainer, TableHead, TableRow } from "@mui/material";


// export default function DogSearchResultTable() {
//     const columns = [
//     ]

//     return (<TableContainer><TableHead>
//         <TableRow></TableRow>
//         </TableHead></TableContainer>);
// }

import { Dog } from '../../api/shared/interfaces';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { Box, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

    type Order = 'asc' | 'desc';




export default function DogSearchResultTable(props: dogSearchProps) {


  const headCells: readonly HeadCells[] = [
    {
      id: 'name',
      disablePadding: true,
      sortable: true,
      numeric: false,
      label: 'Name',
      size: 'small',
    },
    {
      id: 'img',
      disablePadding: false,
      sortable: false,
      numeric: false,
      label: 'Image',
      size: 'small',
    },
    {
      id: 'age',
      disablePadding: false,
      sortable: true,
      numeric: true,
      label: 'Age',
      size: 'small',
    },
    {
      id: 'zip_code',
      disablePadding: false,
      sortable: true,
      numeric: false,
      label: 'ZIP Code',
      size: 'medium',
    },
    {
      id: 'breed',
      disablePadding: false,
      sortable: true,
      numeric: false,
      label: 'Breed',
      size: 'medium',
    },
  ];

/**
 * Mostly based on the header from the MUI material demo since it fulfilled my needs.
 * @param props 
 * @returns 
 */
function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof Dog) => (event: React.MouseEvent<unknown>) => {
          onRequestSort(event, property);
        };

    

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function GetHeaderCells(props: EnhancedTableProps) {

}

function DogTableRow() : any {
  return 
}

    return (<Table>
      <EnhancedTableHead onRequestSort={function (event: MouseEvent<unknown>, property: keyof Dog): void {
        throw new Error('Function not implemented.');
      } } order={'asc'} orderBy={''} rowCount={0} numSelected={0} enableSelection={false} />
    </Table>)
}

interface dogSearchProps {
    gridStyle: React.CSSProperties;
    containerStyle: React.CSSProperties;
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Dog) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  enableSelection: boolean;
}

interface HeadCells {
  disablePadding: boolean;
  id: keyof Dog;
  label: string;
  sortable: boolean;
  numeric: boolean;
  size?: 'medium' | 'small';
}


function ImageLinkAndAnchorRenderer(rowData: Dog): HTMLElement {
  throw new Error('Function not implemented.');
}
