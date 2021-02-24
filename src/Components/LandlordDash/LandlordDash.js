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
    const [input, setInput] = useState({
        name: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        email: '',
        phone: '',
        passcode: '',
        verpasscode: '',
        managerEmail: ''
    })
    const [toggleAdd, setToggleAdd] = useState(false)

    const getProperties = () => {
        axios.get(`/api/landlord/properties/${props.user.id}`)
            .then(res => setProperties(res.data))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (props.user.id) {
            getProperties();
        }
    }, [props])

    const filterproperties = e => {
        setSearch(e.target.value)
    }

    function openPropertyView(e) {
        let propertyid = +e.target.innerHTML
        props.history.push(`/landlord/property/${propertyid}`)
    }

    const addProperty = (e) => {
        e.preventDefault();
        let landlordid = props.user.id;
        const { name, address1, address2, city, state, zip, email, phone, passcode } = input
        let body = { landlordid, name, address1, address2, city, state, zip, email, phone, passcode }
        axios.post('/api/property/new', body)
            .then(res => {
                props.history.push('/landlorddash')
                off()
            })
            .catch(err => console.log(err))
    }

    const handleInputChange = e => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    function on() {
        document.getElementById("overlay").style.display = "block";
    }

    function off() {
        document.getElementById("overlay").style.display = "none";
        setToggleAdd(false)
    }

    function toggleadd() {
        setToggleAdd(!toggleAdd)
    }

    console.log(properties)
    return (
        <div>

            {/* List of Properties landlord tied to with ability to click on one which renders the manager view */}

            <div id="overlay" onClick={off}>
                <p className='closebtn' onClick={off} title="Close overlay">✕</p>
                <div id="text" onClick={e => e.stopPropagation()}>
                    <form id='addProperty' onSubmit={addProperty}>
                        <label>Property Name:</label>
                        <input name='name' type='text' value={input.name} onChange={e => handleInputChange(e)} />
                        <label>Address1:</label>
                        <input name='address1' type='text' value={input.address1} onChange={e => handleInputChange(e)} />
                        <label>Address2:</label>
                        <input name='address2' type='text' value={input.address2} onChange={e => handleInputChange(e)} />

                        <label >City:</label>
                        <input name='city' type='text' value={input.city} onChange={e => handleInputChange(e)} />
                        <label>State:</label>
                        <input name='state' type='text' value={input.state} onChange={e => handleInputChange(e)} />
                        <label>Zip:</label>
                        <input name='zip' type='text' value={input.zip} onChange={e => handleInputChange(e)} />

                        <label>Email:</label>
                        <input name='email' type='text' value={input.email} onChange={e => handleInputChange(e)} />
                        <label>Phone:</label>
                        <input name='phone' type='text' value={input.phone} onChange={e => handleInputChange(e)} />
                        <label>Passcode:</label>
                        <input name='passcode' type='password' value={input.passcode} onChange={e => handleInputChange(e)} />
                        <label>Confirm Passcode:</label>
                        <input name='verpasscode' type='password' value={input.verpasscode} onChange={e => handleInputChange(e)} />


                        {toggleAdd ? (
                            // implement nodemailer to send manager email to sign up with one time passcode
                            <>
                                <span onClick={toggleadd}>-</span>
                                <label>Manager Email:</label>
                                <input name='managerEmail' type='text' value={input.managerEmail} onChange={e => handleInputChange(e)} />
                            </>
                        ) : (
                                <>
                                    <h3 onClick={toggleadd}>Add a Manager <span >+</span></h3>
                                </>
                            )}

                        <br />
                        <input type='submit' onClick={addProperty} />
                    </form>
                </div>


            </div>

            <div style={{ padding: 20 }}>
                <button onClick={on}>Add a new property</button>
            </div>


            <br />

            <TableContainer component={Paper}>
                <TextField onChange={e => filterproperties(e)} className='search-property-field' id="outlined-basic" label="Search" variant="outlined" value={search} />
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID#</TableCell>
                            <TableCell align="right">Property Name</TableCell>
                            {/* <TableCell align="right">Manager</TableCell> */}
                            {/* <TableCell align="right">Total Tenants</TableCell> */}
                            {/* Total open workorders */}
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
                                        <span className='workorderId' onClick={openPropertyView} title='Open Property View'>{property.id}</span>
                                    </TableCell>
                                    <TableCell align="right">{property.name}</TableCell>
                                    <TableCell align="right">{property.address1}</TableCell>
                                    <TableCell align="right">{property.email}</TableCell>
                                    <TableCell align="right">{property.phone}</TableCell>
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
