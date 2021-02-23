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
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function StaffDash(props) {
    const classes = useStyles();
    const [assignments, setAssignments] = useState([])
    const [scheduled, setScheduled] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (props.user.staffid) {
            axios.get(`/api/staff/workorders/${props.user.staffid}`)
                .then(res => {
                    setAssignments(res.data)
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

    const filterassignments = e => {
        setSearch(e.target.value)
    }

    return (
        <div id='staffDash'>

            <br />
            <label>Search:</label>
            <input type='search' onChange={e => filterassignments(e)} value={search} />

            <h1>Unread</h1>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID#</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Date Created</TableCell>
                            {/* <TableCell align="right">Last Updated</TableCell> */}
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignments
                            .filter(e => e.status === 'Unread' && (e.description.toLowerCase().includes(search.toLocaleLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase())))
                            .map((assignment) => (
                                <TableRow key={assignment.id}>
                                    <TableCell component="th" scope="row">
                                        {assignment.id}
                                    </TableCell>
                                    <TableCell align="right">{assignment.firstname} {assignment.lastname}</TableCell>
                                    <TableCell align="right">{assignment.title}</TableCell>
                                    <TableCell align="right">{assignment.description}</TableCell>
                                    <TableCell align="right">{assignment.datecreated}</TableCell>
                                    {/* <TableCell align="right">{assignment.lastupdated}</TableCell> */}
                                    <TableCell align="right">{assignment.status}</TableCell>
                                    <TableCell align="right">{
                                        <div >Mark as <span>{
                                            <>
                                                <select defaultValue={assignment.status} name='statusoptions' id='statusoptions' onChange={e => handleSelectChange(e.target.value, assignment.id)}>
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

            <br />

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
                        {assignments.filter(e => e.status === 'In Progress' && (e.description.includes(search) || e.title.includes(search))).map((assignment) => (
                            <TableRow key={assignment.id}>
                                <TableCell component="th" scope="row">
                                    {assignment.id}
                                </TableCell>
                                <TableCell align="right">{assignment.firstname} {assignment.lastname}</TableCell>
                                <TableCell align="right">{assignment.title}</TableCell>
                                <TableCell align="right">{assignment.description}</TableCell>
                                <TableCell align="right">{assignment.datecreated}</TableCell>
                                <TableCell align="right">{assignment.lastupdated}</TableCell>
                                <TableCell align="right">{assignment.status}</TableCell>
                                <TableCell align="right">{
                                    <div >Mark as <span>{
                                        <>
                                            <select defaultValue={assignment.status} name='statusoptions' id='statusoptions' onChange={e => handleSelectChange(e.target.value, assignment.id)}>
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

            {/*  */}
            {/* <section id='unopened'>
                <h1>Unread Workorders</h1>

                {assignments.filter(e => e.status === 'Unread').map(wo => (
                    <section key={wo.id}>
                        <h2>Name: {wo.firstname}</h2>
                        <h2>Title: {wo.title}</h2>
                        <p>Description: {wo.description}</p>
                        <div>Date Created: {wo.datecreated}</div>
                        <div>Last Updated: {wo.lastupdated}</div>
                        <div>Status: {wo.status}</div>
                        <div >Mark as <span>{
                            <>
                                <select defaultValue={wo.status} name='statusoptions' id='statusoptions' onChange={e => handleSelectChange(e.target.value, wo.id)}>
                                    <option value='Unread' >Unread</option>
                                    <option value='In Progress'>In Progress</option>
                                    <option value='Completed'>Completed</option>
                                </select>
                            </>
                        }</span></div>

                    </section>
                ))}
            </section>


            <section id='inprogress'>
                <h1>In Progress</h1>
                {assignments.filter(e => e.status === 'In Progress').map(wo => (
                    <section key={wo.id}>
                        <h2>Name: {wo.firstname}</h2>
                        <h2>Title: {wo.title}</h2>
                        <p>Description: {wo.description}</p>
                        <div>Date Created: {wo.datecreated}</div>
                        <div>Last Updated: {wo.lastupdated}</div>
                        <div>Status: {wo.status}</div>
                        <div >Mark as <span>{
                            <>
                                <select defaultValue={wo.status} name='statusoptions' id='statusoptions' onChange={e => handleSelectChange(e.target.value, wo.id)}>
                                    <option value='Unread' >Unread</option>
                                    <option value='In Progress'>In Progress</option>
                                    <option value='Completed'>Completed</option>
                                </select>
                            </>
                        }</span></div>

                    </section>
                ))}
            </section> */}


            {/* Status = completed will not show unless filtered to that */}
        </div >
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(StaffDash)