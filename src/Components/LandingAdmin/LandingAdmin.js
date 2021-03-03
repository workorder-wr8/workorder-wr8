import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { getUser } from '../../redux/reducers/userReducer';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import isStrongPassword from 'validator/lib/isStrongPassword';
import isEmail from 'validator/lib/isEmail';
import Alert from '@material-ui/lab/Alert';
import './LandingAdmin.css'
import { Link } from 'react-router-dom';

const LandingAdmin = (props) => {
    const [registerView, setRegisterView] = useState(false);
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verPassword, setVerPassword] = useState('');
    const [propertyid, setPropertyid] = useState(0)
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('staff');
    const [properties, setProperties] = useState([]);
    const [passcode, setPasscode] = useState([]);
    const [LLForm, setLLForm] = useState(false);

    const [errorMessages, setErrorMessages] = useState([]);
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (props.location.pathname.includes('register')) {
            setRole('manager')
            setRegisterView(true)
            setEmail(props.location.pathname.substring(16))
        }
        axios.get('/api/properties')
            .then(properties => {
                setProperties(properties.data);
            })
    }, [])

    function register(e) {
        e.preventDefault();
        let isValidRegister = true;

        if (password !== verPassword) {
            isValidRegister = false;
            console.log('passwords don\'t match', password, verPassword)
             setErrorMessages([...errorMessages, 'Passwords Do Not Match!'])
        }

        if (!isStrongPassword(password)) {
            isValidRegister = false;
            console.log('weak password', !isStrongPassword(password), password)
             setErrorMessages([...errorMessages, 'Password needs to contain at least one number, uppercase letter, lowercase letter, and symbol.'])
        }

        if (!isEmail(email, { domain_specific_validation: true })) {
            isValidRegister = false;
            console.log('not Email')
             setErrorMessages([...errorMessages, 'Invalid email address!']);
        }

        setShow(true);
        setTimeout(() => {
            setShow(false);
            setErrorMessages([]);
        }, 2000);

        if (isValidRegister) {
            if (role === 'staff') {
                axios.post('/api/staff/register',
                    {
                        firstname, lastname, email, password, phone, propertyid, passcode
                    })
                    .then(res => {
                        props.history.push('/staffdash')
                        props.getUser(res.data)
                    })
                    .catch(err => alert(err.response.data))
            } else if (role === 'manager') {
                axios.post('/api/manager/register',
                    {
                        landlordid: 1, propertyid, firstname, lastname, email, password, phone, passcode
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

    const handleChange = (e) => {
        setEmail(e.target.value)
    }


    console.log('error ms', errorMessages);
    return (
        <div >

            <section id='landingadmin'>
                <h1 className='admin-landing-header'>Admin Portal</h1>
                {show
                    ?
                    <Alert severity="error">{errorMessages.map((message, index) => (
                        <p key={index}>{message}</p>
                    ))}</Alert>
                    :
                    null
                }

                <section>
                    <ButtonGroup variant='text' id='landingToggle'>
                        <Button id='staffBtn' className={role === 'staff' ? 'active btn' : 'default btn'} onClick={() => setRole('staff')} >Staff</Button>
                        <Button id='managerBtn' className={role === 'manager' ? 'active btn' : 'default btn'} onClick={() => setRole('manager')} >Manager</Button>
                        <Button id='landlordBtn' className={role === 'landlord' ? 'active btn' : 'default btn'} onClick={() => setRole('landlord')}  >Landlord</Button>
                    </ButtonGroup>
                    <form id='landingContent' onSubmit={registerView ? register : login}>
                        {registerView ? (
                            <>
                                <TextField className='admin-fields fade-in' label='First Name' type='text' onChange={e => setFirstName(e.target.value)} />
                                <TextField className='admin-fields fade-in' label='Last Name' type='text' onChange={e => setLastName(e.target.value)} />
                            </>
                        ) : null}

                        <TextField className='admin-fields' label='Email' type='text' onChange={handleChange} value={email} />
                        <TextField className='admin-fields' label='Password' type='password' onChange={e => setPassword(e.target.value)} />

                        {registerView ? (
                            <>
                                <TextField className='admin-fields fade-in' label='Verify Password' type='password' onChange={e => setVerPassword(e.target.value)} />
                                <TextField className='admin-fields fade-in' type='number' label='Phone Number' onChange={e => setPhone(e.target.value)} />


                                {!LLForm ? (
                                    <>
                                        <Select className='default-select' onChange={e => setPropertyid(e.target.value)} defaultValue='Select Property' >
                                            <MenuItem value='Select Property' disabled >Property</MenuItem>
                                            {properties.map((property, index) => (
                                                <MenuItem key={index} value={property.id}>{property.name}</MenuItem>
                                            ))}
                                        </Select>
                                        <TextField className='admin-fields fade-in' type='password' label='Property Passcode' onChange={e => setPasscode(e.target.value)} />
                                    </>
                                ) : null}
                                <section className='admin-controls'>
                                    <Button className='btn signup-admin-btn' type='submit' onClick={register}>Submit</Button>
                                    <p>Already have an account <span className='toggleAuth' onClick={toggle}>Login</span> </p>
                                </section>
                            </>
                        ) : (
                                <section className='admin-controls'>
                                    <Button className='btn login-admin-btn' type='submit' onClick={login}>Login</Button>
                                    <p>Don't have an account? <span className='toggleAuth' onClick={toggle}>Register</span></p>
                                    <p>To login as tenant click <Link to='/'>Here</Link></p>
                                </section>
                            )}

                    </form>
                </section>

            </section>
        </div>
    )
}
export default connect(null, { getUser })(LandingAdmin);
