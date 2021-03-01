import axios from 'axios'
import { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { connect } from 'react-redux';
import { getUser, clearUser } from '../../redux/reducers/userReducer';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom'

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
                if ((props.location.pathname.includes('manager') || props.location.pathname.includes('staff') || props.location.pathname.includes('landlord')))
                    props.history.push('/admin')
                else
                    props.history.push('/')
            });
    }

    return (
        <header className='navbar'>

            {props.location.pathname === '/' || props.location.pathname === '/admin' ? (
                null
            ) :
                (
                    <nav>
                        <ul className='nav-links'>
                            <li className='header-props'>Welcome {props.user.firstname}, {props.user.lastname}</li>
                            <li className='header-props property-title'>{props.user.name}</li>
                            {props.location.pathname === '/dash' ? <Link className='link' to='/create/workorder'><Button className='create-wo-btn'>Create Work Order</Button></Link> : null}
                            <li><Button className='btn logout-btn' onClick={logout}>Logout<FontAwesomeIcon className='logout-icon' icon={faSignOutAlt} /></Button></li>
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