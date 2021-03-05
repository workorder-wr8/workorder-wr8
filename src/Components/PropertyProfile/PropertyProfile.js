import React from 'react'
import { connect } from 'react-redux'
import './PropertyProfile.css'

function PropertyProfile(props) {

    const { name, propaddress, propcity, propemail, propertyid, propphone, propstate, propzip } = props.user

    function goBack() {
        props.history.goBack()
    }

    // console.log('propertyprofile props: ', props)

    return (
        <div className='property-profile-container'>
            <button className='goBackBtn' onClick={goBack}>Go Back</button>
            <h1 id='propertyname'>{name}</h1>
            <div className='property-info'>
                <h3>Email: {propemail}</h3>
                <h3>Phone Number: {propphone}</h3>
                <h3>Address: {propaddress}, {propcity}, {propstate}, {propzip}</h3>
            </div>

        </div>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(PropertyProfile)