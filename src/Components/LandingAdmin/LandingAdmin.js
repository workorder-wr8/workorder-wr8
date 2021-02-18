import axios from 'axios';
import React, { useState } from 'react';
import './LandingAdmin.css'

export default function LandingAdmin() {
    const [registerView, setRegisterView] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [verPassword, setVerPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState('');

    function register() {
        if(role === 'staff') {
            axios.post('/api/staff/register',
            {
                firstname: firstName,
                lastname: lastName,
                email: email,
                password: password,
                phone: phone 
            })
            .then (res=> {
                this.props.history.push('/staffdash')
                //updateUser from reducer

            })
        } else {
            axios.post('/api/manager/register',
            {
                firstname: firstName,
                lastname: lastName,
                email: email,
                password: password,
                phone: phone
            })
            .then (res=> {
                this.props.history.push('/managerdash')
                //updateUser from reducer
            }) 
        }
    }

    const toggle = () => {
        setRegisterView(!registerView)
    }

    return (
        <div >
            <section id='landingadmin'>

                <div id='landingToggle'>
                    <button onClick={_=>setRole('staff')}>Staff</button><button onClick={_=>setRole('manager')}>Manager</button>
                </div>
                <br />

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
                            <button>Login</button>
                            <p>Don't have an account? <span onClick={toggle}>Register</span></p>
                        </>
                    )}
            </section>
        </div>
    )
}
