import axios from 'axios'
import React from 'react'
import './Header.css'
import { withRouter } from 'react-router-dom'
let session = require('express-session');

function Header(props) {
    const logout = () => {
        axios.get('/api/logout')
            .then(res => {
                props.history.push('/')
            })
    }

    return (
        <header className='navbar'>

            {props.location.pathname === '/' || props.location.pathname === '/admin' ? (
                null
            ) :
                (
                    <nav>
                        <ul className='nav-links'>
                            {/* <li>{req.session.user.firstname, ' ', req.session.user.lastname}</li> */}
                            <li>FirstName, LastName</li>
                            <li>Name of Property</li>
                            <li><button onClick={logout}>Logout</button></li>
                        </ul>
                    </nav>
                )}



        </header>
    )
}

export default withRouter(Header)