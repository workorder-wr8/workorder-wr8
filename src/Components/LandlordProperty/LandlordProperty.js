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
        // axios.get(`/api/landlord/property/stats/${propertyid}`)
        //     .then(res => setCount(res.data))
        //     .catch(err => console.log(err))

        // axios.get(`/api/landlord/property/time/${propertyid}`)
        //     .then(res => setTime(res.data))
        //     .catch(err => console.log(err))

        // axios.get(`/api/landlord/property/datecreated/${propertyid}`)
        //     .then(res => {
        //         setCreated(res.data)
        //     })
        //     .catch(err => console.log(err))
        axios.get(`/api/landlord/property/data/${[propertyid]}`)
            .then(res=>{
                let receivedDates = res.data.filter((row, index)=>((index+1)%4===0)).map(row=>({labels: row.ddc, datasets: row.dc}));
                console.log('RECEIVED: ', receivedDates);
                setCreated(receivedDates)
                let receivedData = res.data.filter((row, index)=>(index<4)).map(row=>({count: row.c, status: row.ws}))
                setCount(receivedData);
                setTime(res.data[0].attc);
                
            })
    }, [])

    useEffect(() => {
        if (created[0]) {
            console.log('beforeSetData: ',created)
            setData({
                labels: created.map(row=>row.labels),
                datasets: [
                    {
                        label: 'Workorder Requests Past 7 days',
                        data: created.map(row=>row.datasets),
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

    return (
        <div>
            <div onClick={goBack}>Go Back</div>
            <h2>Average Time to Completion: {time.avgtimetocompletion ? (
                <>
                    <span>{time.avgtimetocompletion.days} Days {time.avgtimetocompletion.hours} Hours and {time.avgtimetocompletion.minutes} Minutes</span>
                </>
            ) : null}
            </h2>
            {created[0] ? (
                <div >
                    <Line
                        data={data}
                    />
                </div>
            )
                : null}
            <h2>Current Workorders Status</h2>
            <div style={{ width: '100%' }}>
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
                                    console.log('this is count: ', count)
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