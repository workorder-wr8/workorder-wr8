import React from 'react'
import { connect } from 'react-redux'

function ManagerProfile(props) {

    console.log('managerinfo:', props)
    return (
        <section>
            ManagerProfile
        </section>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(ManagerProfile)