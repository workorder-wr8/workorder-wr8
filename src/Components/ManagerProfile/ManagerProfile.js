import React from 'react'
import { connect } from 'react-redux'

function ManagerProfile(props) {
    const goToDashboard = () => {
        props.history.push('/managerdash')
    }

    console.log('managerinfo:', props)
    return (
        <section>
            <button onClick={goToDashboard}>Go To Dashboard </button>
            ManagerProfile
        </section>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(ManagerProfile)