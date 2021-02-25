import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import './LandlordProperty.css'
import { Bar, Line } from 'react-chartjs-2'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        maxWidth: 500,
    },
});

function LandlordProperty(props) {
    const classes = useStyles();
    const [time, setTime] = useState([])
    const [count, setCount] = useState([])
    const [created, setCreated] = useState([])
    const [data, setData] = useState([])

    useEffect(() => {
        let propertyid = +props.match.params.id
        axios.get(`/api/landlord/property/stats/${propertyid}`)
            .then(res => setCount(res.data))
            .catch(err => console.log(err))

        axios.get(`/api/landlord/property/time/${propertyid}`)
            .then(res => setTime(res.data))
            .catch(err => console.log(err))

        axios.get(`/api/landlord/property/datecreated/${propertyid}`)
            .then(res => {
                setCreated(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (created[0]) {
            setData({
                labels: [created[0].date.substring(0, 10), created[1].date.substring(0, 10), created[2].date.substring(0, 10), created[3].date.substring(0, 10)],
                datasets: [
                    {
                        label: 'Workorder Requests Past 7 days',
                        data: [created[0].count, created[1].count, created[2].count, created[3].count],
                        fill: true,
                        backgroundColor: "rgba(75,192,192,0.2)",
                        borderColor: "rgba(75,192,192,1)"
                    }
                ]
            })
        }

    }, [created])

    console.log(count)
    return (
        <div>
            <h2>Average Time to Completion: {time.avgtimetocompletion ? (
                <>
                    <span>{time.avgtimetocompletion.days} Days {time.avgtimetocompletion.hours} Hours and {time.avgtimetocompletion.minutes} Minutes</span>
                </>
            ) : null}
            </h2>
            {created[0] ? <Line data={data} /> : null}
            <h2>Current Workorders Status</h2>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {count
                            .map((wo, i) => (
                                <TableRow key={i}>
                                    <TableCell align="right">{wo.status}</TableCell>
                                    <TableCell align="right">{wo.count}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(LandlordProperty);