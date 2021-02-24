import axios from 'axios';
import { useEffect, useState } from 'react';
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
    const [workorders, setWorkOrders] = useState([]);
    const [unassignedWorkOrders, setUnassigned] = useState([])
    const [assignedWorkOrders, setAssigned] = useState([])
    const [staffMembers, setStaffMembers] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState([]);
    const [toggleOverlay, setToggleOverlay] = useState([]);
    const [overlayData, setOverlayData] = useState([{
        overlayId: '',
        overlayName: '',
        overlayTitle: '',
        overlayDescription: '',
        overlayStatus: '',
        overlayDateCreated: '',
        overlayLastUpdated: '',
        overlayDateCompleted: ''
    }])

    const overlayOff = () => { document.getElementById('overlay').style.display = 'none' }
    const overlayOn = () => { document.getElementById('overlay').style.display = 'block' }

    const changeOverlay = (event) => {
        console.log('This is a row ')
        let id = event.target.parentNode.cells[0].textContent;
        let name = event.target.parentNode.cells[1].textContent;
        let title = event.target.parentNode.cells[2].textContent;
        let description = event.target.parentNode.cells[3].textContent;
        let status = event.target.parentNode.cells[4].textContent;
        let datecreated = event.target.parentNode.cells[5].textContent;
        let lastupdated = event.target.parentNode.cells[6].textContent;
        let datecompleted = event.target.parentNode.cells[7].textContent;
        setOverlayData({ overlayId: id, overlayName: name, overlayTitle: title, overlayDescription: description, overlayStatus: status, overlayDateCreated: datecreated, overlayLastUpdated: lastupdated, overlayDateCompleted: datecompleted });
        console.log(overlayData)
        overlayOn();
    }

    useEffect(() => {
        getWorkOrders();
        getStaffMembers();
    }, [])

    const getStaffMembers = async () => {
        await axios.get('/api/manager/staffmembers')
            .then(res => { setStaffMembers(res.data) })
    }

    const mapStaff = () => {
        if (staffMembers)
            setStaffOptions(staffMembers.map((member) => ({ value: member.id, label: `${member.lastname}, ${member.firstname}`, onClick: '{e => e.stopPropagation()}' })))
    }

    const getWorkOrders = async () => {
        await axios.get('/api/workorder/manager')
            .then(res => {
                setWorkOrders(res.data);
            })
    }

    const mapWorkOrders = () => {
        let unassignedFiltered, assignedFiltered;
        unassignedFiltered = workorders.filter((wo) => { return wo.status === 'Open' })
        assignedFiltered = workorders.filter((wo) => { return wo.status !== 'Open' })
        console.log('MAPPED: ', unassignedFiltered, assignedFiltered)
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

    return (
        <div>
            <div id='overlay' onClick={overlayOff}>
                <p>Work Order # : {overlayData.overlayId}   Tenant Name: {overlayData.overlayLastName}, {overlayData.overlayFirstName}  </p>
                <p> Title {overlayData.overlayTitle}</p>
                <p> Description: {overlayData.overlayDescription}</p>
                <p>  status, {overlayData.overlayStatus}</p>
                <p>  datecreated, {overlayData.overlayDateCreated}</p>
                <p>  lastupdated, {overlayData.overlayLastUpdated}</p>
                <p>  datecompleted {overlayData.overlayDateCompleted}</p>
            </div>
            <div className='tableWrapper'>
                <Table className='unassignedTable'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='right'>ID</StyledTableCell>
                            <StyledTableCell align='right'>Tenant</StyledTableCell>
                            <StyledTableCell align='right'>Title</StyledTableCell>
                            <StyledTableCell align='right'>Description</StyledTableCell>
                            <StyledTableCell align='right'>Status</StyledTableCell>
                            <StyledTableCell align='right'>Created</StyledTableCell>
                            <StyledTableCell align='right' width='100px'>Assign</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {unassignedWorkOrders.map((wo) => (
                            <StyledTableRow className='row' value={wo} onClick={changeOverlay}>
                                <StyledTableCell align='right' >{wo.id}</StyledTableCell>
                                <StyledTableCell align='right' >{wo.lastname},{wo.firstname}</StyledTableCell>
                                <StyledTableCell align='right' >{wo.title}</StyledTableCell>
                                <StyledTableCell align='right' >{wo.description}</StyledTableCell>
                                <StyledTableCell align='right' >{wo.status}</StyledTableCell>
                                <StyledTableCell align='right' >{wo.datecreated}</StyledTableCell>
                                <TableCell align="right" onClick={e => e.stopPropagation()}>{
                                    <div onClick={e => e.stopPropagation()}>Assign to <span onClick={e => e.stopPropagation()}>
                                        <Select

                                            name='staffoptions'
                                            id='staffoptions'
                                            value={selectedStaff}
                                            onClick={e => e.stopPropagation()}
                                            onChange={e => { handleSelectChange(e.value, wo.id) }}
                                            options={staffOptions} />
                                    </span></div>
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
                            <StyledTableCell align='right'>ID</StyledTableCell>
                            <StyledTableCell align='right'>Tenant</StyledTableCell>
                            <StyledTableCell align='right'>Title</StyledTableCell>
                            <StyledTableCell align='right'>Description</StyledTableCell>
                            <StyledTableCell align='right'>Status</StyledTableCell>
                            <StyledTableCell align='right'>Created</StyledTableCell>
                            <StyledTableCell align='right'>Last Updated</StyledTableCell>
                            <StyledTableCell align='right'>Completed</StyledTableCell>
                            <StyledTableCell align='right' width='100px'>Assigned To</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignedWorkOrders.map((wo) => (
                            <StyledTableRow key={wo.id}>
                                <StyledTableCell align='right'>{wo.id}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.lastname},{wo.firstname}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.title}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.description}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.status}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.datecreated}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.lastupdated ? wo.lastupdtated : '-'}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.datecompleted ? wo.datecompleted : '-'}</StyledTableCell>
                                <StyledTableCell align="right">{wo.stafffirst} {wo.stafflast}</StyledTableCell>
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
