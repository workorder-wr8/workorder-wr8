import axios from 'axios'
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import './CreateWorkOrder.css';

const CreateWorkOrder = (props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [show, setShow] = useState(false);
    const createWO = () => {
        axios.post('/api/workorder/create', {
            title: title,
            description: description
        }).then(res => {
            props.history.push('/dash');
        })
    }

    return (
        <div className='workorder-form-container'>
            
            <h1>Create a Workorder here</h1>
            <form className='workorder-form'>

                <TextField
                    className='workorder-text-field'
                    onChange={e => setTitle(e.target.value)}
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                />


                <TextField
                    className='workorder-text-field'
                    onChange={e => setDescription(e.target.value)}
                    id="outlined-basic"
                    label="Description"
                    multiline
                    rows={6}
                    variant="outlined"
                />
                <Button className='submit-workorder-btn' variant="contained" onClick={createWO}>Submit<FontAwesomeIcon icon={faPaperPlane} /></Button>
            </form>
        </div>
    )
}
export default CreateWorkOrder