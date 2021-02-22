import axios from 'axios';
import {useEffect, useState} from 'react';


export default function ManagerDash() {
    const [workorders,setWorkOrders] = useState([]);
    const [unassignedWorkOrders, setUnassigned] = useState([])
    const [assignedWorkOrders, setAssigned] = useState([])
    
    useEffect(()=>{
        getWorkOrders();
    }, [])

    const getWorkOrders = async () => {
        await axios.get('/api/workorder/manager')
        .then(res=>{
            setWorkOrders(res.data);
        })
    }

    const mapWorkOrders = () => {
        console.log('MAPPING ZE VERK ORDAHS: ', workorders)
        let unassignedFiltered, assignedFiltered;
        unassignedFiltered = workorders.filter((wo)=>{return wo.status === 'open'}).map((wo)=>(
            <div className='workOrder'>
                <div>{wo.firstname}</div>
                <div>{wo.lastname}</div>
                <div>{wo?.title}</div>
                <div>{wo?.description}</div>
            </div>
        ))
        assignedFiltered = workorders.filter((wo)=>{return wo.status!=='open'})
        console.log('unassignedFiltered: ', unassignedFiltered);
        setUnassigned(unassignedFiltered);
        setAssigned(assignedFiltered);
    } 



    useEffect(mapWorkOrders, [workorders]);

    console.log('BEFORE RETURN: ', workorders.length, unassignedWorkOrders)
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
