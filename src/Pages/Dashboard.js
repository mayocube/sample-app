import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { Container, Grid } from '@mui/material'
import Header from '../components/Header'
import CustomSelect from '../components/CustomSelect'
import Actions from '../components/Actions'
import { getAllAgents } from '../EndPoint/EndPoints'
import CustomInput from '../components/CustomInput'
const Dashboard = () => {
    const [selectedValue, setSelectedValue] = React.useState({ brand: 0, priority: 0, agent: 0, age: 0, status: 0 });
    // eslint-disable-next-line
    const [agent, setAgent] = useState([])
    console.log(agent);
    const getAgents = async () => {
        const res = await getAllAgents()
        if (res) {
            setAgent(res.data)
        }
    }
    useEffect(() => {
        getAgents()
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
                    <CustomSelect title={"Agent"}
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