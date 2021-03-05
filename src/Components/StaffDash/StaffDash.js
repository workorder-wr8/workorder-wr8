import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import dayjs from 'dayjs';
import { ModalRoute, ModalContainer } from 'react-router-modal';
import ManageWorkOrder from '../ManageWorkOrder/ManageWorkOrder';
import SpinnerContainer from '../Spinner/SpinnerContainer';
import orderBy from "lodash/orderBy";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import CreateIcon from '@material-ui/icons/Create';
import CancelIcon from '@material-ui/icons/Cancel';
import { Link } from 'react-router-dom';
import click from '../../assets/click_me.svg';
import './StaffDash.css'
import { compare } from 'bcryptjs';

const useStyles = makeStyles({
    tablehead: {
        background: 'rgb(188, 70, 92)'
    },
    tablehead2: {
        background: 'rgb(199, 135, 67)'
    },
    tablehead3: {
        background: 'rgba(52, 130, 25, 0.955)'
    },
    red: {
        color: 'red'
    },
    green: {
        color: 'green'
    },
    table: {
        minWidth: 650,
    }
});

function StaffDash(props) {
    const classes = useStyles();
    const [workorders, setWorkorders] = useState([])
    const [scheduled, setScheduled] = useState([]);
    const [search, setSearch] = useState('');
    const [editView, setEditView] = useState(false)
    const [isLoading, setLoading] = useState(true);
    const [columnToSort, setColumnToSort] = useState('')
    const [sortDirection, setSortDirection] = useState('')
    const invertDirection = {
        asc: 'desc',
        desc: 'asc'
    }
    const [dateToggle, setDateToggle] = useState(true)
    const [editedId, setEditedId] = useState(0)

    useEffect(() => {
        if (props.user.staffid) {
            axios.get(`/api/staff/workorders/${props.user.staffid}`)
                .then(res => {
                    setWorkorders(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false)
                })
        }
    }, [scheduled, props])

    const handleSelectChange = (e, id) => {
        setLoading(true);
        axios.put(`/api/staff/workorders`, { id, status: e, staffid: props.user.staffid })
            .then(res => {
                setScheduled(res.data)
                setLoading(false)
                setEditedId(0)
            })

            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }

    const searchwo = e => {
        setSearch(e.target.value)
    }

    let columnHeads = [
        { id: 'ID#', label: 'ID#' },
        { id: 'name', label: 'Name' },
        { id: 'title', label: 'Title' },
        { id: 'description', label: 'Description' },
        { id: 'dateCreated', label: 'Date Created' },
        { id: 'lastUpdated', label: 'Last Updated' },
        { id: 'status', label: 'Status', disableSorting: true },
        { id: 'mark', label: 'Mark As', disableSorting: true }
    ]

    const handleSort = (columnId) => {
        setColumnToSort(columnId)
        setSortDirection(columnToSort === columnId ? invertDirection[sortDirection] : 'asc')

        if (columnId === 'dateCreated') {
            setDateToggle(!dateToggle)
            workorders.sort((a, b) => {
                if (dateToggle) {
                    return new Date(a.datecreated) - new Date(b.datecreated);
                } else {
                    return new Date(b.datecreated) - new Date(a.datecreated);
                }
            });
        } else if (columnId === 'lastUpdated') {
            setDateToggle(!dateToggle)
            workorders.sort((a, b) => {
                if (dateToggle) {
                    return new Date(a.lastupdated) - new Date(b.lastupdated);
                } else {
                    return new Date(b.lastupdated) - new Date(a.lastupdated);
                }
            });
        } else if (columnId === 'ID#') {
            setDateToggle(!dateToggle)
            workorders.sort((a, b) => {
                if (dateToggle) {
                    return new Date(a.id) - new Date(b.id);
                } else {
                    return new Date(b.id) - new Date(a.id);
                }
            });
        }
    }

    function toggleEdit(id) {
        setEditedId(id)
    }

    function handleScroll() {
        document.getElementById('completed-workorders-staff').scrollIntoView()
    }

    return (
        <div id='staffDash'>
            <br />
            {isLoading
                ?
                <SpinnerContainer />
                :
                <section id='unread-workorders-staff'>
                    {/* <div><a href='#completed-workorders-staff'>Completed</a></div> */}
                    <div onClick={handleScroll}>Scroll to Completed</div>
                    <TextField onChange={e => searchwo(e)} className='search-workorder-field' id="outlined-basic" label="Search" variant="outlined" value={search} />
                    <TableContainer className='table-container' component={Paper}>
                        <Table className={classes.table} aria-label="simple table" >
                            <TableHead className={classes.tablehead}>
                                <TableRow>
                                    {columnHeads.map(column => (
                                        <TableCell
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
                                                    onClick={() => handleSort(column.id)}>
                                                    <span title='Sort'>{column.label}</span>
                                                    {columnToSort === column.id ? (
                                                        sortDirection === 'asc' ? (
                                                            <KeyboardArrowUpIcon />
                                                        ) : (
                                                                <KeyboardArrowDownIcon />
                                                            )
                                                    ) : null}
                                                </div>}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {orderBy(workorders, columnToSort, sortDirection)
                                    .filter(e => e.status === 'Unread' && (e.description.toLowerCase().includes(search.toLocaleLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase())))
                                    .map(wo => (
                                        <TableRow key={wo.id} className='unread-table-rows' >
                                            <TableCell component="th" scope="row">
                                                {wo.id}
                                            </TableCell>
                                            <TableCell align="right">{wo.firstname} {wo.lastname}</TableCell>
                                            <TableCell align="right">
                                                <Link className='link' title='Open Workorder View' to={{ pathname: `${props.match.url}/workorder/${wo.id}`, id: wo.id }}>
                                                    {wo.title}
                                                    <img className='click-me' src={click} alt='click_svg' />
                                                </Link>
                                            </TableCell>
                                            <TableCell align="right">{wo.description.length > 100 ? wo.description.substring(0, 80).concat('...') : wo.description}</TableCell>
                                            <TableCell align="right">{dayjs(wo.datecreated).format('MM-DD-YYYY')}</TableCell>
                                            <TableCell align="right">{wo.lastupdated ? dayjs(wo.lastupdated).format('MM-DD-YYYY') : '-'}</TableCell>
                                            <TableCell align="right">{wo.status}</TableCell>
                                            <TableCell align="right">{
                                                <div >
                                                    {editedId === wo.id ?

                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <select
                                                                defaultValue={wo.status}
                                                                onClick={e => e.stopPropagation()}
                                                                name='statusoptions' id={wo.id}
                                                                onChange={e => handleSelectChange(e.target.value, wo.id)}
                                                            >
                                                                <option value='Unread' onClick={e => e.stopPropagation()}>Unread</option>
                                                                <option value='In Progress' onClick={e => e.stopPropagation()}>In Progress</option>
                                                                <option value='Completed' onClick={e => e.stopPropagation()}>Completed</option>
                                                            </select>
                                                            <CancelIcon
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={e => {
                                                                    e.stopPropagation()
                                                                    setEditedId(0)
                                                                }} />

                                                        </div>
                                                        :
                                                        <CreateIcon
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                toggleEdit(wo.id)
                                                            }} />
                                                    }
                                                </div>
                                            }</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </section>
            }
            <br />


            <section id='progress-workorders-staff'>
                <TableContainer className='table-container' component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead className={classes.tablehead2}>
                            <TableRow>
                                {columnHeads.map(column => (
                                    <TableCell
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
                                                onClick={() => handleSort(column.id)}>
                                                <span title='Sort'>{column.label}</span>
                                                {columnToSort === column.id ? (
                                                    sortDirection === 'asc' ? (
                                                        <KeyboardArrowUpIcon />
                                                    ) : (
                                                            <KeyboardArrowDownIcon />
                                                        )
                                                ) : null}
                                            </div>}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderBy(workorders, columnToSort, sortDirection)
                                .filter(e => e.status === 'In Progress' && (e.description.toLowerCase().includes(search.toLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase())))
                                .map(wo => (
                                    <TableRow key={wo.id} className='progress-table-rows' >
                                        <TableCell component="th" scope="row">
                                            {wo.id}
                                        </TableCell>
                                        <TableCell align="right">{wo.firstname} {wo.lastname}</TableCell>
                                        <TableCell align="right">
                                            <Link className='link' title='Open Workorder View' to={{ pathname: `${props.match.url}/workorder/${wo.id}`, id: wo.id }}>
                                                {wo.title}
                                                <img className='click-me' src={click} alt='click_svg' />
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right">{wo.description.length > 100 ? wo.description.substring(0, 80).concat('...') : wo.description}</TableCell>
                                        <TableCell align="right">{dayjs(wo.datecreated).format('MM-DD-YYYY')}</TableCell>
                                        <TableCell align="right">{wo.lastupdated ? dayjs(wo.lastupdated).format('MM-DD-YYYY') : '-'}</TableCell>
                                        <TableCell align="right">{wo.status}</TableCell>
                                        <TableCell align="right">{
                                            <div >
                                                {editedId === wo.id ?

                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <select
                                                            defaultValue={wo.status}
                                                            onClick={e => e.stopPropagation()}
                                                            name='statusoptions' id={wo.id}
                                                            onChange={e => handleSelectChange(e.target.value, wo.id)}
                                                        >
                                                            <option value='Unread' onClick={e => e.stopPropagation()}>Unread</option>
                                                            <option value='In Progress' onClick={e => e.stopPropagation()}>In Progress</option>
                                                            <option value='Completed' onClick={e => e.stopPropagation()}>Completed</option>
                                                        </select>
                                                        <CancelIcon
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                setEditedId(0)
                                                            }} />

                                                    </div>
                                                    :
                                                    <CreateIcon
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            toggleEdit(wo.id)
                                                        }} />
                                                }
                                            </div>
                                        }</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </section>

            <br />
            <section id='completed-workorders-staff'>
                <TableContainer className='table-container' component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead className={classes.tablehead3}>
                            <TableRow>
                                {columnHeads.map(column => (
                                    <TableCell
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
                                                onClick={() => handleSort(column.id)}>
                                                <span title='Sort'>{column.label}</span>
                                                {columnToSort === column.id ? (
                                                    sortDirection === 'asc' ? (
                                                        <KeyboardArrowUpIcon />
                                                    ) : (
                                                            <KeyboardArrowDownIcon />
                                                        )
                                                ) : null}
                                            </div>}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderBy(workorders, columnToSort, sortDirection)
                                .filter(e => e.status === 'Completed' && (e.description.toLowerCase().includes(search.toLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase())))
                                .map(wo => (
                                    <TableRow key={wo.id} className='completed-table-rows' >
                                        <TableCell component="th" scope="row">
                                            {wo.id}
                                        </TableCell>
                                        <TableCell align="right">{wo.firstname} {wo.lastname}</TableCell>
                                        <TableCell align="right">
                                            {wo.title}
                                        </TableCell>
                                        <TableCell align="right">{wo.description.length > 100 ? wo.description.substring(0, 80).concat('...') : wo.description}</TableCell>
                                        <TableCell align="right">{dayjs(wo.datecreated).format('MM-DD-YYYY')}</TableCell>
                                        <TableCell align="right">{wo.lastupdated ? dayjs(wo.lastupdated).format('MM-DD-YYYY') : '-'}</TableCell>
                                        <TableCell align="right">{wo.status}</TableCell>
                                        <TableCell align="right">{
                                            <div >
                                                {editedId === wo.id ?

                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <select
                                                            defaultValue={wo.status}
                                                            onClick={e => e.stopPropagation()}
                                                            name='statusoptions' id={wo.id}
                                                            onChange={e => handleSelectChange(e.target.value, wo.id)}
                                                        >
                                                            <option value='Unread' onClick={e => e.stopPropagation()}>Unread</option>
                                                            <option value='In Progress' onClick={e => e.stopPropagation()}>In Progress</option>
                                                            <option value='Completed' onClick={e => e.stopPropagation()}>Completed</option>
                                                        </select>
                                                        <CancelIcon
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                setEditedId(0)
                                                            }} />

                                                    </div>
                                                    :
                                                    <CreateIcon
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            toggleEdit(wo.id)
                                                        }} />
                                                }
                                            </div>
                                        }</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </section>
            <ModalRoute className='example-modal'
                inClassName='example-modal-in'
                outClassName='example-modal-out'
                backdropClassName='example-backdrop'
                backdropInClassName='example-backdrop-in'
                backdropOutClassName='example-backdrop-out'
                outDelay={1500}
                path={`${props.match.url}/workorder/:id`}
                parentPath={`${props.match.url}`}
                component={ManageWorkOrder} />
            <ModalContainer />
        </div >
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(StaffDash)