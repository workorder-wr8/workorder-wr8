import { useState, useEffect } from 'react';
import axios from 'axios';
import AddCommentTenant from './AddCommentTenant';
import AddCommentStaff from './AddCommentStaff';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import './Comments.css';

const Comments = props => {

    const [comments, setComments] = useState([]);

    useEffect(() => {
        getComments();
    }, []);

    const getComments = () => {
        const id = props.workorderid;
        axios.post('/api/commentsById', { id })
            .then(fetchedComments => setComments(fetchedComments.data))
            .catch(err => console.log(`Error: ${err.message}`));
    }

    const displayComments = () => {
        let id;
        if (props.user.tenantid) {
            id = props.user.tenantid;
        } else if (props.user.staffid) {
            id = props.user.staffid;
        } else {
            id = props.user.managerid;
        }
        const workOrderComments = comments.map(comment => {
            <article key={comment.message_id} className='comment-container'>
                {comment.sender_id === id
                    ?
                    <p className='my-comment'>{comment.content}@<span className='comment-timestamp'>{dayjs(comment.timesent).format('MMMM D, YYYY h:mm A')}</span></p>

                    :
                    <p className='their-comment'>{comment.content}@<span className='comment-timestamp'>{dayjs(comment.timesent).format('MMMM D, YYYY h:mm A')}</span></p>

                }
            </article>
        })
        return workOrderComments;
    }

    let addComment;
    if (props.user.tenantid) {
        addComment = <AddCommentTenant workorderid={props.workorderid} getComments={getComments} />
    } else if (props.user.staffid) {
        addComment = <AddCommentStaff workorderid={props.workorderid} getComments={getComments} />
    } else {
        <p>manager stuff here</p>
    }
    console.log('comments', props)
    return (
        <section>
            <p className='comment-header'>Comments:</p>

            <section className='comments'>
                {displayComments()}
            </section>
            {addComment}
        </section>
    )
}

const mapStateToProps = reduxState => {
    return {
        user: reduxState.userReducer.user
    }
}
export default connect(mapStateToProps)(Comments);