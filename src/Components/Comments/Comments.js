import { useState, useEffect } from 'react';
import axios from 'axios';
import AddComment from './AddComment';
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
        const workOrderComments = comments.map(comment => (
            <article key={comment.message_id} className='comment-container'>
                {comment.sender_id === comment.staffid || comment.sender_id === comment.managerid || comment.sender_id === comment.tenantid
                    ?
                    <p className='my-comment'>{comment.content}</p>

                    :
                    <p className='their-comment'>{comment.content}</p>

                }
            </article>
        ))
        return workOrderComments;
    }

    return (
        <section className='className='>
            <p className='comment-header'>Comments:</p>
            <AddComment workorderid={props.workorderid} getComments={getComments}/>
            {displayComments()}
        </section>
    )
}

export default Comments;