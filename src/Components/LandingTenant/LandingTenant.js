import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../redux/reducers/userReducer';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './LandingTenant.css'
import axios from 'axios';
import { Link } from 'react-router-dom';


const LandingTenant = props => {
    const [input, setInput] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        verPassword: '',
        address1: '',
        property: 0,
        manager: 0,
        landlord: 0,
        city: '',
        state: '',
        zip: '',
        unitNumber: ''
    });

    const [properties, setProperties] = useState([]);

    const [registeredView, setRegisteredView] = useState(false);

    useEffect(() => {
        axios.get('/api/properties')
            .then(properties => {
                setProperties(properties.data);
            })
    }, []);

    const handleToggle = () => {
        setRegisteredView(!registeredView);
    }

    const handleInputChange = e => {
        setInput({ ...input, [e.target.name]: e.target.value });

    }

    const handleSelectChange = (e) => {
        const propertyID = + e.target.value;
        const property = properties.find(prop => prop.id = propertyID);
        setInput({
            ...input,
            property: property.id,
            manager: property.manager_id,
            landlord: property.landlord_id,
            address1: property.address1,
            state: property.state,
            city: property.city,
            zip: property.zip
        });
    }

    const login = (e) => {
        e.preventDefault();
        let email = input.email;
        let password = input.password;
        axios.post('/api/tenant/login', { email, password })
            .then(tenant => {
                props.getUser(tenant.data);
                props.history.push('/dash');
            })
            .catch(err => alert(err.response.data));
        //error alerting twice
    }


    const register = (e) => {
        e.preventDefault();
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            property,
            address1,
            city,
            state,
            zip,
            unitNumber,
            landlord,
            manager
        } = input;

        axios.post('/api/tenant/register', {
            firstName,
            lastName,
            email,
            phone,
            password,
            property,
            address1,
            city,
            state,
            zip,
            unitNumber,
            landlord,
            manager
        })
            .then(tenant => {
                props.getUser(tenant.data);
                //USE REDUX TO SET THEM ON STATE
                props.history.push('/dash');
            })
            .catch(err => alert(err.response.data))

    }

    return (
        <div id='landingtenant'>
            <h1 className='app-heading'>App Name Here</h1>
            <section className='container tenant-landing-container'>
                <section className='input-fields'>
                    <form className='landing-form' onSubmit={registeredView ? register : login}>
                        {registeredView ?

                            (
                                <>
                                    <h1 className='form-heading' >Register</h1>
                                    <TextField onChange={e => handleInputChange(e)} className='tenant-field fade-in' name='firstName' label='First Name' value={input.firstName} type='text' />
                                    <TextField onChange={e => handleInputChange(e)} className='tenant-field fade-in' name='lastName' label='Last Name' value={input.lastName} type='text' />
                                </>
                            )
                            : (
                                <>
                                    <h1 className='form-heading' >Login</h1>
                                </>
                            )}
                        <TextField onChange={e => handleInputChange(e)} className='tenant-field' name='email' label='Email' value={input.email} type='text' />
                        <TextField onChange={e => handleInputChange(e)} className='tenant-field' name='password' label='Password' value={input.password} type='password' />
                        {registeredView ?
                            (
                                <>
                                    <TextField onChange={e => handleInputChange(e)} className='tenant-field fade-in' name='verPassword' label='Verify Password' value={input.verPassword} type='password' />
                                    <TextField onChange={e => handleInputChange(e)} type='tel' className='tenant-field fade-in' name='phone' label='Phone' value={input.phone} />
                                    <Select onChange={e => handleSelectChange(e)} defaultValue='Select Property' name='property'>
                                        <MenuItem value='Select Property' id='default-select' disabled >Property</MenuItem>
                                        {properties.map((property, index) => (
                                            <MenuItem key={index} value={property.id}>{property.name}</MenuItem>
                                        ))}
                                    </Select>
                                    <TextField onChange={e => handleInputChange(e)} value={input.unitNumber} label='Unit Number' className='tenant-field fade-in' name='unitNumber' type='text' />
                                    <Button className='btn signup-btn' onClick={register}>Sign Up</Button>
                                    <p>Already have an account? <span className='toggleAuth' onClick={() => handleToggle()}>Login Here</span></p>
                                </>
                            ) : (
                                <>
                                    <Button className='btn login-btn' onClick={login} variant="contained">Login</Button>
                                    <p>Don't have an account? <span className='toggleAuth' onClick={() => handleToggle()}>Register Here</span></p>
                                    <p>For admin access click <Link to='/admin'>Here</Link></p>
                                </>)}
                    </form>
                </section>
            </section>
        </div >
    )
}

export default connect(null, { getUser })(LandingTenant);