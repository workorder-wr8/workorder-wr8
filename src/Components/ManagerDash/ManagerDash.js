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
import orderBy from "lodash/orderBy";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SpinnerContainer from '../Spinner/SpinnerContainer';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './ManagerDash.css';
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

const StyledTableContainer = withStyles((theme) => ({
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
    const [columnToSort, setColumnToSort] = useState('')
    const [sortDirection, setSortDirection] = useState('')
    const invertDirection = {
        asc: 'desc',
        desc: 'asc'
    }
    const [dateToggle, setDateToggle] = useState(true)
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
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
                return <article className='comment-container me'>
                    <p className='my-comment'>{message.content}@<span className='comment-timestamp'>{dayjs(message.timesent).format('MMMM D, YYYY h:mm A')}</span></p>
                </article>
            } else {
                return <article className='comment-container them'>
                    <p className='my-comment'>{message.content}@<span className='comment-timestamp'>{dayjs(message.timesent).format('MMMM D, YYYY h:mm A')}</span></p>
                </article>
            }
        })
        setOverlayMessages(<div id='mappedMessages'>{mappedMessages}</div>)
    }

    useEffect(mapMessages, [messages])

    const overlayOff = () => { document.getElementById('managerOverlay').style.display = 'none' }
    const overlayOn = () => { document.getElementById('managerOverlay').style.display = 'flex' }

    const changeOverlay = (event) => {
        let id = event.target.parentNode.parentNode.cells[0].textContent;
        let name = event.target.parentNode.parentNode.cells[1].textContent;
        let title = event.target.parentNode.parentNode.cells[2].textContent;
        let description = event.target.parentNode.parentNode.cells[3].id;
        let status = event.target.parentNode.parentNode.cells[4].textContent;
        let datecreated = event.target.parentNode.parentNode.cells[5].textContent;
        let lastupdated, datecompleted;
        if (event.target.parentNode.parentNode.cells[7]) {
            lastupdated = event.target.parentNode.parentNode.cells[6].textContent;
            datecompleted = event.target.parentNode.parentNode.cells[7].textContent;
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
            .catch(err => console.log(`Error: ${err.response.data}`))
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
            .catch(err => {
                console.log(`Error: ${err.response.data}`);
                setLoading(false);
                setMessage(`${err.response.data}`)
                setShow(true);
                setTimeout(()=>{
                    setShow(false);
                }, 1500);
            })
    }

    const changeAssignedStaff = (index) => {
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

    //sorting unassigned
    let unassignedColumns = [
        { id: 'ID#', label: 'ID#' },
        { id: 'tenant', label: 'Tenant' },
        { id: 'title', label: 'Title' },
        { id: 'description', label: 'Description' },
        { id: 'status', label: 'Status', disableSorting: true },
        { id: 'created', label: 'Created' },
        { id: 'assign', label: 'Assign', disableSorting: true }
    ]

    const handleSortUnassigned = (columnId) => {
        setColumnToSort(columnId)
        setSortDirection(columnToSort === columnId ? invertDirection[sortDirection] : 'asc')

        if (columnId === 'created') {
            setDateToggle(!dateToggle)
            unassignedWorkOrders.sort((a, b) => {
                if (dateToggle) {
                    return new Date(a.datecreated) - new Date(b.datecreated);
                } else {
                    return new Date(b.datecreated) - new Date(a.datecreated);
                }
            });
        } else if (columnId === 'ID#') {
            setDateToggle(!dateToggle)
            unassignedWorkOrders.sort((a, b) => {
                if (dateToggle) {
                    return new Date(a.id) - new Date(b.id);
                } else {
                    return new Date(b.id) - new Date(a.id);
                }
            });
        }
    }

    //sorting assigned
    let assignedColumns = [
        { id: 'ID#', label: 'ID#' },
        { id: 'tenant', label: 'Tenant' },
        { id: 'title', label: 'Title' },
        { id: 'description', label: 'Description' },
        { id: 'status', label: 'Status' },
        { id: 'created', label: 'Created' },
        { id: 'updated', label: 'Last Updated' },
        { id: 'completed', label: 'Completed', disableSorting: true },
        { id: 'assigned', label: 'Assigned To', disableSorting: true }
    ]

    const handleSortAssigned = (columnId) => {
        setColumnToSort(columnId)
        setSortDirection(columnToSort === columnId ? invertDirection[sortDirection] : 'asc')

        if (columnId === 'created') {
            setDateToggle(!dateToggle)
            assignedWorkOrders.sort((a, b) => {
                if (dateToggle) {
                    return new Date(a.datecreated) - new Date(b.datecreated);
                } else {
                    return new Date(b.datecreated) - new Date(a.datecreated);
                }
            });
        } else if (columnId === 'updated') {
            setDateToggle(!dateToggle)
            assignedWorkOrders.sort((a, b) => {
                if (dateToggle) {
                    return new Date(a.lastupdated) - new Date(b.lastupdated);
                } else {
                    return new Date(b.lastupdated) - new Date(a.lastupdated);
                }
            });
        } else if (columnId === 'ID#') {
            setDateToggle(!dateToggle)
            assignedWorkOrders.sort((a, b) => {
                if (dateToggle) {
                    return new Date(a.id) - new Date(b.id);
                } else {
                    return new Date(b.id) - new Date(a.id);
                }
            });
        }
    }


    useEffect(mapWorkOrders, [workorders]);
    useEffect(mapStaff, [staffMembers]);

    return (
        <div className='managerDash'>
            <div id='managerOverlay' >
                <div id='managerOverlayInfoContainer'>
                    <section class='workorder-container'>
                        <>
                            <div className='workorder-title'>
                                <h2 id='wo-title'>{overlayData.overlayTitle} <span>#{overlayData.overlayId}</span></h2>
                                <h3 id='status-workorder' className={overlayData.overlayStatus === 'Open' ? 'completed' : 'default-status'}>Status: {overlayData.overlayStatus}</h3>
                                <Button className='close-workorder-btn' onClick={overlayOff}>Close</Button>
                            </div>
                            <div className='workorder-details'>

                                <div className='status-updates'>
                                    <span className='status-update-workorder'>Created: {dayjs(overlayData.dateCreated).format('dddd MMMM D YYYY h:mm A')}</span><br />
                                    {overlayData.lastUpdated === null
                                        ?
                                        null
                                        :
                                        <>
                                            <span>Last Updated: {dayjs(overlayData.lastUpdated).format('dddd MMMM D, YYYY h:mm A')}</span>
                                        </>

                                    }
                                    {overlayData.dateCompleted === null
                                        ?
                                        null
                                        :
                                        <>
                                            <br />
                                            <span>Date Completed: {dayjs(overlayData.dateCompleted).format('dddd MMMM D, YYYY h:mm A')}</span>
                                        </>

                                    }
                                </div>
                            </div>
                            <div className='workorder-description'>
                                <h3 id='description-workorder'>Workorder Description:</h3>
                                <section className='wo-description-content'>
                                    <p >{overlayData.overlayDescription}</p>
                                </section>
                            </div>
                        </>
                        <section className='comment-container'>
                            <section>
                                <p className='comment-header'>Comments:</p>
                                <section className='comments'>
                                    {overlayMessages}
                                </section>
                                <form onSubmit={e => { addMessage(overlayData.overlayId, overlayData.overlayMessageInput) }} onClick={e => e.stopPropagation()} className='add-comment-container'>
                                    <TextField type='text' onClick={e => e.stopPropagation()} onChange={e => setOverlayData({ ...overlayData, overlayMessageInput: e.target.value })} value={overlayData.overlayMessageInput} className='comment-input' />
                                    <Button type='button' class='addBtn-comment' onClick={e => { addMessage(overlayData.overlayId, overlayData.overlayMessageInput) }}>Add Comment</Button>
                                </form>
                            </section>
                        </section>
                    </section>
                </div>
            </div>
            {isLoading
                ? <SpinnerContainer />
                : <>
                    <div className='tableWrapper unassignedTable' >
                        {show ? <Alert className='fade-in' severity="warning">{message}</Alert> : null}
                        <StyledTableContainer component={Paper}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {unassignedColumns.map(column => (
                                            <>
                                                {column.label === 'Description' ? (
                                                    <StyledDescriptionCell
                                                        key={column.id}
                                                        align='right'>
                                                        <div
                                                            className='arrow-filter'
                                                            onClick={() => handleSortUnassigned(column.id)}>
                                                            <span title='Sort'>{column.label}</span>
                                                            {columnToSort === column.id ? (
                                                                sortDirection === 'asc' ? (
                                                                    <KeyboardArrowUpIcon />
                                                                ) : (
                                                                        <KeyboardArrowDownIcon />
                                                                    )
                                                            ) : null}
                                                        </div>
                                                    </StyledDescriptionCell>
                                                ) : (
                                                        <StyledTableCell
                                                            key={column.id}
                                                            align="right"
                                                        >
                                                            {column.disableSorting ? (
                                                                <div>
                                                                    {column.label}
                                                                </div>
                                                            ) :
                                                                <div
                                                                    className='arrow-filter'
                                                                    onClick={() => handleSortUnassigned(column.id)}>
                                                                    <span title='Sort'>{column.label}</span>
                                                                    {columnToSort === column.id ? (
                                                                        sortDirection === 'asc' ? (
                                                                            <KeyboardArrowUpIcon />
                                                                        ) : (
                                                                                <KeyboardArrowDownIcon />
                                                                            )
                                                                    ) : null}
                                                                </div>}
                                                        </StyledTableCell>)}
                                            </>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderBy(unassignedWorkOrders, columnToSort, sortDirection)
                                        .map(wo => (
                                            <StyledTableRow className='row' key={wo.id} value={wo} className='unassignedRow'>
                                                <StyledTableCell align='right' className='unassignedCell'>{wo.id}</StyledTableCell>
                                                <StyledTableCell align='right' className='unassignedCell'>{wo.tenantlast},{wo.tenantfirst}</StyledTableCell>
                                                <StyledTableCell align='right' className='unassignedCell'><Link onClick={changeOverlay}>{wo.title}</Link></StyledTableCell>
                                                <StyledDescriptionCell align='right' className='unassignedCell descriptionCell' id={wo.description}>{wo.description.length > 100 ? wo.description.substring(0, 80).concat('...') : wo.description}</StyledDescriptionCell>
                                                <StyledTableCell align='right' className='unassignedCell'>{wo.status}</StyledTableCell>
                                                <StyledTableCell align='right' className='unassignedCell'>{dayjs(wo.datecreated).format('MMMM D, YYYY h:mm A')}</StyledTableCell>
                                                <TableCell align="right" onClick={e => e.stopPropagation()} >{
                                                    <div onClick={e => { e.stopPropagation() }}><span onClick={e => e.stopPropagation()}>
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
                                    {unassignedWorkOrders.length === 0
                                        ?
                                        null
                                        :
                                        (
                                            <StyledTableRow key={'end'} className='extrarow assignedRow'>
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
                                        )}
                                </TableBody>
                            </Table>
                        </StyledTableContainer>
                    </div>
                    <div className='tableWrapper assignedTable'>
                        <StyledTableContainer component={Paper}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {assignedColumns.map(column => (
                                            <>
                                                {column.label === 'Description' ? (
                                                    <StyledDescriptionCell
                                                        key={column.id}
                                                        align='right'>
                                                        <div
                                                            className='arrow-filter'
                                                            onClick={() => handleSortAssigned(column.id)}>
                                                            <span title='Sort'>{column.label}</span>
                                                            {columnToSort === column.id ? (
                                                                sortDirection === 'asc' ? (
                                                                    <KeyboardArrowUpIcon />
                                                                ) : (
                                                                        <KeyboardArrowDownIcon />
                                                                    )
                                                            ) : null}
                                                        </div>
                                                    </StyledDescriptionCell>
                                                ) : (
                                                        <StyledTableCell
                                                            key={column.id}
                                                            align="right"
                                                        >
                                                            {column.disableSorting ? (
                                                                <div>
                                                                    {column.label}
                                                                </div>
                                                            ) :
                                                                <div
                                                                    className='arrow-filter'
                                                                    onClick={() => handleSortAssigned(column.id)}>
                                                                    <span title='Sort'>{column.label}</span>
                                                                    {columnToSort === column.id ? (
                                                                        sortDirection === 'asc' ? (
                                                                            <KeyboardArrowUpIcon />
                                                                        ) : (
                                                                                <KeyboardArrowDownIcon />
                                                                            )
                                                                    ) : null}
                                                                </div>}
                                                        </StyledTableCell>)}
                                            </>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderBy(assignedWorkOrders, columnToSort, sortDirection)
                                        .map(wo => (
                                            <StyledTableRow key={wo.id} value={wo} className='assignedRow'>
                                                <StyledTableCell align='right'>{wo.id}</StyledTableCell>
                                                <StyledTableCell align='right' >{wo.tenantlast},{wo.tenantfirst}</StyledTableCell>
                                                <StyledTableCell align='right' onClick={changeOverlay} ><Link>{wo.title}</Link></StyledTableCell>
                                                <StyledDescriptionCell align='right' className='unassignedCell descriptionCell' id={wo.description}>{wo.description.length > 100 ? wo.description.substring(0, 80).concat('...') : wo.description}</StyledDescriptionCell>
                                                <StyledTableCell align='right'>{wo.status}</StyledTableCell>
                                                <StyledTableCell align='right'>{dayjs(wo.datecreated).format('MMMM D, YYYY h:mm A')}</StyledTableCell>
                                                <StyledTableCell align='right'>{wo.lastupdated ? dayjs(wo.lastupdated).format('MMMM D, YYYY h:mm A') : '-'}</StyledTableCell>
                                                <StyledTableCell align='right'>{wo.datecompleted ? dayjs(wo.datecompleted).format('MMMM D, YYYY h:mm A') : '-'}</StyledTableCell>
                                                {changeAssigned === -1 || changeAssigned !== wo.id ? (
                                                    <StyledAssignmentCell align="right" >{wo.stafffirst} {wo.stafflast}
                                                        <br /><button className='changeStaffBtn' onClick={e => { e.stopPropagation(); changeAssignedStaff(wo.id) }}>Change Assignee</button>
                                                    </StyledAssignmentCell>
                                                ) : (
                                                        <StyledAssignmentCell align="right" onClick={e => e.stopPropagation()}>

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
                                                                <button className='changeStaffBtn' onClick={e => { e.stopPropagation(); changeAssignedStaff(-1) }}>Don't Change</button>
                                                            </div>
                                                        </StyledAssignmentCell>
                                                    )}
                                            </StyledTableRow>
                                        ))}
                                    {assignedWorkOrders.length === 0
                                        ?
                                        null
                                        :
                                        (
                                            <StyledTableRow key={'end'} className='extrarow assignedRow'>
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
                                        )}

                                </TableBody>
                            </Table>
                        </StyledTableContainer>
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
