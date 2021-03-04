import { useState } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
            .then(() => {
                props.getComments();
                setInput('');
            })
    }

    return (
        <section className='add-comment-container'>
            <TextField
                onChange={e => handleInput(e)}
                value={input}
                label='Comment'
                className='comment-input'
            />
            <Button class='addBtn-comment' onClick={() => addComment()}>Add Comment</Button>
        </section>
    )
}

export default AddComment;