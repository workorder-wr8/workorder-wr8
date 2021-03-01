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
        const id = props.location.pathname.substring(16);
        // console.log(id)
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
                    <h4 id='workorder-title'>{title}</h4>
                    <span>#{id}</span>
                </div>
                <div className='workorder-details'>
                    <h3 id='status-workorder'>Status: {status}</h3>
                    <div className='status-updates'>
                        <span>Created: {dayjs(datecreated).format('dddd MMMM D YYYY h:mm A')}</span>
                        {lastupdated === null
                            ?
                            null
                            :
                            <span>Last Updated: {dayjs(lastupdated).format('dddd MMMM D, YYYY h:mm A')}</span>
                        }
                        {datecompleted === null
                            ?
                            null
                            :
                            <span>Date Completed: {dayjs(datecompleted).format('dddd MMMM D, YYYY h:mm A')}</span>
                        }
                    </div>
                </div>
                <div className='workorder-description'>
                    <h3 id='description-workorder'>Workorder Description:</h3>
                    <p>{description}</p>
                </div>
            </>
        )
    }
    console.log('workorder', props)
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
