import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { getUser } from '../../redux/reducers/userReducer'
import './LandingAdmin.css'

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
                    .catch(err => console.log(err.response.data))
            } else {
                axios.post('/api/manager/register',
                    {
                        landlordid: 1, propertyid, firstname, lastname, email, password, phone
                    })
                    .then(res => {
                        props.history.push('/managerdash')
                        props.getUser(res.data)
                    })
                    .catch(err => console.log(err.response.data))
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
                .catch(err => console.log(err.response.data))
        }
        else if (role === 'manager') {
            axios.post('/api/manager/login', { email, password })
                .then(res => {
                    props.history.push('/managerdash')
                    props.getUser(res.data)
                })
                .catch(err => console.log(err.response.data))
        }
    }

    const toggle = () => {
        setRegisterView(!registerView)
    }

    const toggleStaff = () => {
        setRole('staff');
        document.getElementById('landingContent').style.backgroundColor = 'grey';
    }

    const toggleManager = () => {
        setRole('manager');
        document.getElementById('landingContent').style.backgroundColor = 'red';
    }

    // console.log(property)
    return (
        <div >
            <section id='landingadmin'>
                <div id='landingToggle'>
                    <button onClick={toggleStaff}>Staff</button><button onClick={toggleManager}>Manager</button>
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
                            <label>Property:</label>
                            <select onChange={e => setPropertyid(e.target.value)} defaultValue='Select Property' >
                                <option value='Select Property' disabled >Choose here</option>
                                {properties.map((property, index) => (
                                    <option key={index} value={property.id}>{property.name}</option>
                                ))}
                            </select>
                            <input type='password' placeholder='Property Passcode' />

                            <button onClick={register}>Submit</button>
                            <p>Already have an account <span onClick={toggle}>Login</span> </p>


                        </>
                    ) : (
                            <>
                                <button onClick={login}>Login</button>
                                <p>Don't have an account? <span onClick={toggle}>Register</span></p>
                            </>
                        )}

                </form>
            </section>
        </div>
    )
}
export default connect(null, { getUser })(LandingAdmin);
