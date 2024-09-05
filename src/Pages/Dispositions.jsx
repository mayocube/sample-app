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
    const [disabledFields, setDisabledFields] = useState({
        category: false,
        subCategory: false,
        groupName: false,
    });

    useEffect(() => {
        var obj = JSON.parse(localStorage.getItem('form'));
        if (obj) {
            setFormData(obj);
        }
        var obj2 = JSON.parse(localStorage.getItem('disabledFields'));
        if (obj2) {
            setDisabledFields(obj2);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('form', JSON.stringify(formData));
        localStorage.setItem('disabledFields', JSON.stringify(disabledFields));
    }, [formData])

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

    const [categories, setCategories] = useState([{ label: "Select one", value: "" }]);
    const [subCategories, setSubCategories] = useState([{ label: "Select one", value: "", gname: "" }]);
    const [allCategories, setAllCategories] = useState([{ label: "Select one", value: "" }]);
    const [allSubCategories, setAllSubCategories] = useState([{ label: "Select one", value: "", gname: "" }]);
    const [groups, setGroups] = useState([{ label: "Select one", value: "", cat: "" }]);

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
        localStorage.removeItem("form")
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
        setDisabledFields({ category: false, subCategory: false, groupName: false });
        setResetData(false);
    }

    const columnHelper = createColumnHelper();
    const columns = useMemo(
        () => [
            columnHelper.accessor("groupName", {
                header: () => "Group Name",
            }),
            columnHelper.accessor("category", {
                header: () => "Category",
            }),
            columnHelper.accessor("subCategory", {
                header: () => "Sub Category",
            }),
            columnHelper.accessor("descriptions", {
                header: () => "Sub Category Description",
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
                                onClick={() => { history.push(`/disposition/${encodeURIComponent(row.original.pk)}`, { name: encodeURIComponent(row.original.pk) }) }}
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
                res.data = [{
                    "pk": "RETURNS_Health of Business",
                    "category": "RETURNS",
                    "subCategory": "Health of Business",
                    "descriptions": "Customer contact is regarding NMG concerns including store closures, financial stability, or other business issues.",
                    "groupName": "Core",
                    "groupCategory": "CoreRETURNS",
                    "sendSurvey": true,
                    "order": 5
                }, ...res?.data];
                setData(res?.data ?? []);

                const gNames = [
                    { label: "Select one", value: "" },
                    ...Array.from(
                        new Map(
                            res?.data.map(item => [item.groupName, { label: item.groupName, value: item.groupName }])
                        ).values()
                    )
                ].sort((a, b) => a.value.localeCompare(b.value));

                const cats = [
                    { label: "Select one", value: "" },
                    ...Array.from(
                        new Map(
                            res?.data.map(item => [item.category, { label: item.category, value: item.category, gname: item.groupName }])
                        ).values()
                    )
                ].sort((a, b) => a.value.localeCompare(b.value));

                const subCats = [
                    { label: "Select one", value: "" },
                    ...Array.from(
                        new Map(
                            res?.data.map(item => [item.subCategory, { label: item.subCategory, value: item.subCategory, cat: item.category }])
                        ).values()
                    )
                ].sort((a, b) => a.value.localeCompare(b.value));

                const allCats = [
                    { label: "Select one", value: "" },
                    ...Array.from(
                        new Map(
                            res?.data.map(item => [item.groupName + '_' + item.category, { label: item.category, value: item.category, gname: item.groupName }])
                        ).values()
                    )
                ].sort((a, b) => a.value.localeCompare(b.value));

                const allSubCats = [
                    { label: "Select one", value: "" },
                    ...Array.from(
                        new Map(
                            res?.data.map(item => [item.category + '_' + item.subCategory, { label: item.subCategory, value: item.subCategory, cat: item.category }])
                        ).values()
                    )
                ].sort((a, b) => a.value.localeCompare(b.value));
                
                localStorage.setItem('dis_cats', JSON.stringify(cats));
                localStorage.setItem('dis_sub_cats', JSON.stringify(subCats));
                localStorage.setItem('dis_all_cats', JSON.stringify(allCats));
                localStorage.setItem('dis_all_sub_cats', JSON.stringify(allSubCats));
                localStorage.setItem('dis_groups', JSON.stringify(gNames));

                setCategories(cats);
                setSubCategories(subCats);
                setAllCategories(allCats); 
                setAllSubCategories(allSubCats);
                setGroups(gNames);
                setFetchTime(date);
            }
            setDataLoading(false);
        } catch (error) {
            console.log(error);
            setDataLoading(false);
            setMessage("Error: While fetching dispositions")
        }
    }

    const onFilterChange = (e) => {
        let decide = { category: false, subCategory: false, groupName: false };
        switch (e.target.name) {
            case 'groupName':
                if (e.target.value != "") {
                    setFormData({ target: { name: 'category', value: '' } });
                    setFormData({ target: { name: 'subCategory', value: '' } });
                }
                break;
            case 'category':
                if (formData["groupName"] == "" && e.target.value != "") {
                    decide.groupName = true;
                }
                setFormData({ target: { name: 'subCategory', value: '' } });
                break;
            case 'subCategory':
                if (e.target.value != "") {
                    if (formData["groupName"] == "") {
                        decide.groupName = true;
                    }
                    if (formData["category"] == "") {
                        decide.category = true;
                    }
                }
                break;
            default:
                break;
        }
        setDisabledFields(decide);
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
                <Header headerTitle={"Dispositions"} handleReset={handleResetClick} />
                <Grid container spacing={1} paddingBottom={1} paddingTop={0}>

                    <CustomSelect
                        title={"Group Name"}
                        name='groupName'
                        value={formData["groupName"]}
                        onChange={(e) => { setFormData(e); onFilterChange(e); }}
                        id="groupName"
                        items={groups}
                        getOptionLabel='label'
                        disabled={disabledFields.groupName}
                    />

                    <CustomSelect
                        title={'Category'}
                        name='category'
                        value={formData["category"]}
                        onChange={(e) => { setFormData(e); onFilterChange(e); }}
                        id="category"
                        items={formData["groupName"] === '' ? categories : [...allCategories.filter(x => x.gname === formData["groupName"])]}
                        getOptionLabel='label'
                        disabled={disabledFields.category}
                    />

                    <CustomSelect
                        title={"Sub Category"}
                        name='subCategory'
                        id="subCategory"
                        value={formData["subCategory"]}
                        onChange={(e) => { setFormData(e); onFilterChange(e); }}
                        items={formData["category"] === '' ? subCategories : [...allSubCategories.filter(x => x.cat === formData["category"])]}
                        getOptionLabel='label'
                        disabled={disabledFields.subCategory}
                    />

                    <CustomInput
                        title={"Description"}
                        name='descriptions'
                        value={formData["descriptions"]}
                        onChange={setFormData}
                        id="descriptions"
                        width={3}
                    />

                    <RadioButtonsGroup
                        width={3}
                        title={"Send Survey"}
                        name='sendSurvey'
                        id="sendSurvey"
                        value={formData["sendSurvey"]}
                        onChange={setFormData}
                        options={[
                            { label: "All", value: '' },
                            { label: "True", value: true },
                            { label: "False", value: false },
                        ]}
                    />
                </Grid>
                <Grid item xs={12} lg={12} marginTop={1} display={"flex"} alignItems={"center"} justifyContent={"space-between"} paddingBottom={0} marginBottom={0} paddingLeft={0} paddingRight={0}>
                    <Box display={"flex"} alignItems={"center"} alignContent={"center"} gap={1} my={1}>
                        <Button
                            className='actionBtn'
                            onClick={() => { history.push('/disposition') }}
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