import axios from 'axios';
import {useEffect, useState} from 'react';
import React from 'react'
import { connect } from 'react-redux'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// USES withStyles from material-UI for table cells and rows
const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

 function ManagerDash(props) {
    const [workorders,setWorkOrders] = useState([]);
    const [unassignedWorkOrders, setUnassigned] = useState([])
    const [assignedWorkOrders, setAssigned] = useState([])
    
    useEffect(()=>{
        console.log(props)
        getWorkOrders();
    }, [])

    const getWorkOrders = async () => {
        await axios.get('/api/workorder/manager')
        .then(res=>{
            setWorkOrders(res.data);
        })
    }

    const mapWorkOrders = () => {
        console.log('MAPPING ZE VERK ORDAHS: ', workorders)
        let unassignedFiltered, assignedFiltered;
        unassignedFiltered = workorders.filter((wo)=>{return wo.status === 'open'})
        // .map((wo)=>(
        //     <div className='workOrder'>
        //         <div>{wo.firstname}</div>
        //         <div>{wo.lastname}</div>
        //         <div>{wo?.title}</div>
        //         <div>{wo?.description}</div>
        //     </div>
        // ))
        assignedFiltered = workorders.filter((wo)=>{return wo.status!=='open'})
        console.log('unassignedFiltered: ', unassignedFiltered);
        setUnassigned(unassignedFiltered);
        setAssigned(assignedFiltered);
    } 



    useEffect(mapWorkOrders, [workorders]);

    console.log('BEFORE RETURN: ', workorders.length, unassignedWorkOrders)
    return (
        <div>
            ManagerDash
            <div className='tableWrapper'>
                <Table className='managerTable'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='right'>Word Order ID</StyledTableCell>
                            <StyledTableCell align='right'>Tenant</StyledTableCell>
                            <StyledTableCell align='right'>Title</StyledTableCell>
                            <StyledTableCell align='right'>Description</StyledTableCell>
                            <StyledTableCell align='right'>Status</StyledTableCell>
                            <StyledTableCell align='right'>Created</StyledTableCell>
                            <StyledTableCell align='right'>Last Update</StyledTableCell>
                            <StyledTableCell align='right'>Completed</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {unassignedWorkOrders.map((wo)=>(
                            <StyledTableRow key={wo.id}>
                                <StyledTableCell align='right'>{wo.id}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.lastname},{wo.firstname}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.title}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.description}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.status}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.datecreated}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.lastupdated? wo.lastupdtated : '-'}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.datecompleted? wo.dateCompleted : '-'}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
            <div className='unassignedWorkOrders'>
                {/* {unassignedWorkOrders} */}
            </div>
            <div className='assignedWorkOrders'>
                {assignedWorkOrders}
            </div>
        </div>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(ManagerDash)
