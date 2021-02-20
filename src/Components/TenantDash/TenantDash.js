import { useState, useEffect } from 'react';
import axios from 'axios';

const TenantDash = props => {
    const [assignedWorkOrders, setAssignedWorkOrders] = useState([]);
    const [unAssignedWorkOrders, setUnassignedWorkOrders] = useState([]);

    useEffect(() => {
        getWorkOrders();
    }, []);


    const getWorkOrders = () => {
        axios.get('/api/workorder/tenant')
            .then(wo => {
                //setWorkOrders(wo.data);
                sort(wo.data);
            })
            .catch(err => console.log(`Error: ${err.message}`));

    }

    const sort = arr => {
        const { open, other } = arr.reduce((acc, curr) => {
            if (curr.status === 'open') {
                acc.open.push(curr)
            } else {
                acc.other.push(curr)
            }
            return acc
        }, { open: [], other: [] })
        setAssignedWorkOrders(other);
        setUnassignedWorkOrders(open);
    }
    console.log('unassigned w', unAssignedWorkOrders)
    console.log('assigned w', assignedWorkOrders)
    // console.log('props', props)
    return (
        <div>
            <section className='open'>
            {unAssignedWorkOrders.map(wo=>(
                <div key={wo.id}>
                    <p>{wo.title}</p>
                    <p>{wo.description}</p>
                </div>
            ))}
            </section>
            <section className='in-progress'>
            {assignedWorkOrders.map(wo=>(
                <div key={wo.id}>
                    <p>{wo.title}</p>
                    <p>{wo.description}</p>
                </div>
            ))}
            </section>
        </div>
    )
}

export default TenantDash;