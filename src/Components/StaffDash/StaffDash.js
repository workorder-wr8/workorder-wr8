import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
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
import './StaffDash.css'

const useStyles = makeStyles({
    tablehead: {
        background: 'pink'
    },
    tablehead2: {
        background: 'lightgreen'
    },
    red: {
        color: 'red'
    },
    green: {
        color: 'green'
    },
    table: {
        minWidth: 650,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
});

function StaffDash(props) {
    const classes = useStyles();
    const [workorders, setWorkorders] = useState([])
    const [scheduled, setScheduled] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [columnToSort, setColumnToSort] = useState('')
    const [sortDirection, setSortDirection] = useState('')
    const invertDirection = {
        asc: 'desc',
        desc: 'asc'
    }
    const [datecreatedtoggle, setDateCreatedToggle] = useState(true)

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
            })

            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }

    const searchwo = e => {
        setSearch(e.target.value)
    }

    const openWO = (id) => {
        props.history.push(`${props.match.url}/workorder/${id}`)
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

    const handleSort = (columnName) => {
        setColumnToSort(columnName)
        setSortDirection(columnToSort === columnName ? invertDirection[sortDirection] : 'asc')
        if (columnName === 'dateCreated' || columnName === 'lastUpdated' || columnName === 'ID#') {
            setDateCreatedToggle(!datecreatedtoggle)
            workorders.sort(function (a, b) {
                if (datecreatedtoggle) {
                    return new Date(b.datecreated) - new Date(a.datecreated);
                } else {
                    return new Date(a.datecreated) - new Date(b.datecreated);
                }
            });
        }
    }

    console.log(workorders)
    return (
        <div id='staffDash'>
            <br />
            {isLoading
                ?
                <SpinnerContainer />
                :
                <section className='unread-workorders-staff'>
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
                                                    {column.id}
                                                </div>
                                            ) :
                                                <div
                                                    className='arrow-filter'
                                                    onClick={() => handleSort(column.id)}>
                                                    <span>{column.id}</span>
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
                                        <TableRow key={wo.id} onClick={e => openWO(wo.id)}>
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
                                                <div >Mark as <span>{
                                                    <>
                                                        <select defaultValue={wo.status} name='statusoptions' id='statusoptions' onChange={e => handleSelectChange(e.target.value, wo.id)}>
                                                            <option value='Unread' >Unread</option>
                                                            <option value='In Progress'>In Progress</option>
                                                            <option value='Completed'>Completed</option>
                                                        </select>
                                                    </>
                                                }</span></div>
                                            }</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </section>
            }
            <br />


            <section className=''>
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
                                                {column.id}
                                            </div>
                                        ) :
                                            <div
                                                className='arrow-filter'
                                                onClick={() => handleSort(column.id)}>
                                                <span>{column.id}</span>
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
                                    <TableRow key={wo.id} onClick={e => openWO(wo.id)}>
                                        <TableCell component="th" scope="row">
                                            {wo.id}
                                        </TableCell>
                                        <TableCell align="right">{wo.firstname} {wo.lastname}</TableCell>
                                        <TableCell align="right">
                                            {wo.title}</TableCell>
                                        <TableCell align="right">{wo.description.length > 100 ? wo.description.substring(0, 80).concat('...') : wo.description}</TableCell>
                                        <TableCell align="right">{dayjs(wo.datecreated).format('MMM D')}</TableCell>
                                        <TableCell align="right">{wo.lastupdated ? dayjs(wo.lastupdated).format('MMM D') : '-'}</TableCell>
                                        <TableCell align="right">{wo.status}</TableCell>
                                        <TableCell align="right">{
                                            <div >Mark as <span>{
                                                <>
                                                    <select defaultValue={wo.status} name='statusoptions' id='statusoptions' onChange={e => handleSelectChange(e.target.value, wo.id)}>
                                                        <option value='Unread' >Unread</option>
                                                        <option value='In Progress'>In Progress</option>
                                                        <option value='Completed'>Completed</option>
                                                    </select>
                                                </>
                                            }</span></div>
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