import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import './LandlordDash.css'
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
        let landlordid = props.user.id
        let landlordfirst = props.user.firstname;
        const { name, address1, address2, city, state, zip, email, phone, passcode, managerEmail } = input
        let body = { landlordid, name, address1, address2, city, state, zip, email, phone, passcode }
        axios.post('/api/property/new', body)
            .then(res => {
                props.history.push('/landlorddash')
                off()
            })
            .catch(err => console.log(err))
        if (managerEmail) {
            axios.post('/api/email', { managerEmail, landlordfirst })
                .catch(err => console.log(err))
        }
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

    // console.log()
    return (
        <div>
            <div id="overlay" onClick={off}>
                <p className='closebtn' onClick={off} title="Close overlay">✕</p>
                <div id="text" onClick={e => e.stopPropagation()}>
                    <form id='addProperty' className='add-property-form' onSubmit={addProperty}>
                        <TextField name='name' type='text' label='Property Name' value={input.name} onChange={e => handleInputChange(e)} />
                        <TextField name='address1' type='text' label='Address 1' value={input.address1} onChange={e => handleInputChange(e)} />
                        <TextField name='address2' type='text' label='Address 2' value={input.address2} onChange={e => handleInputChange(e)} />
                        <TextField name='city' type='text' label='City' value={input.city} onChange={e => handleInputChange(e)} />
                        <TextField name='state' type='text' label='State' value={input.state} onChange={e => handleInputChange(e)} />
                        <TextField name='zip' type='text' label='Zip' value={input.zip} onChange={e => handleInputChange(e)} />
                        <TextField name='email' type='text' label='Email' value={input.email} onChange={e => handleInputChange(e)} />
                        <TextField name='phone' type='text' label='Phone' value={input.phone} onChange={e => handleInputChange(e)} />
                        <TextField name='passcode' type='password' label='Passcode' value={input.passcode} onChange={e => handleInputChange(e)} />
                        <TextField name='verpasscode' type='password' label='Confirm Passcode' value={input.verpasscode} onChange={e => handleInputChange(e)} />

                        {toggleAdd ? (
                            <>
                                <span title='Close' onClick={toggleadd} style={{ fontSize: '20px', marginTop: '8px' }}>Close Add Manager</span>
                                {/* <label>Manager Email:</label>
                                <input name='managerEmail' type='text' value={input.managerEmail} onChange={e => handleInputChange(e)} /> */}
                                <TextField name='managerEmail' type='text' label='Manager Email' value={input.managerEmail} onChange={e => handleInputChange(e)} />
                            </>
                        ) : (
                                <>
                                    <p onClick={toggleadd} id='addManager'>Add a Manager <span >+</span></p>
                                </>
                            )}

                        <Button type='submit' className='add-btn' onClick={addProperty}>Submit</Button>
                    </form>
                </div>
            </div>
            <div className='property-controls'>
                <Button className='add-property-btn' onClick={on}>Add a new property</Button>
                <TextField onChange={e => filterproperties(e)} className='search-workorder-field' id="outlined-basic" label="Search" variant="outlined" value={search} />
            </div>
            <TableContainer className='table-container' component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID#</TableCell>
                            <TableCell align="right">Property Name</TableCell>
                            <TableCell align="right">Address</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Phone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties
                            .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
                            .map(property => (
                                <TableRow key={property.id} className='workorderId' title='Open Property View' onClick={openPropertyView}>
                                    <TableCell component="th" scope="row">
                                        {property.id}
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
