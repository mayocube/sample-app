import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { Box, Button, CircularProgress, Container, Grid, Typography } from '@mui/material'
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import { deleteDisposition, getDisposition } from '../apiService/EndPoints';
import DataTable from '../components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import CustomInput from '../components/CustomInput';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteModal from '../components/DeleteModal';
import { useHistory } from 'react-router-dom';
import SnackAlert from '../components/SnackAlert';
import { formReducer } from '../utils/RequestHandler';
import CustomSelect from '../components/CustomSelect';
import RadioButtonsGroup from '../components/RadioButton';
import CachedIcon from '@mui/icons-material/Cached';
import moment from 'moment';

const Dispositions = () => {

    const [fetchTime, setFetchTime] = useState(null);
    const [lastUpdatedText, setLastUpdatedText] = useState(moment().fromNow());

    const history = useHistory();

    const [formData, setFormData] = useReducer(formReducer, {
        category: "",
        subCategory: "",
        descriptions: "",
        groupName: "",
        sendSurvey: "",
    });

    const updateLastUpdatedText = () => {
        setLastUpdatedText(moment(fetchTime).fromNow());
    };

    useEffect(() => {
        updateLastUpdatedText();
        const intervalId = setInterval(updateLastUpdatedText, 30000);
        return () => clearInterval(intervalId);
    }, [fetchTime]);

    const [data, setData] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [resetData, setResetData] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [categories, setCategories] = useState([{ text: "Select one", value: "" }]);
    const [subCategories, setSubCategories] = useState([{ text: "Select one", value: "" }]);
    const [groups, setGroups] = useState([{ text: "Select one", value: "" }]);

    const environmentName = (origin) => {
        if (origin.includes('localhost')) {
            return '{Local}';
        } else if (origin.includes('ccc-admin-dev')) {
            return '{Dev}';
        } else if (origin.includes('ccc-admin-qa')) {
            return '{QA}';
        } else if (origin.includes('ccc-admin-preprod')) {
            return '{Pre-Prod}';
        } else {
            return '';
        }
    }

    const handleResetClick = () => {
        setResetData(true);
    }

    const handleResetTable = () => {
        const temp = [
            {
                target: {
                    name: 'category',
                    value: ''
                }
            },
            {
                target: {
                    name: 'subCategory',
                    value: ''
                }
            },
            {
                target: {
                    name: 'descriptions',
                    value: ''
                }
            },
            {
                target: {
                    name: 'groupName',
                    value: ''
                }
            },
            {
                target: {
                    name: 'sendSurvey',
                    value: ''
                }
            }
        ];
        temp.map(x => setFormData(x));
        setResetData(false);
    }

    const columnHelper = createColumnHelper();
    const columns = useMemo(
        () => [
            columnHelper.accessor("category", {
                header: () => "Category",
            }),
            columnHelper.accessor("subCategory", {
                header: () => "Sub Category",
            }),
            columnHelper.accessor("descriptions", {
                header: () => "Sub Category Description",
            }),
            columnHelper.accessor("groupName", {
                header: () => "Group Name",
            }),
            columnHelper.accessor("sendSurvey", {
                header: () => "Send Survey",
            }),
            columnHelper.accessor("order", {
                header: () => "Order",
            }),
            columnHelper.accessor("action", {
                header: () => "",
                cell: ({ row }) => {
                    return (
                        <Box
                            sx={{
                                gap: '10px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                className='actionBtn'
                                onClick={() => history.push(`/disposition/${row.original.pk}`, { name: row.original.pk })}
                                startIcon={<EditNoteIcon className='actionIcon' fontSize="large" />}
                            >
                                Edit
                            </Button>
                            <Button
                                className='actionBtn'
                                onClick={() => { setSelectedRowId(row.original.pk); setShowModal(true) }}
                                startIcon={<DeleteOutlinedIcon className='actionIcon' fontSize="large" />}
                            >
                                Delete
                            </Button>
                        </Box>
                    )
                },
            }),
        ],
        []
    );

    const getDispositionData = async () => {
        const date = new Date();
        try {
            setDataLoading(true);
            const res = await getDisposition()
            if (res?.status === 'Success') {
                setData(res?.data ?? []);

                const cats = [{ label: "Select one", value: "" }, ...[
                    ...Array.from(new Set( res?.data.map(item => item.category))).map(nitem => ({ label: nitem, value: nitem }))
                ]];
                const subCats = [{ label: "Select one", value: "" }, ...[
                    ...Array.from(new Set( res?.data.map(item => item.subCategory))).map(nitem => ({ label: nitem, value: nitem }))
                ]];
                const gNames = [{ label: "Select one", value: "" }, ...[
                    ...Array.from(new Set( res?.data.map(item => item.groupName))).map(nitem => ({ label: nitem, value: nitem }))
                ]];

                localStorage.setItem('dis_cats', JSON.stringify(cats));
                localStorage.setItem('dis_sub_cats', JSON.stringify(subCats));
                localStorage.setItem('dis_groups', JSON.stringify(gNames));

                setCategories(cats);
                setSubCategories(subCats);
                setGroups(gNames);
                setFetchTime(date);
            }
            setDataLoading(false);
        } catch (error) {
            setDataLoading(false);
            setMessage("Error: While fetching dispositions")
        }
    }

    const onRefresh = () => {
        getDispositionData();
    }

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            const res = await deleteDisposition(selectedRowId);
            if (res?.status === 'Success') {
                getDispositionData();
                setDeleteLoading(false);
                setShowModal(false);
                setMessage(res?.message);
            }
        } catch (error) {
            setDeleteLoading(false);
            setMessage("Error: An error has occured please try again!");
        }
    }

    useEffect(() => {
        getDispositionData();
    }, [])

    return (
        <>
            <TopBar navbarTitle={<> NM Twilio Super Admin <span style={{ color: 'yellow' }}>{` ${environmentName(window.location.origin)}`}</span> </>} />
            <Container maxWidth={"100%"} sx={{ position: "relative" }}>
                <Header headerTitle={"Disposition"} handleReset={handleResetClick} />
                <Grid container spacing={1} paddingBottom={1} paddingTop={0}>

                    <CustomSelect
                        title={'Category'}
                        name='category'
                        value={formData["category"]}
                        onChange={setFormData}
                        id="category"
                        items={categories}
                        getOptionLabel='label'
                    />

                    <CustomSelect
                        title={"Sub Category"}
                        name='subCategory'
                        id="subCategory"
                        value={formData["subCategory"]}
                        onChange={setFormData}
                        items={subCategories}
                        getOptionLabel='label'
                    />

                    <CustomInput
                        title={"Description"}
                        name='descriptions'
                        value={formData["descriptions"]}
                        onChange={setFormData}
                        id="descriptions"
                    />

                    <CustomSelect
                        title={"Group Name"}
                        name='groupName'
                        value={formData["groupName"]}
                        onChange={setFormData}
                        id="groupName"
                        items={groups}
                        getOptionLabel='label'
                    />

                    <RadioButtonsGroup
                        title={"Send Survey"}
                        name='sendSurvey'
                        id="sendSurvey"
                        value={formData["sendSurvey"]}
                        onChange={setFormData}
                        options={[
                            {label: "All", value: ''},
                            {label: "True", value: true},
                            {label: "False", value: false},
                        ]}
                    />
                </Grid>
                <Grid item xs={12} lg={12} marginTop={1} display={"flex"} alignItems={"center"} justifyContent={"space-between"} paddingBottom={0} marginBottom={0} paddingLeft={0} paddingRight={0}>
                    <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={1} my={1}>
                        <Button
                            className='actionBtn'
                            onClick={() => history.push('/disposition')}
                            startIcon={<PermIdentityOutlinedIcon className='actionIcon' fontSize="large" />}
                        >
                            Add
                        </Button>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={2}>
                        <Typography sx={{ fontFamily: "Inter", fontSize: "14px", color: "#394762", lineHeight: "21px", fontWeight: "400" }} variant="filterText" marginBottom={0} gutterBottom>Last updated {lastUpdatedText}</Typography>
                        <Button
                            color='default'
                            sx={{ color: "#606B85" }}
                            className='actionBtn refresh'
                            startIcon={dataLoading ? null : <CachedIcon className='actionIcon' fontSize="large" />}
                            onClick={onRefresh}
                            disabled={dataLoading}
                        >
                            {dataLoading ? <CircularProgress size={20} /> : "Refresh"}
                        </Button>
                    </Box>
                </Grid>
                <DataTable
                    columns={columns}
                    resetData={resetData}
                    handleReset={handleResetTable}
                    data={data}
                    isLoading={dataLoading}
                    formData={formData}
                />
            </Container>
            <DeleteModal
                text={`Are you sure you want to delete this dispostion?`}
                handleDeleteModalOk={handleDelete}
                handleDeleteModalClose={() => setShowModal(false)}
                openDeleteModal={showModal}
                deleteLoading={deleteLoading}
            />
            <SnackAlert message={message} setMessage={setMessage} />
        </>
    )
};

export default Dispositions;