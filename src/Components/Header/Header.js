import axios from 'axios'
import { useEffect } from 'react';
import './Header.css';
import { connect } from 'react-redux';
import { getUser, clearUser } from '../../redux/reducers/userReducer';
import { withRouter } from 'react-router-dom';

function Header(props) {

    const { getUser } = props;
    useEffect(() => {
        axios.get('/api/tenant/me')
            .then(user => getUser(user.data));
    },[getUser]);

    const logout = () => {
        axios.get('/api/logout')
            .then(() => {
                props.clearUser();
                props.history.push('/')
            });
    }

    console.log('header', props)
    return (
        <header className='navbar'>

            {props.location.pathname === '/' || props.location.pathname === '/admin' ? (
                null
            ) :
                (
                    <nav>
                        <ul className='nav-links'>
                            <li>FirstName, LastName</li>
                            <li>Name of Property</li>
                            <li><button onClick={logout}>Logout</button></li>
                        </ul>
                    </nav>
                )}



        </header>
    )
}

export default withRouter(connect(null, { getUser, clearUser })(Header));