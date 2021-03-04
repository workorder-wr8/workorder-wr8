import React from 'react'
import { connect } from 'react-redux'

function StaffProfile(props) {

    console.log('staffinfo:', props)
    return (
        <section>
            StaffProfile
        </section>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(StaffProfile)