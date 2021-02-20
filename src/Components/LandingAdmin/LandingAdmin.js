import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './LandingAdmin.css'

const LandingAdmin = (props) => {
    const [registerView, setRegisterView] = useState(false)
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [verPassword, setVerPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState('staff');

    useEffect(() => {
        document.getElementById('landingContent').style.backgroundColor = 'grey';
    }, [])

    function register(e) {
        e.preventDefault();
        if (password && password === verPassword) {
            if (role === 'staff') {
                axios.post('/api/staff/register',
                    {
                        firstname, lastname, email, password, phone
                    })
                    .then(res => {
                        props.history.push('/staffdash')
                        //updateUser from reducer
                    })
                    .catch(err => console.log(err.response.data))
            } else {
                axios.post('/api/manager/register',
                    {
                        landlordid: 1, propertyid: 1, firstname, lastname, email, password, phone
                    })
                    .then(res => {
                        props.history.push('/managerdash')
                        //updateUser from reducer
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
                })
                .catch(err => console.log(err.response.data))
        }
        else if (role === 'manager') {
            axios.post('/api/manager/login', { email, password })
                .then(res => {
                    props.history.push('/managerdash')
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
export default LandingAdmin;
