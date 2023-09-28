import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { Autocomplete, Container, FormControl, Grid, TextField, Typography } from '@mui/material'
import Header from '../components/Header'
import CustomSelect from '../components/CustomSelect'
import Actions from '../components/Actions'
import { getAllAgents } from '../EndPoint/EndPoints'
import CustomInput from '../components/CustomInput'
import { getData, saveData } from '../Util/indexedDBService'
const Dashboard = () => {
    const [selectedValue, setSelectedValue] = React.useState({ brand: 0, priority: 0, agent: 0, age: 0, status: 0 });
    // eslint-disable-next-line
    const [data, setData] = useState([]);
    const [agent, setAgent] = useState([])
    console.log(agent);
    const getAgents = async () => {
        const res = await getAllAgents()
        if (res) {
            setAgent(res?.data?.data)
        }

    }

    const handleRefresh = () => {
        // fetch('https://62eb-104-189-117-104.ngrok-free.app/nmagents')
        //     .then((response) => response.json())
        //     .then((fetchedData) => {
        //         setData(fetchedData);
        //         saveData(fetchedData);
        //     });
    };
    useEffect(() => {
        getAgents()
        // getData().then((storedData) => {
        //     if (storedData.length === 0) {
        //         // Data not in IndexedDB, fetch it from the API
        //         fetch('https://62eb-104-189-117-104.ngrok-free.app/nmagents')
        //             .then((response) => response.json())
        //             .then((fetchedData) => {
        //                 setData(fetchedData);
        //                 saveData(fetchedData); // Store the fetched data in IndexedDB
        //             });
        //     } else {
        //         // Data found in IndexedDB, use it
        //         setData(storedData);
        //     }
        // });
    }, [])

    return (
        <>
            <NavBar navbarTitle={" NM Twilio Super Admin Dev "} />
            <Container maxWidth={"100%"}>
                <Header headerTitle={"Customer Email Queue"} />
                <Grid container spacing={2} paddingBottom={1} paddingTop={0}>
                    <CustomInput title={'Customer email'} />
                    <CustomSelect title={"Brand"}
                        name='priority'
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                        items={[
                            { text: "Select one", value: 0 },
                            { text: "Ten", value: 10 },
                            { text: "Twenty", value: 20 },
                            { text: "Thirty", value: 30 }
                        ]}
                    />
                    <CustomSelect title={"Priority"}
                        name='priority'
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                        items={[
                            { text: "Select one", value: 0 },
                            { text: "Ten", value: 10 },
                            { text: "Twenty", value: 20 },
                            { text: "Thirty", value: 30 }
                        ]}
                    />
                    {/* <CustomSelect title={"Agent"}
                        name='priority'
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                        items={[
                            { text: "Select one", value: 0 },
                            { text: "Ten", value: 10 },
                            { text: "Twenty", value: 20 },
                            { text: "Thirty", value: 30 }
                        ]}
                    /> */}


                    <Grid item xs={2} marginTop={0}>
                        <FormControl className='customSelects' sx={{ width: "100%" }}>
                            <Typography className='customSelectTitle' variant="textLabel" sx={{ textTransform: "uppercase" }}>Agent</Typography>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={agent}
                                getOptionLabel={(option) => option.agentName}
                                className={"custom-select"}
                                sx={{
                                    height: 36, fontSize: 14, borderColor: "#EEEEEE", color: "#5c5c5c", ":hover": {
                                        borderColor: "#EEEEEE",
                                        color: "#333333",
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Select one" />}
                            />
                        </FormControl>
                    </Grid>
                    <CustomSelect title={"Age"}
                        name='priority'
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                        items={[
                            { text: "Select one", value: 0 },
                            { text: "Ten", value: 10 },
                            { text: "Twenty", value: 20 },
                            { text: "Thirty", value: 30 }
                        ]}
                    />
                    <CustomSelect title={"Status"}
                        name='priority'
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                        items={[
                            { text: "Select one", value: 0 },
                            { text: "Ten", value: 10 },
                            { text: "Twenty", value: 20 },
                            { text: "Thirty", value: 30 }
                        ]}
                    />

                    < Actions actionTime={"last updated 6 minutes ago"} />
                </Grid>
            </Container>
        </>
    )
}

export default Dashboard