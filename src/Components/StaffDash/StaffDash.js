import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import './StaffDash.css'
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
import { Link } from 'react-router-dom';
import { ModalRoute, ModalContainer } from 'react-router-modal';
import ManageWorkOrder from '../ManageWorkOrder/ManageWorkOrder';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function StaffDash(props) {
    const classes = useStyles();
    const [workorders, setWorkorders] = useState([])
    const [scheduled, setScheduled] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (props.user.staffid) {
            axios.get(`/api/staff/workorders/${props.user.staffid}`)
                .then(res => {
                    setWorkorders(res.data)
                })
                .catch(err => console.log(err))
        }
    }, [scheduled, props])

    const handleSelectChange = (e, id) => {
        axios.put(`/api/staff/workorders`, { id, status: e, staffid: props.user.staffid })
            .then(res => {
                setScheduled(res.data)
            })

            .catch(err => console.log(err))
    }

    const searchwo = e => {
        setSearch(e.target.value)
    }
    console.log(props)
    return (
        <div id='staffDash'>
            <h1>Unread</h1>
            <TableContainer component={Paper}>
                <TextField onChange={e => searchwo(e)} className='search-workorder-field' id="outlined-basic" label="Search" variant="outlined" value={search} />
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID#</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Date Created</TableCell>
                            <TableCell align="right">Last Updated</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workorders
                            .filter(e => e.status === 'Unread' && (e.description.toLowerCase().includes(search.toLocaleLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase())))
                            .map(wo => (
                                <TableRow key={wo.id}>
                                    <TableCell component="th" scope="row">
                                        {wo.id}
                                    </TableCell>
                                    <TableCell align="right">{wo.firstname} {wo.lastname}</TableCell>
                                    <TableCell align="right">
                                        <Link to={{ pathname: `${props.match.url}/workorder/${wo.id}`, id: wo.id }}>
                                            {wo.title}
                                        </Link></TableCell>
                                    <TableCell align="right">{wo.description}</TableCell>
                                    <TableCell align="right">{dayjs(wo.datecreated).format('MMMM D, YYYY h:mm A')}</TableCell>
                                    <TableCell align="right">{wo.lastupdated ? dayjs(wo.lastupdated).format('MMMM D, YYYY h:mm A') : '-'}</TableCell>
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

            <br /> <br />

            <h1>In Progress</h1>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID#</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Date Created</TableCell>
                            <TableCell align="right">Last Updated</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workorders.filter(e => e.status === 'In Progress' && (e.description.includes(search) || e.title.includes(search))).map(wo => (
                            <TableRow key={wo.id}>
                                <TableCell component="th" scope="row">
                                    {wo.id}
                                </TableCell>
                                <TableCell align="right">{wo.firstname} {wo.lastname}</TableCell>
                                <TableCell align="right">{wo.title}</TableCell>
                                <TableCell align="right">{wo.description}</TableCell>
                                <TableCell align="right">{dayjs(wo.datecreated).format('MMMM D, YYYY h:mm A')}</TableCell>
                                <TableCell align="right">{wo.lastupdated ? dayjs(wo.lastupdated).format('MMMM D, YYYY h:mm A') : '-'}</TableCell>
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
            {/* Status = completed will not show unless filtered to that */}
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