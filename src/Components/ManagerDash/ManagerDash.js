import React from 'react'
import { connect } from 'react-redux'

function ManagerDash(props) {
    console.log(props)
    return (
        <div>
            ManagerDash
        </div>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(ManagerDash)
