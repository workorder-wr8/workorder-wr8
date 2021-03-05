import React from 'react'
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import './TenantProfile.css';

const TenantProfile = ({ user, history }) => {
    const { address1, city, email, firstname, lastname, name, phone, state, unitnumber } = user;
    const { goBack } = history;
    const displayTenant = () => {
        return (
            <article className='tenant-info'>
                <h3>Tenant: {firstname} {lastname}</h3>
                <div>
                    <p className='property-name'><span className='information'>Property:</span> {name}, <span className='information'>Unit:</span> {unitnumber}</p>
                    <p><span className='information'>Address: </span>{address1}, {city} {state}</p>
                    <p><span className='information'>Email:</span> {email}, <span className='information'>Phone:</span> {phone}</p>
                </div>
            </article>
        )
    }

    return (
        <section className='profile-container'>
            <Button className='back-to-dashboard' onClick={() => goBack()}>Back to Dashboard</Button>
            <h2>My Information</h2>
            {displayTenant()}
        </section>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(TenantProfile)