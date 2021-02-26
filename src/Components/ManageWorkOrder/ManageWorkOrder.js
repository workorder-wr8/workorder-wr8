import { useState, useEffect } from 'react'
import './ManageWorkOrder.css';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import Comments from '../Comments/Comments';

const ManageWorkOrder = (props) => {

    const [workOrder, setWorkOrder] = useState([]);

    useEffect(() => {
        getWorkOrder();
    }, [])

    const getWorkOrder = () => {
        const { id } = props.location;
        axios.get(`/api/workorder/${id}`)
            .then(res => {
                setWorkOrder(res.data[0]);
            })
            .catch(err => console.log(`Error: ${err.message}`));
    }

    const displayWorkOrder = () => {
        const { title, datecompleted, datecreated, lastupdated, description, id, status } = workOrder;
        return (
            <>
                <div className='workorder-title'>
                    <h4>{title}</h4>
                    <span>#{id}</span>
                </div>
                <div className='workorder-description'>
                    <p>{description}</p>
                </div>
                <div className='workorder-details'>
                    <span>Status: {status}</span>
                    <span>Created at: {dayjs(datecreated).format('MMMM D, YYYY h:mm A')}</span>
                    {lastupdated === null
                        ?
                        null
                        :
                        <span>Updated at: {dayjs(lastupdated).format('MMMM D, YYYY h:mm A')}</span>
                    }
                    {datecompleted === null
                        ?
                        null
                        :
                        <span>{dayjs(datecompleted).format('MMMM D, YYYY h:mm A')}</span>
                    }
                </div>
            </>
        )
    }

    return (
        <section className='workorder-container'>
            <button className='close-workorder-btn' onClick={() => props.closeModal()}>Close</button>
            {displayWorkOrder()}
            <section className='comment-container'>
                <Comments workorderid={props.location.id} />
            </section>
        </section>
    )
}

export default withRouter(ManageWorkOrder);
