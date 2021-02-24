import { useState, useEffect } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import { ModalRoute, ModalContainer } from 'react-router-modal';
import ManageWorkOrder from '../ManageWorkOrder/ManageWorkOrder';
import dayjs from 'dayjs';
import './TenantDash.css';

const TenantDash = props => {

    const [workOrders, setWorkOrders] = useState([]);
    const [search, setSearch] = useState('');
    const columns = [{ id: 'number', label: 'Work Order #' }, { id: 'title', label: 'Title' }, { id: 'short-desc', label: 'Short Description' }, { id: 'date', label: 'Date Created' }, { id: 'status', label: 'Status' }];
    useEffect(() => {
        getWorkOrders();
    }, []);


    const getWorkOrders = () => {
        axios.get('/api/workorder/tenant')
            .then(wo => {
                setWorkOrders(wo.data);
            })
            .catch(err => console.log(`Error: ${err.message}`));
    }

    const searchWorkOrders = e => {
        setSearch(e.target.value);
    }

    return (
        <div>
            <section className='open'>
                <TableContainer className='table-container' component={Paper} >
                    <TextField onChange={e => searchWorkOrders(e)} className='search-workorder-field' id="outlined-basic" label="Search" variant="outlined" value={search} />
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead style={{ backgroundColor: 'red' }}>
                            <TableRow>
                                {columns.map(column => (
                                    <TableCell key={column.id}>{column.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody className='workorder-tenant-table'>
                            {workOrders.filter(wo => (
                                wo.status.toLowerCase().includes(search.toLowerCase()) || wo.title.toLowerCase().includes(search.toLowerCase())
                            )).map(wo => (
                                <TableRow key={wo.id}>
                                    <TableCell>{wo.id}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={{ pathname: `/dash/workorder/${wo.id}`, id: wo.id }}>
                                            {wo.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right" className='tenant-wo-description'>{wo.description}</TableCell>
                                    <TableCell>{dayjs(wo.datecreated).format('MMMM D, YYYY h:mm A')}</TableCell>
                                    {(wo.status === 'Open' || wo.status === 'Completed')
                                        ?
                                        (
                                            <TableCell>{wo.status}</TableCell>
                                        )
                                        :

                                        (
                                            <TableCell>In Progress</TableCell>
                                        )
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </section>
            <ModalRoute className='example-modal'
                inClassName='example-modal-in'
                outClassName='example-modal-out'
                backdropClassName='example-backdrop'
                backdropInClassName='example-backdrop-in'
                backdropOutClassName='example-backdrop-out'
                outDelay={1500}
                path={`/dash/workorder/:id`}
                parentPath={'/dash'}
                component={ManageWorkOrder} />
            <ModalContainer />
        </div>
    )
}

export default TenantDash;