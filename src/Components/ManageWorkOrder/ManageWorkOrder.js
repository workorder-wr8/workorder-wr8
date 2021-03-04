import { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import Button from '@material-ui/core/Button';
import Comments from '../Comments/Comments';
import './ManageWorkOrder.css';

const ManageWorkOrder = (props) => {
    const [workOrder, setWorkOrder] = useState([]);

    useEffect(() => {
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
                    <h2 id='wo-title'>{title} <span>#{id}</span></h2>
                    <h3 id='status-workorder' className={status === 'Open' ? 'completed' : 'default-status'}>Status: {status}</h3>
                    <Button className='close-workorder-btn' onClick={() => props.closeModal()}>Close</Button>
                </div>
                <div className='workorder-details'>

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
                    <section className='wo-description-content'>
                        <p >{description}</p>
                    </section>
                </div>
            </>
        )
    }
    return (
        <section className='workorder-container'>

            {displayWorkOrder()}
            <section className='comment-container'>
                <Comments workorderid={props.location.id} />
            </section>
        </section>
    )
}

export default withRouter(ManageWorkOrder);
