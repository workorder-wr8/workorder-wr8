import { useState, useEffect } from 'react';
import './Comments.css';

const Comments = props => {

    const [comments, setComments] = useState([]);
    return (
        <section className='className=' comments>
            <p className='comment-header'>Comments:</p>
            <p className='comment'>this is a test comment lorem iipsu lthe lord of the rings the retun of the king</p>
        </section>
    )
}

export default Comments;