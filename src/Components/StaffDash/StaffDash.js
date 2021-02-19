import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './StaffDash.css'
// need redux for user id for the two axios calls


export default function StaffDash(props) {

    const [assignments, setAssignments] = useState([])
    const [scheduled, setScheduled] = useState([])

    useEffect(() => {
        axios.get(`/api/staff/workorders/5`) //update to user id from redux
            .then(res => {
                setAssignments(res.data)
            })
            .catch(err => console.log(err))
    }, [scheduled])

    const handleSelectChange = (e, id) => {
        axios.put(`/api/staff/workorders`, { id: id, status: e, staffid: 5 }) //update to user id from redux
            .then(res => setScheduled(res.data))

            .catch(err => console.log(err))
    }

    return (
        <div id='staffDash'>

            <section id='unopened'>
                <h1>Unread Workorders</h1>

                {assignments.filter(e => e.status === 'Unread').map(wo => (
                    <section key={wo.id}>
                        <h2>Name: {wo.firstname}</h2>
                        <h2>Title: {wo.title}</h2>
                        <p>Description: {wo.description}</p>
                        <div>Date Created: {wo.datecreated}</div>
                        <div>Last Updated: {wo.lastupdated}</div>
                        <div>Status: {wo.status}</div>
                        <div >Mark as <span>{
                            <>
                                <select defaultValue={wo.status} name='statusoptions' id='statusoptions' onChange={e => handleSelectChange(e.target.value, wo.id)}>
                                    <option value='Unread' >Unread</option>
                                    <option value='In Progress'>In Progress</option>
                                    <option value='Completed'>Completed</option>
                                </select>
                            </>
                        }</span></div>

                    </section>
                ))}
            </section>


            <section id='inprogress'>
                <h1>In Progress</h1>
                {assignments.filter(e => e.status === 'In Progress').map(wo => (
                    <section key={wo.id}>
                        <h2>Name: {wo.firstname}</h2>
                        <h2>Title: {wo.title}</h2>
                        <p>Description: {wo.description}</p>
                        <div>Date Created: {wo.datecreated}</div>
                        <div>Last Updated: {wo.lastupdated}</div>
                        <div>Status: {wo.status}</div>
                        <div >Mark as <span>{
                            <>
                                <select defaultValue={wo.status} name='statusoptions' id='statusoptions' onChange={e => handleSelectChange(e.target.value, wo.id)}>
                                    <option value='Unread' >Unread</option>
                                    <option value='In Progress'>In Progress</option>
                                    <option value='Completed'>Completed</option>
                                </select>
                            </>
                        }</span></div>

                    </section>
                ))}
            </section>


            {/* Status = completed will not show unless filtered to that */}
        </div>
    )
}
