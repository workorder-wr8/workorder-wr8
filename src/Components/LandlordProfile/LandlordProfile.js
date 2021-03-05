import React, { useState } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';

function LandlordProfile(props) {
    const { firstname, lastname, email, phone } = props.user
    function goBack() {
        props.history.goBack()
    }

    return (
        <div className='property-profile-container'>
            <Button className='back-to-dashboard' id='back-to-dashboard' onClick={goBack}>Go Back</Button>
            <h1 id='propertyname'>{firstname} {lastname}</h1>
            <div className='property-info'>
                <h4>Email: <span className='property-info-details'>{email}</span></h4>
                <h4>Phone Number: <span className='property-info-details'> {phone}</span></h4>
            </div>
        </div>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(LandlordProfile);