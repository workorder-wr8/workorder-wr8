import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import './LandlordProperty.css'
import { Pie, Line } from 'react-chartjs-2'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        width: 400,
        margin: 'auto'
    }
});

function LandlordProperty(props) {
    const classes = useStyles();
    const [time, setTime] = useState([])
    const [count, setCount] = useState([])
    const [created, setCreated] = useState([])
    const [data, setData] = useState([])

    useEffect(() => {
        let propertyid = +props.match.params.id
        axios.get(`/api/landlord/property/data/${propertyid}`)
            .then(res => {
                if (res.data[0]) {
                    let receivedDates = res.data.filter((row, index) => ((index + 1) % 4 === 0)).map(row => ({ labels: row.day.substring(4), datasets: row.workorders }));

                    setCreated(receivedDates)
                    let receivedData = res.data.filter((row, index) => (index < 4)).map(row => ({ count: row.count, status: row.status }))
                    setCount(receivedData);
                    setTime(res.data[0].attc);
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (created[0]) {
            setData({
                labels: created.map(row => row.labels),
                datasets: [
                    {
                        label: 'Workorder Requests Past 7 days',
                        data: created.map(row => row.datasets),
                        fill: true,
                        backgroundColor: "rgba(75,192,192,0.2)",
                        borderColor: "rgba(75,192,192,1)"
                    }
                ]
            })
        }

    }, [created])

    const goBack = () => {
        props.history.goBack()
    }

    console.log(count)
    return (
        <div className='landlord-property-container'>
            <div className='back-btn-landlord' onClick={goBack}>Go Back</div>
            <h2 className='chart-header'>Average Time to Completion: {time !== null ? (
                <>
                    <span className='chart-header'>{time.days} Days {time.hours} Hours and {time.minutes} Minutes</span>
                </>
            ) : null}
            </h2>
            {created[0] ? (
                <div className='chart-container'>
                    <Line
                        data={data}
                    />
                </div>
            )
                : null}
            <h2 className='chart-header'>Current Workorders Status</h2>
            {/* <Pie
                data={count}
                options={{
                    title: {
                        display: true,
                        text: 'Average Rainfall per month',
                        fontSize: 20
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    }
                }}
            /> */}
            <div className='table-numbers-landlord'>
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
                                .map((wo, i) => {
                                    return <TableRow key={i}>
                                        <TableCell align="right">{wo.status}</TableCell>
                                        <TableCell align="right">{wo.count}</TableCell>
                                    </TableRow>
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(LandlordProperty);