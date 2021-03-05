import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import './ManagerProfile.css';

const ManagerProfile = ({ user, history }) => {

    const { firstname, lastname, name, email, phone } = user;
    const { goBack } = history;
    const displayManager = () => {
        return (
            <article className='manager-info'>
                <h3 className='manager-header-name'>Name: {firstname} {lastname}</h3>
                <div>
                    <p className='property-name'><span className='information'>Property:</span> {name}</p>
                    <h3>Contact Info</h3>
                    <p><span className='information'>Email:</span> {email}, <span className='information'>Phone:</span> {phone}</p>
                </div>
            </article>
        )
    }

    return (
        <section className='profile-container'>
            <Button className='back-to-dashboard' onClick={() => goBack()}>Back to Dashboard</Button>
            <h2>Manager Info</h2>
            {displayManager()}
        </section>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(ManagerProfile)