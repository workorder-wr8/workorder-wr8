import React from 'react'
import { connect } from 'react-redux'

function TenantProfile(props) {

    console.log('tenantinfo:', props)
    return (
        <section>
            TenantProfile
        </section>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(TenantProfile)