import { useState } from 'react';
import axios from 'axios';
import './AddComment.css';

const AddComment = props => {
    const [input, setInput] = useState('');

    const handleInput = e => {
        setInput(e.target.value);
    }

    const addComment = () => {
        const content = input;
        const { workorderid } = props;
        axios.post('/api/addcomment/tenant', { workorderid, content })
            .then(() => props.getComments())
    }

    return (
        <section className='add-comment-container'>
            add comment tenant
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

export default AddComment;