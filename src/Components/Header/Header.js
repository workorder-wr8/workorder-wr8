import axios from 'axios'
import { useState, useEffect } from 'react';
import './Header.css';
import { connect } from 'react-redux';
import { getUser, clearUser } from '../../redux/reducers/userReducer';
import { withRouter } from 'react-router-dom';

function Header(props) {

    const { getUser } = props;
    useEffect(() => {
        axios.get('/api/tenant/me')
            .then(user => getUser(user.data));
    }, [getUser]);

    const logout = () => {
        axios.get('/api/logout')
            .then(() => {
                props.clearUser();
                props.history.push('/')
            });
    }

    // console.log(props)
    return (
        <header className='navbar'>

            {props.location.pathname === '/' || props.location.pathname === '/admin' ? (
                null
            ) :
                (
                    <nav>
                        <ul className='nav-links'>
                            <li>{props.user.firstname}, {props.user.lastname}</li>
                            <li>{props.user.name}</li>
                            <li><button onClick={logout}>Logout</button></li>
                        </ul>
                    </nav>
                )}



        </header>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default withRouter(connect(mapStateToProps, { getUser, clearUser })(Header));