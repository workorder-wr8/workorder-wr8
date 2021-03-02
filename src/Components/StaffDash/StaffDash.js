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
import { Link } from 'react-router-dom';
import { ModalRoute, ModalContainer } from 'react-router-modal';
import ManageWorkOrder from '../ManageWorkOrder/ManageWorkOrder';
import SpinnerContainer from '../Spinner/SpinnerContainer';
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
});

function StaffDash(props) {
    const classes = useStyles();
    const [workorders, setWorkorders] = useState([])
    const [scheduled, setScheduled] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setLoading] = useState(true);

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
                            <TableHead className={classes.tablehead} >
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
                                        <TableRow key={wo.id} onClick={e => openWO(wo.id)}>
                                            <TableCell component="th" scope="row">
                                                {wo.id}
                                            </TableCell>
                                            <TableCell align="right">{wo.firstname} {wo.lastname}</TableCell>
                                            <TableCell align="right">
                                                {wo.title}
                                            </TableCell>
                                            <TableCell align="right">{wo.description.length > 100 ? wo.description.substring(0, 80).concat('...') : wo.description}</TableCell>
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
                </section>
            }



            <section className=''>
                <TableContainer className='table-container' component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead className={classes.tablehead2}>
                            <TableRow>
                                <TableCell>ID#</TableCell>
                                <TableCell align="right">Tenant Name</TableCell>
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
                                <TableRow key={wo.id} onClick={e => openWO(wo.id)}>
                                    <TableCell component="th" scope="row">
                                        {wo.id}
                                    </TableCell>
                                    <TableCell align="right">{wo.firstname} {wo.lastname}</TableCell>
                                    <TableCell align="right">
                                        {wo.title}</TableCell>
                                    <TableCell align="right">{wo.description.length > 100 ? wo.description.substring(0, 80).concat('...') : wo.description}</TableCell>
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