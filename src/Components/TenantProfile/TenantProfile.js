import React from 'react'
import { connect } from 'react-redux'

function TenantProfile(props) {
    const goToDashboard = () => {
        props.history.push('/dash')
    }
    console.log('tenantinfo:', props)
    return (
        <section>
            <button onClick={goToDashboard}>Go to Dashboard</button>
            TenantProfile
        </section>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(TenantProfile)