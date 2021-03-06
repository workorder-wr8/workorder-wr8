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
import orderBy from "lodash/orderBy";
import SpinnerContainer from '../Spinner/SpinnerContainer';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import click from '../../assets/click_me.svg';
import './TenantDash.css';

const TenantDash = props => {

    const [workOrders, setWorkOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [columnToSort, setColumnToSort] = useState('')
    const [sortDirection, setSortDirection] = useState('')
    const invertDirection = {
        asc: 'desc',
        desc: 'asc'
    }
    const [dateToggle, setDateToggle] = useState(true)
    const columns = [{ id: 'number', label: 'Work Order #' }, { id: 'title', label: 'Title' }, { id: 'short-desc', label: 'Short Description' }, { id: 'date', label: 'Date Created' }, { id: 'status', label: 'Status', disableSorting: true }];
    useEffect(() => {
        getWorkOrders();
    }, []);

    const getWorkOrders = () => {
        axios.get('/api/workorder/tenant')
            .then(wo => {
                setWorkOrders(wo.data);
                setLoading(!isLoading);
            })
            .catch(err => {
                alert(`Error: ${err.response.request.response}`);
                setLoading(!isLoading);
            });
    }

    const searchWorkOrders = e => {
        setSearch(e.target.value);
    }

    const handleSort = (columnId) => {
        setColumnToSort(columnId)
        setSortDirection(columnToSort === columnId ? invertDirection[sortDirection] : 'asc')

        if (columnId === 'date') {
            setDateToggle(!dateToggle)
            workOrders.sort((a, b) => {
                if (dateToggle) {
                    return new Date(a.datecreated) - new Date(b.datecreated);
                } else {
                    return new Date(b.datecreated) - new Date(a.datecreated);
                }
            });
        } else if (columnId === 'number') {
            setDateToggle(!dateToggle)
            workOrders.sort((a, b) => {
                if (dateToggle) {
                    return new Date(a.id) - new Date(b.id);
                } else {
                    return new Date(b.id) - new Date(a.id);
                }
            });
        }
    }

    return (
        <div>
            <section className='open'>
                {isLoading
                    ?
                    <SpinnerContainer />
                    :
                    <section className='workorder-table-container'>


                        <TextField onChange={e => searchWorkOrders(e)} className='search-workorder-field' id="outlined-basic" label="Search" variant="outlined" value={search} />


                        <TableContainer className='table-container' component={Paper} >

                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map(column => (
                                            <TableCell
                                                key={column.id}
                                                align="right"
                                                className='table-head-workorders'
                                            >
                                                {column.disableSorting ? (
                                                    <div>
                                                        {column.label}
                                                    </div>
                                                ) :
                                                    <div
                                                        className='arrow-filter'
                                                        onClick={() => handleSort(column.id)}>
                                                        <span title='Sort'>{column.label}</span>
                                                        {columnToSort === column.id ? (
                                                            sortDirection === 'asc' ? (
                                                                <KeyboardArrowUpIcon />
                                                            ) : (
                                                                    <KeyboardArrowDownIcon />
                                                                )
                                                        ) : null}
                                                    </div>}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody className='workorder-tenant-table'>
                                    {orderBy(workOrders, columnToSort, sortDirection)
                                        .filter(wo => (
                                            wo.status.toLowerCase().includes(search.toLowerCase()) || wo.title.toLowerCase().includes(search.toLowerCase())
                                        )).map(wo => (
                                            <TableRow key={wo.id}>
                                                <TableCell>{wo.id}</TableCell>
                                                <TableCell className='wo-title' component="th" scope="row">
                                                    <Link className='link' title='Open Workorder View' to={{ pathname: `${props.match.url}/workorder/${wo.id}`, id: wo.id }}>
                                                        {wo.title}
                                                        <img className='click-me' src={click} alt='click_svg' />
                                                    </Link>
                                                </TableCell>

                                                <TableCell align="right" className='tenant-wo-description'>{wo.description}</TableCell>
                                                <TableCell>{dayjs(wo.datecreated).format('MMMM D, YYYY h:mm A')}</TableCell>
                                                {(wo.status === 'Open' || wo.status === 'Completed')
                                                    ?
                                                    (
                                                        <TableCell><span className={wo.status === 'Completed' ? 'completed' : 'in-progress-wo'}>{wo.status}</span></TableCell>
                                                    )
                                                    :

                                                    (
                                                        <TableCell><span className='in-progress-wo'>In Progress</span></TableCell>
                                                    )
                                                }
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </section>
                }
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