import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react'
import { connect } from 'react-redux'
import './ManagerDash.css';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Select from 'react-select';
import dayjs from 'dayjs'

// USES withStyles from material-UI for table cells and rows
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    }
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
    const [changeAssigned, setChangeAssigned] = useState(false)
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

    const overlayOff = () => { document.getElementById('managerOverlay').style.display = 'none' }
    const overlayOn = () => { document.getElementById('managerOverlay').style.display = 'flex' }

    const changeOverlay = (event) => {
        let id = event.target.parentNode.cells[0].textContent;
        let name = event.target.parentNode.cells[1].textContent;
        let title = event.target.parentNode.cells[2].textContent;
        let description = event.target.parentNode.cells[3].textContent;
        let status = event.target.parentNode.cells[4].textContent;
        let datecreated = event.target.parentNode.cells[5].textContent;
        let lastupdated = event.target.parentNode.cells[6].textContent;
        let datecompleted = event.target.parentNode.cells[7].textContent;
        setOverlayData({ overlayId: id, overlayName: name, overlayTitle: title, overlayDescription: description, overlayStatus: status, overlayDateCreated: datecreated, overlayLastUpdated: lastupdated, overlayDateCompleted: datecompleted });
        overlayOn();
    }

    useEffect(() => {
        getWorkOrders();
        getStaffMembers();
    }, [selectedStaff])

    const getStaffMembers = async () => {
        await axios.get('/api/manager/staffmembers')
            .then(res => { setStaffMembers(res.data) })
    }

    const mapStaff = () => {
        if (staffMembers)
            setStaffOptions(staffMembers.map((member) => ({ value: member.id, label: `${member.lastname}, ${member.firstname}` })))
    }

    const getWorkOrders = async () => {
        await axios.get('/api/workorder/manager')
            .then(res => {
                setWorkOrders(res.data);
                setChangeAssigned(false)
            })
    }

    const changeAssignedStaff = (e) => {
        e.stopPropagation()
        setChangeAssigned(!changeAssigned)
    }

    const mapWorkOrders = () => {
        let unassignedFiltered, assignedFiltered;
        unassignedFiltered = workorders.filter((wo) => { return wo.status === 'Open' })
        assignedFiltered = workorders.filter((wo) => { return wo.status !== 'Open' })
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
            <div id='managerOverlay' onClick={overlayOff}>
                <div id='managerOverlayInfo'>
                    <p>Work Order #{overlayData.overlayId}   Tenant Name: {overlayData.overlayName}  </p>
                    <p> Title: {overlayData.overlayTitle}</p>
                    <p> Description: {overlayData.overlayDescription}</p>
                    <p>  Status: {overlayData.overlayStatus}</p>
                    <p>  Date Created: {overlayData.overlayDateCreated}</p>
                    <p>  Last Updated: {overlayData.overlayLastUpdated}</p>
                    <p>  Date Completed: {overlayData.overlayDateCompleted}</p>
                </div>
                <div id='managerOverlayMessages'>
                    Messages Placeholder
                </div>
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
                        {unassignedWorkOrders.map(wo => (
                            <StyledTableRow className='row' key={wo.id} value={wo} onClick={changeOverlay}>
                                <StyledTableCell align='right' >{wo.id}</StyledTableCell>
                                <StyledTableCell align='right' >{wo.lastname},{wo.firstname}</StyledTableCell>
                                <StyledTableCell align='right' >{wo.title}</StyledTableCell>
                                <StyledTableCell align='right' >{wo.description}</StyledTableCell>
                                <StyledTableCell align='right' >{wo.status}</StyledTableCell>
                                <StyledTableCell align='right' >{dayjs(wo.datecreated).format('MMMM D, YYYY h:mm A')}</StyledTableCell>
                                <StyledTableCell align="right" onClick={e => e.stopPropagation()}>{
                                    <div onClick={e => e.stopPropagation()}>Assign to <span onClick={e => e.stopPropagation()}>
                                        <Select
                                            name='staffoptions'
                                            id='staffoptions'
                                            value={selectedStaff}
                                            onClick={e => e.stopPropagation()}
                                            onChange={e => { handleSelectChange(e.value, wo.id) }}
                                            options={staffOptions} />
                                    </span></div>
                                }</StyledTableCell>
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
                        {assignedWorkOrders.map(wo => (
                            <StyledTableRow key={wo.id} value={wo} onClick={changeOverlay}>
                                <StyledTableCell align='right'>{wo.id}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.lastname},{wo.firstname}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.title}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.description}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.status}</StyledTableCell>
                                <StyledTableCell align='right'>{dayjs(wo.datecreated).format('MMMM D, YYYY h:mm A')}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.lastupdated ? dayjs(wo.lastupdated).format('MMMM D, YYYY h:mm A') : '-'}</StyledTableCell>
                                <StyledTableCell align='right'>{wo.datecompleted ? dayjs(wo.datecompleted).format('MMMM D, YYYY h:mm A') : '-'}</StyledTableCell>
                                {!changeAssigned ? (
                                    <StyledTableCell align="right">{wo.stafffirst} {wo.stafflast}
                                        <br /><div className='changeStaffBtn' onClick={changeAssignedStaff}>Change</div>
                                    </StyledTableCell>
                                ) : (
                                        <StyledTableCell align="right" onClick={e => e.stopPropagation()}>
                                            <div onClick={e => e.stopPropagation()}>Assign to <span onClick={e => e.stopPropagation()}>
                                                <Select
                                                    name='staffoptions'
                                                    id='staffoptions'
                                                    placeholder={wo.stafffirst}
                                                    value={selectedStaff}
                                                    onClick={e => e.stopPropagation()}
                                                    onChange={e => { handleSelectChange(e.value, wo.id) }}
                                                    options={staffOptions} />
                                            </span>
                                                <div className='changeStaffBtn' onClick={changeAssignedStaff}>Don't Change</div>
                                            </div>
                                        </StyledTableCell>
                                    )}
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
