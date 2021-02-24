// This component is for when a landlord clicks on one of his properties
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './LandlordProperty.css'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function LandlordProperty(props) {
    const classes = useStyles();
    const [workorders, setWorkorders] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        axios.get(`/api/landlord/properties/workorders/${+props.match.params.id}`)
            .then(res => setWorkorders(res.data))
            .catch(err => console.log(err))
    }, [])

    const filterassignments = e => {
        setSearch(e.target.value)
    }

    console.log(workorders)
    return (
        <div>
            LandlordProperty

            <br />
            <label>Search:</label>
            <input type='search' onChange={e => filterassignments(e)} value={search} />

            <h2>All Workorders</h2>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID#</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Date Created</TableCell>
                            <TableCell align="right">Date Completed</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workorders
                            .filter(e => (e.description.toLowerCase().includes(search.toLocaleLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase())))
                            .map((workorder) => (
                                <TableRow key={workorder.id}>
                                    <TableCell component="th" scope="row">
                                        {workorder.id}
                                    </TableCell>
                                    <TableCell align="right">{workorder.title}</TableCell>
                                    <TableCell align="right">{workorder.description}</TableCell>
                                    <TableCell align="right">{workorder.datecreated}</TableCell>
                                    <TableCell align="right">{workorder.datecompleted}</TableCell>
                                    <TableCell align="right">{workorder.status}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
