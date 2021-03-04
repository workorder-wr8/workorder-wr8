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
import Paper from '@material-ui/core/Paper';
import Select from 'react-select';
import dayjs from 'dayjs'
import SpinnerContainer from '../Spinner/SpinnerContainer';
import './ManagerDash.css';
import { Autocomplete } from '@material-ui/lab';
// USES withStyles from material-UI for table cells and rows


const StyledTableCell = withStyles((theme) => ({
    root: {
        width: 100,
        height: 50,
        padding: '10px'
    }
}))(TableCell);

const StyledDescriptionCell = withStyles((theme) => ({
    root: {
        width: 'auto'
    }
}))(TableCell)

const StyledAssignmentCell = withStyles((theme) => ({
    root: {
        width: '150px'
    }
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
    root: {
        height: 'min-content',
    },
}))(TableRow);

const StyledTableContainer = withStyles((theme)=> ({
    root: {
        height: 'min-content',
        width: 'max-content',
        marginTop: '10px',
        maxWidth: '80%',
        margin: '0 auto',
        maxHeight: '600px',
    }
}))(TableContainer)

function ManagerDash(props) {
    const [workorders, setWorkOrders] = useState([]);
    const [unassignedWorkOrders, setUnassigned] = useState([])
    const [assignedWorkOrders, setAssigned] = useState([])
    const [staffMembers, setStaffMembers] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState([]);
    const [changeAssigned, setChangeAssigned] = useState([-1])
    const [toggleOverlay, setToggleOverlay] = useState([]);
    const [messages, setMessages] = useState([])
    const [overlayData, setOverlayData] = useState([{
        overlayId: '',
        overlayName: '',
        overlayTitle: '',
        overlayDescription: '',
        overlayStatus: '',
        overlayDateCreated: '',
        overlayLastUpdated: '',
        overlayDateCompleted: '',
        overlayMessageinput: ''
    }])
    const [overlayMessages, setOverlayMessages] = useState([])
    const [isLoading, setLoading] = useState(true);

    const addMessage = (id, content) => {
        axios.put('/api/messages/manager/create', { id, content })
            .then(() => {
                setOverlayData({ ...overlayData, overlayMessageInput: '' });
                getMessages(id);
            })
            .catch(err => console.log(err))
    }

    const getMessages = async (id) => {
        await axios.get(`/api/messages/manager/${id}`)
            .then(res => {
                setMessages(res.data)
            })
            .catch(err => console.log(err))
    }

    const mapMessages = () => {
        let mappedMessages = messages.map(message => {
            if (message.managerid === props.user.managerid) {
                return <div className='managerSelfMessage' key={message.messageid}>
                    <div className='messageInfo'>{message.managerlastname}, {message.managerfirstname} :: {message.timesent}</div>
                    <p>{message.content}</p>
                </div>
            } else if (message.managerid) {
                return <div className='managerOtherMessage' >
                    <div className='messageInfo'>{message.managerlastname}, {message.managerfirstname} :: {message.timesent}</div>
                    <p>{message.content}</p>
                </div>
            } else if (message.staffid) {
                return <div className='staffMessage' >
                    <div className='messageInfo'>{message.stafflastname},  {message.stafffirstname}:: {message.timesent}</div>
                    <p>{message.content}</p>
                </div>
            } else if (message.tenantid) {
                return <div className='tenantMessage' >
                    <div className='messageInfo'>{message.tenantlastname}, {message.tenantfirstname} :: {message.timesent}</div>
                    <p>{message.content}</p>
                </div>
            }
        })
        setOverlayMessages(<div>{mappedMessages}</div>)
    }

    useEffect(mapMessages, [messages])

    const overlayOff = () => { document.getElementById('managerOverlay').style.display = 'none' }
    const overlayOn = () => { document.getElementById('managerOverlay').style.display = 'flex' }

    const changeOverlay = (event) => {
        console.log('OVERLAY: ', event.target.parentNode.cells)
        let id = event.target.parentNode.cells[0].textContent;
        let name = event.target.parentNode.cells[1].textContent;
        let title = event.target.parentNode.cells[2].textContent;
        let description = event.target.parentNode.cells[3].id;
        let status = event.target.parentNode.cells[4].textContent;
        let datecreated = event.target.parentNode.cells[5].textContent;
        let lastupdated, datecompleted;
        if (event.target.parentNode.cells[7]) {
            lastupdated = event.target.parentNode.cells[6].textContent;
            datecompleted = event.target.parentNode.cells[7].textContent;
        }

        getMessages(id);

        setOverlayData({ ...overlayData, overlayId: id, overlayName: name, overlayTitle: title, overlayDescription: description, overlayStatus: status, overlayDateCreated: datecreated, overlayLastUpdated: lastupdated, overlayDateCompleted: datecompleted });
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
                setChangeAssigned(-1);
                setLoading(false);
            })
    }

    const changeAssignedStaff = ( index) => {
        console.log('THIS IS THE EVENT', index)
        setChangeAssigned(index)
        console.log(changeAssigned)
    }

    const mapWorkOrders = () => {
        let unassignedFiltered, assignedFiltered;
        unassignedFiltered = workorders.filter((wo) => { return wo.status === 'Open' })
        assignedFiltered = workorders.filter((wo) => { return wo.status !== 'Open' })
        setUnassigned(unassignedFiltered);
        setAssigned(assignedFiltered);
    }

    let columnHeads = [
        { id: 'ID#', label: 'ID#' },
        { id: 'name', label: 'Name' },
        { id: 'title', label: 'Title' },
        { id: 'description', label: 'Description' },
        { id: 'dateCreated', label: 'Date Created' },
        { id: 'lastUpdated', label: 'Last Updated' },
        { id: 'status', label: 'Status', disableSorting: true },
        { id: 'action', label: 'Action', disableSorting: true }
    ]

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
        <div className='managerDash'>
            <div id='managerOverlay' onClick={overlayOff} >
                <div id='managerOverlayInfo'>
                    <div id='managerOverlayInfoBox'>
                        <div>Work Order #{overlayData.overlayId} </div>
                        <div>Tenant Name: {overlayData.overlayName}</div>  
                        <div>Title: {overlayData.overlayTitle}</div> 
                        <div>Status: {overlayData.overlayStatus}</div>
                    </div>
                    <div className='overlayDescription'>
                        <div id='descriptionTitle'>Description: </div>
                        <div>{overlayData.overlayDescription}</div>
                    </div>
                    <div id='overlayTimes'>
                        <div>  Date Created: {dayjs(overlayData.datecreated).format('MMMM D, YYYY h:mm A')}</div>
                        <div>  Last Updated: {dayjs(overlayData.overlayLastUpdated).format('MMMM D, YYYY h:mm A')}</div>
                    </div>
                    <div id='managerOverlayLoadedMessages'  onClick={e => e.stopPropagation()}>
                        {overlayMessages}
                    </div>
                    <form onSubmit={e => { addMessage(overlayData.overlayId, overlayData.overlayMessageInput) }} onClick={e => e.stopPropagation()}>
                        <input type='text' onClick={e => e.stopPropagation()} onChange={e => setOverlayData({ ...overlayData, overlayMessageInput: e.target.value })} value={overlayData.overlayMessageInput} />
                        <input type='button' onClick={e => { addMessage(overlayData.overlayId, overlayData.overlayMessageInput) }} value='Send'></input>
                    </form>
                </div>
            </div>
            {isLoading
                ? <SpinnerContainer />
                : <>
                    <div className='tableWrapper unassignedTable' >
                    {unassignedWorkOrders[0] ? <StyledTableContainer component={Paper}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align='right'>ID</StyledTableCell>
                                        <StyledTableCell align='right'>Tenant</StyledTableCell>
                                        <StyledTableCell align='right'>Title</StyledTableCell>
                                        <StyledDescriptionCell align='right'>Description</StyledDescriptionCell>
                                        <StyledTableCell align='right'>Status</StyledTableCell>
                                        <StyledTableCell align='right'>Created</StyledTableCell>
                                        <StyledTableCell align='right' width='100px'>Assign</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {unassignedWorkOrders.map(wo => (
                                        <StyledTableRow className='row' key={wo.id} value={wo} onClick={changeOverlay} className='unassignedRow'>
                                            <StyledTableCell align='right' className='unassignedCell'>{wo.id}</StyledTableCell>
                                            <StyledTableCell align='right' className='unassignedCell'>{wo.tenantlast},{wo.tenantfirst}</StyledTableCell>
                                            <StyledTableCell align='right' className='unassignedCell'>{wo.title}</StyledTableCell>
                                            <StyledDescriptionCell align='right' className='unassignedCell descriptionCell' id={wo.description}>{wo.description.length > 100 ? wo.description.substring(0, 80).concat('...') : wo.description}</StyledDescriptionCell>
                                            <StyledTableCell align='right' className='unassignedCell'>{wo.status}</StyledTableCell>
                                            <StyledTableCell align='right' className='unassignedCell'>{dayjs(wo.datecreated).format('MMMM D, YYYY h:mm A')}</StyledTableCell>
                                            <TableCell align="right" onClick={e => e.stopPropagation()} >{
                                                <div onClick={e => {e.stopPropagation()}}><span onClick={e => e.stopPropagation()}>
                                                    <Select
                                                        name='staffoptions'
                                                        id='staffoptions'
                                                        menu-outer-top
                                                        value={selectedStaff}
                                                        onClick={e => e.stopPropagation()}
                                                        onChange={e => { handleSelectChange(e.value, wo.id) }}
                                                        options={staffOptions} />
                                                </span></div>
                                            }</TableCell>
                                        </StyledTableRow>
                                    ))}
                                    <StyledTableRow  key={'end'} className='extrarow unassignedRow'>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledDescriptionCell align='right'>End Of Work Orders</StyledDescriptionCell>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            </Table>
                         </StyledTableContainer> : <></>}          
                    </div>
                    <div className='tableWrapper assignedTable'>
                        {assignedWorkOrders[0] ? <StyledTableContainer component={Paper}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align='right'>ID</StyledTableCell>
                                        <StyledTableCell align='right'>Tenant</StyledTableCell>
                                        <StyledTableCell align='right'>Title</StyledTableCell>
                                        <StyledDescriptionCell align='right'>Description</StyledDescriptionCell>
                                        <StyledTableCell align='right'>Status</StyledTableCell>
                                        <StyledTableCell align='right'>Created</StyledTableCell>
                                        <StyledTableCell align='right'>Last Updated</StyledTableCell>
                                        <StyledTableCell align='right'>Completed</StyledTableCell>
                                        <StyledAssignmentCell align='right' width='100px'>Assigned To</StyledAssignmentCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assignedWorkOrders.map(wo => (
                                        <StyledTableRow key={wo.id} value={wo} onClick={changeOverlay} className='assignedRow'>
                                            <StyledTableCell align='right'>{wo.id}</StyledTableCell>
                                            <StyledTableCell align='right' >{wo.tenantlast},{wo.tenantfirst}</StyledTableCell>
                                            <StyledTableCell align='right'>{wo.title}</StyledTableCell>
                                            <StyledDescriptionCell align='right' className='unassignedCell descriptionCell' id={wo.description}>{wo.description.length > 100 ? wo.description.substring(0, 80).concat('...') : wo.description}</StyledDescriptionCell>
                                            <StyledTableCell align='right'>{wo.status}</StyledTableCell>
                                            <StyledTableCell align='right'>{dayjs(wo.datecreated).format('MMMM D, YYYY h:mm A')}</StyledTableCell>
                                            <StyledTableCell align='right'>{wo.lastupdated ? dayjs(wo.lastupdated).format('MMMM D, YYYY h:mm A') : '-'}</StyledTableCell>
                                            <StyledTableCell align='right'>{wo.datecompleted ? dayjs(wo.datecompleted).format('MMMM D, YYYY h:mm A') : '-'}</StyledTableCell>
                                            {changeAssigned === -1 || changeAssigned !== wo.id? (
                                                <StyledAssignmentCell align="right" >{wo.stafffirst} {wo.stafflast}
                                                    <br /><button className='changeStaffBtn' onClick={e=>{e.stopPropagation(); changeAssignedStaff(wo.id)}}>Change Assignee</button>
                                                </StyledAssignmentCell>
                                            ) : (
                                                    <StyledAssignmentCell align="right"  onClick={e => e.stopPropagation()}>

                                                        <div onClick={e => e.stopPropagation()}>Assign to <span onClick={e => e.stopPropagation()}>
                                                            <Select
                                                                name='staffoptions'
                                                                id='staffoptions'
                                                                defaultValue={wo.firstname}
                                                                value={selectedStaff}
                                                                onClick={e => e.stopPropagation()}
                                                                onChange={e => { handleSelectChange(e.value, wo.id) }}
                                                                options={staffOptions} />
                                                        </span>
                                                            <button className='changeStaffBtn' onClick={e=>{e.stopPropagation();changeAssignedStaff(-1)}}>Don't Change</button>
                                                        </div>


                                                    </StyledAssignmentCell>
                                                )}
                                        </StyledTableRow>
                                    ))}
                                    <StyledTableRow  key={'end'} className='extrarow assignedRow'>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledDescriptionCell align='right'>End Of Work Orders</StyledDescriptionCell>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledTableCell align='right'>-</StyledTableCell>
                                        <StyledDescriptionCell align='right'>-</StyledDescriptionCell>
                                    </StyledTableRow>
                                </TableBody>
                            </Table>
                        </StyledTableContainer> : <></>}
                    </div>
                </>
            }
        </div>
    ) 
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(ManagerDash)
