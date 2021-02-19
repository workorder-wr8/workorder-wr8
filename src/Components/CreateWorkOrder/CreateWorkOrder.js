import axios from 'axios'
import React, { useState } from 'react';
import './CreateWorkOrder.css'

const CreateWorkOrder = (props) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const createWO = () => {
        console.log('CREATING')
        axios.post('/api/workorder/create', {
            title: title,
            description: description
        }).then(res => {
            props.history.push('/tenantdash');
        })
    }

    // console.log(props);
    return (
        <div>
            CreateWorkOrder
            <form >
                <label for='title'>Title: </label>
                <input type='text' id='title' onChange={e => setTitle(e.target.value)} />
                <label for='description'>Description: </label>
                <input type='text' id='description' onChange={e => setDescription(e.target.value)} />
                <button type='button' onClick={createWO}>Submit</button>
            </form>
        </div>
    )
}
export default CreateWorkOrder