import { useState, useEffect } from 'react'
import './ManageWorkOrder.css';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import Comments from '../Comments/Comments';

const ManageWorkOrder = (props) => {
    const [workOrder, setWorkOrder] = useState([]);

    useEffect(() => {
        // if (id) {
        //     getWorkOrder()
        // }

        // if (props.location.pathname.includes('/staffdash')) {
        //     setId( + props.location.pathname.substring(21));
        // } else if (props.location.pathname.includes('/dash')) {
        //     setId(+ props.location.pathname.substring(16));
        // }
        getWorkOrder();
    }, [])

    const getWorkOrder = () => {
        axios.get(`/api/workorder/${props.location.id}`)
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
                    <h2 id='workorder-title'>{title}</h2>
                    <span>#{id}</span>
                </div>
                <div className='workorder-details'>
                    <h3 id='status-workorder'>Status: {status}</h3>
                    <div className='status-updates'>
                        <span className='status-update-workorder'>Created: {dayjs(datecreated).format('dddd MMMM D YYYY h:mm A')}</span><br />
                        {lastupdated === null
                            ?
                            null
                            :
                            <>
                                <span>Last Updated: {dayjs(lastupdated).format('dddd MMMM D, YYYY h:mm A')}</span>
                            </>

                        }
                        {datecompleted === null
                            ?
                            null
                            :
                            <>
                                <br />
                                <span>Date Completed: {dayjs(datecompleted).format('dddd MMMM D, YYYY h:mm A')}</span>
                            </>

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
