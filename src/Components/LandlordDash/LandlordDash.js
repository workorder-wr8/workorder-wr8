import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import './LandlordDash.css'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function LandlordDash(props) {
    const classes = useStyles();
    const [properties, setProperties] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (props.user.id) {
            axios.get(`/api/landlord/properties/${props.user.id}`)
                .then(res => setProperties(res.data))
                .catch(err => console.log(err))
        }
    }, [props])

    const filterproperties = e => {
        setSearch(e.target.value)
    }

    console.log(properties)
    return (
        <div>
            LandlordDash
            {/* List of Properties landlord tied to with ability to click on one which renders the manager view */}
            <TableContainer component={Paper}>
                <TextField onChange={e => filterproperties(e)} className='search-property-field' id="outlined-basic" label="Search" variant="outlined" value={search} />
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID#</TableCell>
                            <TableCell align="right">Property Name</TableCell>
                            {/* <TableCell align="right">Manager</TableCell> */}
                            {/* <TableCell align="right">Total Tenants</TableCell> */}
                            <TableCell align="right">Address</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Phone</TableCell>
                            {/* <TableCell align="right">Action</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties
                            .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
                            .map(property => (
                                <TableRow key={property.id}>
                                    <TableCell component="th" scope="row">
                                        {property.id}
                                    </TableCell>
                                    <TableCell align="right">{property.name}</TableCell>
                                    <TableCell align="right">{property.address1}</TableCell>
                                    <TableCell align="right">{property.email}</TableCell>
                                    <TableCell align="right">{property.phone}</TableCell>
                                    {/* <TableCell align="right">{property.status}</TableCell> */}
                                    {/* <TableCell align="right">{
                                    <div >Mark as <span>{
                                        <>
                                            <select defaultValue={assignment.status} name='statusoptions' id='statusoptions' onChange={e => handleSelectChange(e.target.value, assignment.id)}>
                                                <option value='Unread' >Unread</option>
                                                <option value='In Progress'>In Progress</option>
                                                <option value='Completed'>Completed</option>
                                            </select>
                                        </>
                                    }</span></div>
                                }</TableCell> */}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(LandlordDash);
