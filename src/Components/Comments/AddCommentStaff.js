import { useState } from 'react';
import axios from 'axios';
import './AddComment.css';

const AddCommentStaff = props => {
    const [input, setInput] = useState('');

    const handleInput = e => {
        setInput(e.target.value);
    }

    const addComment = () => {
        const content = input;
        const { workorderid } = props;
        axios.post('/api/addcomment/staff', { workorderid, content })
            .then(() => props.getComments())
    }

    return (
        <section className='add-comment-container'>
            Staff add comment
            <input
                onChange={e => handleInput(e)}
                value={input}
                placeholder='Comment'
                className='comment-input'
            />
            <button onClick={() => addComment()}>Add Comment</button>
        </section>
    )
}

export default AddCommentStaff;