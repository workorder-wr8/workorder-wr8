import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import './StaffProfile.css';

const StaffProfile = ({ user, history }) => {

    console.log('staffinfo:', user)
    const { email, firstname, lastname, name, phone } = user;
    const { goBack } = history;
    const displayStaff = () => {
        return (
            <article className='staff-info'>
                <h3 className='staff-header-name'>Name: {firstname} {lastname}</h3>
                <div>
                    <p className='property-name'><span className='information'>Property:</span> {name}</p>
                    <h3>Contact Info</h3>
                    <p><span className='information'>Email:</span> {email}, <span className='information'>Phone:</span> {phone}</p>
                </div>
            </article>
        )
    }
    console.log('ddd', history)
    return (
        <section className='profile-container'>
            <Button className='back-to-dashboard' onClick={() => goBack()}>Back to Dashboard</Button>
            <h2>Staff Information</h2>
            {displayStaff()}
        </section>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(StaffProfile)