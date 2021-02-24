import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { getUser } from '../../redux/reducers/userReducer'
import './LandingAdmin.css'
import { Link } from 'react-router-dom';

const LandingAdmin = (props) => {
    const [registerView, setRegisterView] = useState(false)
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [verPassword, setVerPassword] = useState('')
    const [propertyid, setPropertyid] = useState(0)
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState('staff');
    const [properties, setProperties] = useState([]);
    // const [landlordid, setlandlordid] = useState(0)
    const [LLForm, setLLForm] = useState(false);

    useEffect(() => {
        axios.get('/api/properties')
            .then(properties => {
                setProperties(properties.data);
            })
    }, [])

    function register(e) {
        e.preventDefault();
        if (password && password === verPassword) {
            if (role === 'staff') {
                axios.post('/api/staff/register',
                    {
                        firstname, lastname, email, password, phone, propertyid
                    })
                    .then(res => {
                        props.history.push('/staffdash')
                        props.getUser(res.data)
                    })
                    .catch(err => alert(err.response.data))
            } else if (role === 'manager') {
                axios.post('/api/manager/register',
                    {
                        landlordid: 1, propertyid, firstname, lastname, email, password, phone
                    })
                    .then(res => {
                        props.history.push('/managerdash')
                        props.getUser(res.data)
                    })
                    .catch(err => alert(err.response.data))
            }

            else if (role === 'landlord') {
                axios.post('/api/landlord/register',
                    {
                        firstname, lastname, email, password, phone
                    })
                    .then(res => {
                        props.history.push('/landlorddash')
                        props.getUser(res.data)
                    })
                    .catch(err => alert(err.response.data))
            }
        }

    }

    function login(e) {
        e.preventDefault();
        if (role === 'staff') {
            axios.post('/api/staff/login', { email, password })
                .then(res => {
                    props.history.push('/staffdash')
                    props.getUser(res.data)
                })
                .catch(err => alert(err.response.data))
        }
        else if (role === 'manager') {
            axios.post('/api/manager/login', { email, password })
                .then(res => {
                    props.history.push('/managerdash')
                    props.getUser(res.data)
                })
                .catch(err => alert(err.response.data))
        }
        else if (role === 'landlord') {
            axios.post('/api/landlord/login', { email, password })
                .then(res => {
                    props.history.push('/landlorddash')
                    props.getUser(res.data)
                })
                .catch(err => alert(err.response.data))
        }
    }

    const toggle = () => {
        setRegisterView(!registerView)
    }

    const toggleStaff = () => {
        setLLForm(false);
        setRole('staff');
        document.getElementById('landingContent').style.backgroundColor = 'grey';
    }

    const toggleManager = () => {
        setLLForm(false);
        setRole('manager');
        document.getElementById('landingContent').style.backgroundColor = 'red';
    }

    const toggleLandlord = () => {
        toggleLandlordForm();
        setRole('landlord');
        document.getElementById('landingContent').style.backgroundColor = 'green';
    }

    const toggleLandlordForm = () => {
        setLLForm(true);
    }
    return (
        <div >
            <section id='landingadmin'>
                <div id='landingToggle'>
                    <button id='staffBtn' onClick={toggleStaff}>Staff</button>
                    <button id='managerBtn' onClick={toggleManager} >Manager</button>
                    <button id='landlordBtn' onClick={toggleLandlord} >Landlord</button>
                </div>
                <form id='landingContent' onSubmit={registerView ? register : login}>


                    {registerView ? (
                        <>
                            <input placeholder='First Name' type='text' onChange={e => setFirstName(e.target.value)} />
                            <input placeholder='Last Name' type='text' onChange={e => setLastName(e.target.value)} />
                        </>
                    ) : null}

                    <input placeholder='Email' type='text' onChange={e => setEmail(e.target.value)} />
                    <input placeholder='Password' type='password' onChange={e => setPassword(e.target.value)} />

                    {registerView ? (
                        <>
                            <input placeholder='Verify Password' type='password' onChange={e => setVerPassword(e.target.value)} />
                            <input type='number' placeholder='Phone Number' max='12' onChange={e => setPhone(e.target.value)} />

                            {/* Sign up for specific property */}
                            {!LLForm ? (
                                <>
                                    <label>Property:</label>
                                    <select onChange={e => setPropertyid(e.target.value)} defaultValue='Select Property' >
                                        <option value='Select Property' disabled >Choose here</option>
                                        {properties.map((property, index) => (
                                            <option key={index} value={property.id}>{property.name}</option>
                                        ))}
                                    </select>
                                    <input type='password' placeholder='Property Passcode' />
                                </>
                            ) : null}

                            <button onClick={register}>Submit</button>
                            <p>Already have an account <span className='toggleAuth' onClick={toggle}>Login</span> </p>


                        </>
                    ) : (
                            <>
                                <button onClick={login}>Login</button>
                                <p>Don't have an account? <span className='toggleAuth' onClick={toggle}>Register</span></p>
                                <p>To login as tenant click <Link to='/'>Here</Link></p>
                            </>
                        )}

                </form>
            </section>
        </div>
    )
}
export default connect(null, { getUser })(LandingAdmin);
