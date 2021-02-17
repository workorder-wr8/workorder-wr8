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


    const toggle = () => {
        setRegisterView(!registerView)
    }

    return (
        <div >
            <section id='landingadmin'>

                <div id='landingToggle'>
                    <button>Staff</button><button>Manager</button>
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
                        <button>Submit</button>
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
