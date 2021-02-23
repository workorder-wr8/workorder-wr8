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
import Select from 'react-select';

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
    const [staffMembers, setStaffMembers] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState([]);
    
    useEffect(()=>{
        console.log(props)
        getWorkOrders();
        getStaffMembers();
    }, [])

    const getStaffMembers = async () => {
        await axios.get('/api/manager/staffmembers')
        .then(res=>{ setStaffMembers(res.data)})
    }

    const mapStaff = () => {
        if(staffMembers) 
            setStaffOptions(staffMembers.map((member)=>({value: member.id, label: `${member.lastname}, ${member.firstname}`})))
    }

    const getWorkOrders = async () => {
        await axios.get('/api/workorder/manager')
        .then(res=>{
            setWorkOrders(res.data);
        })
    }

    const mapWorkOrders = () => {
        let unassignedFiltered, assignedFiltered;
        unassignedFiltered = workorders.filter((wo)=>{
            return wo.status === 'open'})
        assignedFiltered = workorders.filter((wo)=>{return wo.status!=='open'})
        setUnassigned(unassignedFiltered);
        setAssigned(assignedFiltered);
    } 

    const handleSelectChange = async (staffid, id) => {
        await axios.put(`/api/manager/workorders`, { id, staffid })
            .then(res => {
                getWorkOrders();
            })
            .catch(err => console.log(err))
    }

    useEffect(mapWorkOrders, [workorders]);
    useEffect(mapStaff, [staffMembers]);

    console.log('BEFORE RETURN: ', staffOptions)
    return (
        <div>
            ManagerDash
            <div className='tableWrapper'>
                <Table className='unassignedTable'>
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
                            <StyledTableCell align='right' width='100px'>Assign</StyledTableCell>
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
                                <TableCell align="right">{
                                    <div >Assign to <span>
                                            <Select 
                                            name='staffoptions' 
                                            id='staffoptions'
                                             value={selectedStaff} 
                                             onChange={e => handleSelectChange(e.value, wo.id)} 
                                             options={staffOptions} />
                                    }</span></div>
                                }</TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className='tableWrapper'>
                <Table className='assignedTable'>
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
                            <StyledTableCell align='right' width='100px'>Assigned To</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignedWorkOrders.map((wo)=>(
                            <StyledTableRow key={wo.id}>
                                <StyledTableCell align='right'>{wo.id}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.lastname},{wo.firstname}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.title}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.description}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.status}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.datecreated}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.lastupdated? wo.lastupdtated : '-'}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.datecompleted? wo.dateCompleted : '-'}</StyledTableCell>
                                <StyledTableCell align="right">{wo.staffid}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
        </div>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(ManagerDash)
