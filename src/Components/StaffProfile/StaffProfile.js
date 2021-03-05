import React from 'react'
import { connect } from 'react-redux'

function StaffProfile(props) {
    const goToDashboard = () => {
        props.history.push('/staffdash')
    }

    console.log('staffinfo:', props)
    return (
        <section>
            <button onClick={goToDashboard}>Go To Dashboard </button>
            StaffProfile
        </section>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(StaffProfile)