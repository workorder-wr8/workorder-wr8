import axios from 'axios'
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import './CreateWorkOrder.css';

const CreateWorkOrder = (props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [show, setShow] = useState(false);
    const[message, setMessage] = useState('');
    const createWO = () => {
        axios.post('/api/workorder/create', {
            title: title,
            description: description
        }).then(res => {
            setMessage('Workorder created. We will get to as soon as possible.');setShow(!show);
            setTimeout(()=> {props.history.push('/dash');}, 2000)
            
        })
    }

    return (
        <div className='workorder-form-container'>
            <h1 className='wo-form-header'>Create a Workorder here</h1>
            {show ? <Alert className='wo-created fade' severity="success">{message}</Alert> : null}
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
                <section className='form-controls-wo'>
                    <Button className='btn submit-workorder-btn' type='submit' variant="contained" onClick={createWO}>Submit<FontAwesomeIcon icon={faPaperPlane} /></Button>
                    <Button className='btn go-back' variant="contained" onClick={() => props.history.goBack()}>Go Back<FontAwesomeIcon icon={faChevronCircleLeft} /></Button>
                </section>
            </form>
        </div>
    )
}
export default CreateWorkOrder