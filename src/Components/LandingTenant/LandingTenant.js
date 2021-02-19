import { useEffect, useState } from 'react';
import axios from 'axios';

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

    const login = () => {
        let email = input.email;
        let password = input.password;
        axios.post('/api/tenant/login', { email, password })
            .then(tenant => {
                //USE REDUX to set TENANT ON STAT
                props.history.push('/dash');
            })
            .catch(err => console.log(`Error: ${err.message}`));
    }

    const register = () => {
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
                //USE REDUX TO SET THEM ON STATE
                props.history.push('/dash');
            })
    }

    return (
        <div>
            <section className='container tenant-landing-container'>
                <section className='input-fields'>
                    {registeredView ?

                        (
                            <>
                                <h1>Register</h1>
                                <label>First Name:</label>
                                <input onChange={e => handleInputChange(e)} name='firstName' value={input.firstName} type='text' />
                                <label>Last Name:</label>
                                <input onChange={e => handleInputChange(e)} name='lastName' value={input.lastName} type='text' />
                            </>
                        )
                        : (
                            <>
                                <h1>Login</h1>
                            </>
                        )}
                    <label>Email:</label>
                    <input onChange={e => handleInputChange(e)} name='email' value={input.email} type='text' />
                    <label>Password:</label>
                    <input onChange={e => handleInputChange(e)} name='password' value={input.password} type='password' />
                    {registeredView ?
                        (
                            <>

                                <label>Verify Password:</label>
                                <input onChange={e => handleInputChange(e)} name='verPassword' value={input.verPassword} type='password' />
                                <label>Phone Number:</label>
                                <input onChange={e => handleInputChange(e)} type='tel' name='phone' value={input.phone} />
                                <label>Property:</label>
                                <select onChange={e => handleSelectChange(e)} defaultValue='Select Property' name='property'>
                                    <option value='Select Property' disabled >Choose here</option>
                                    {properties.map((property, index) => (
                                        <option key={index} value={property.id}>{property.name}</option>
                                    ))}
                                </select>
                                <label>Unit Number:</label>
                                <input onChange={e => handleInputChange(e)} value={input.unitNumber} name='unitNumber' type='text' />
                                <button className='btn signup-btn' onClick={() => register()}>Sign Up</button>
                                <p>Already have an account? <span onClick={() => handleToggle()}>Login Here</span></p>
                            </>
                        ) : (
                            <>
                                <button className='btn login-btn' onClick={() => login()}>Login</button>
                                <p>Don't have an account? <span onClick={() => handleToggle()}>Register Here</span></p>
                            </>)}

                </section>
            </section>
        </div>
    )
}

export default LandingTenant;