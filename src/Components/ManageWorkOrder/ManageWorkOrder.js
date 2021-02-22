import { useState } from 'react'
import './ManageWorkOrder.css';

const ManageWorkOrder = (props) => {

    const [workOrder, setWorkOrder] = useState([]);
    return (
        <section className='workorder-container'>
            <div className='workorder-title'>
                <h4>Title</h4>
                <span>work order id</span>
            </div>
            <div>
                <p>work order description</p>
            </div>
            <div>
                <span>status</span>
                <span>created at</span>
                <span>last updated at</span>
                <span>completed</span>
            </div>
            <section>
                comments
            </section>
        </section>
    )
}

export default ManageWorkOrder;
