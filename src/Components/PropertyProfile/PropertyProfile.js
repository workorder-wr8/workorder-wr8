import React from 'react'
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'
import './PropertyProfile.css'

function PropertyProfile(props) {

    const { name, propaddress, propcity, propemail, propertyid, propphone, propstate, propzip } = props.user

    function goBack() {
        props.history.goBack()
    }

    return (
        <div className='property-profile-container'>
            <Button className='back-to-dashboard' id='back-to-dashboard' onClick={goBack}>Go Back</Button>
            <h1 id='propertyname'>{name}</h1>
            <div className='property-info'>
                <h4>Email: <span className='property-info-details'>{propemail}</span></h4>
                <h4>Phone Number: <span className='property-info-details'> {propphone}</span></h4>
                <h4>Address: <span className='property-info-details'>{propaddress}, {propcity}, {propstate}, {propzip}</span></h4>
            </div>

        </div>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(PropertyProfile)