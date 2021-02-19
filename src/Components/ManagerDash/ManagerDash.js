import axios from 'axios';
import {useEffect, useState} from 'react';


export default function ManagerDash() {
    const [workorders,setWorkOrders] = useState([]);
    const [unassignedWorkOrders, setUnassigned] = useState([])
    const [assignedWorkOrders, setAssigned] = useState([])
    useEffect(()=>{
        axios.get('/api/workorder/manager')
        .then(res=>setWorkOrders(res.data))
        mapWorkOrders();
    }, [])

    const mapWorkOrders = () => {
        workorders.filter((wo)=>{
            if(wo.status === 'open')
                setUnassigned(wo)
            else
                setAssigned(wo)
        })
    } 

    return (
        <div>
            ManagerDash
            <div className='unassignedWorkOrders'>
                {unassignedWorkOrders}
            </div>
            <div className='assignedWorkOrders'>
                {assignedWorkOrders}
            </div>
        </div>
    )
}
