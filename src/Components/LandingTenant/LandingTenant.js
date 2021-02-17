import { useState } from 'react';

const LandingTenant = () => {

    const [input, setInput] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        verPassword: '',
        property: ''
    });

    const [registeredView, setRegisteredView] = useState(false);


    const handletoggle = () => {
        setRegisteredView(!registeredView);
    }

    const handleInputChange = e => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    //TODO Implement post request for handeling registering and login

    return (
        <div>
            <section className='container tenant-landing-container'>
                <section className='input-fields'>
                    {registeredView ?

                        (
                            <><h1>Register</h1>
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
                                <label>Property:</label>
                                <select onChange={e => handleInputChange(e)} defaultValue='Select Property' name='properties'>
                                    <option value='Select Property' disabled >Choose here</option>
                                    <option name='property' value='property-1'>property-1</option>
                                    <option name='property' value='property-2'>property-2</option>
                                    <option name='property' value='property-3'>property-3</option>
                                    <option name='property' value='property-4'>property-4</option>
                                </select>
                                <button className='btn signup-btn'>Sign Up</button>
                                <p>Already have an account? <span onClick={() => handletoggle()}>Login Here</span></p>
                            </>
                        ) : (
                            <>
                                <button className='btn login-btn'>Login</button>
                                <p>Don't have an account? <span onClick={() => handletoggle()}>Register Here</span></p>
                            </>)}

                </section>
            </section>

        </div>
    )
}

export default LandingTenant;