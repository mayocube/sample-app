import React, { useEffect, useReducer, useState } from 'react'
import TopBar from '../components/TopBar'
import { Box, Button, CircularProgress, FormControl, Grid, Typography } from '@mui/material'
import CustomInput from '../components/CustomInput'
import CustomSelect from '../components/CustomSelect'
import { formReducer } from '../utils/RequestHandler'
import { useHistory } from 'react-router-dom'
import SnackAlert from '../components/SnackAlert'
import { createUpdateDisposition, getDispositionById } from '../apiService/EndPoints';
import RadioButtonsGroup from '../components/RadioButton'
import CreatableSelect from 'react-select/creatable';

const DispositionEdit = () => {
  const history = useHistory();
  const dispostionId = history.location.state?.name;

  const prepareDropdownData = (key) => {
    const ls = localStorage.getItem(key);
    if (ls !== null && ls !== undefined && ls !== '') {
      return JSON.parse(ls);
    }
    return [{ text: "Select one", value: "" }];
  }

  const categories = prepareDropdownData('dis_cats');
  const subCategories = prepareDropdownData('dis_sub_cats');
  const groups = prepareDropdownData('dis_groups');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, {
    category: '',
    subCategory: "",
    descriptions: "",
    order: "",
    groupName: "",
    sendSurvey: "",
  });

  const handleAddUpdate = async () => {
    if (!formData.category) {
      setMessage('Error: Name is required!');
      return;
    }
    if (!formData.subCategoryDescription) {
      setMessage('Error: Description is required!');
      return;
    }
    if (!formData.subCategory) {
      setMessage('Error: Sub Category is required!');
      return;
    }

    setLoading(true);
    try {
      const res = await createUpdateDisposition(formData, dispostionId);
      if (res?.status === 'Success') {
        setMessage(res?.message ?? `DISPOSITION ${dispostionId ? 'updated' : 'created'} successfully.`);
        setLoading(false);
        setTimeout(() => {
          history.goBack();
        }, 1500);
      }
    } catch (e) {
      setMessage(`Error occured please try again!`);
      setLoading(false);
      console.log('catch', e)
    }
  }

  useEffect(() => {
    if (dispostionId) {
      (async () => {
        try {
          console.log('first', dispostionId)
          const res = await getDispositionById(dispostionId);
          if (res?.status === 'Success') {
            let data = res?.data[0];
            setFormData({
              category: data?.category,
              subCategory: data?.subCategory,
              descriptions: data?.descriptions,
              sendSurvey: data?.sendSurvey,
              order: data?.order,
              groupName: data?.groupName,
            })
          }

        } catch (e) {
          setMessage(`Error occured while fetching disposition details!`);
          console.log('catch', e)
        }
      })();
    }
  }, [dispostionId])

  return (
    <>
      <div className='dispositions_edit'>
        <TopBar navbarTitle={'NEIMAN MARCUS Twilio Super Admin Dev'} />
        <Box mx='20px'>
          <Box
            gap={'20px'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Typography className='heading'>
              Disposition
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                className='headerBtn'
                onClick={() => { history.goBack(); }}
                variant="contained"
                color="error"
                sx={{ borderRadius: 30, paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1 }}
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                className='headerBtn'
                onClick={handleAddUpdate}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 30, paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1 }}
              >
                {loading ? <CircularProgress sx={{ width: '30px !important', height: '30px !important' }} /> : (dispostionId ? 'Update' : 'Add')}
              </Button>

            </Box>
          </Box>
          <Grid container spacing={2} paddingBottom={1} paddingTop={0}>

            {
              dispostionId ?
                <Grid item xs={6} marginTop={0} >
                  <FormControl className='customSelects' sx={{ width: "100%" }} >
                    <Typography className='customSelectTitle' variant="textLabel" sx={{ textTransform: "uppercase", fontFamily: "Inter" }}>Category {<span style={{ color: "#bd1721" }}>*</span>}</Typography>
                    <CreatableSelect
                      className={"createable custom-select"}
                      name={'category'}
                      width={2}
                      id="category"
                      placeholder=""
                      onChange={(e) => setFormData({ target: { name: 'category', value: e } })}
                      value={formData["category"]}
                      isClearable
                      options={[
                        { label: "Select one", value: "" },
                        { label: "Neiman Marcus", value: "Neiman Marcus" },
                        { label: "Bergdorf Goodman", value: "Bergdorf Goodman" },
                        { label: "Horchow", value: "Horchow" }
                      ]}
                    //options={categories}
                    />
                  </FormControl>
                </Grid>
                :
                <CustomInput
                  title={'Category'}
                  name={'category'}
                  width={6}
                  value={formData["category"]}
                  id="category"
                  onChange={setFormData}
                  required={true}
                />
            }

            <CustomInput
              title={'Group Name'}
              name={'groupName'}
              width={6}
              value={formData["groupName"]}
              id="groupName"
              onChange={setFormData}
              required={true}
            />
            <CustomInput
              title={'Sub Category'}
              name={'subCategory'}
              id="subCategory"
              width={6}
              value={formData["subCategory"]}
              onChange={setFormData}
              required={true}
            />
            <CustomInput
              title={'Sub Category Description'}
              name={'descriptions'}
              width={6}
              value={formData["descriptions"]}
              id="descriptions"
              onChange={setFormData}
              required={true}
            />
            <CustomInput
              width={6}
              title={'Order'}
              name={'order'}
              value={formData["order"]}
              id="order"
              onChange={setFormData}
              required={false}
            />
            <RadioButtonsGroup
              title={"Send Survey"}
              name='sendSurvey'
              id="sendSurvey"
              value={formData["sendSurvey"]}
              onChange={setFormData}
              options={[
                { label: "True", value: true },
                { label: "False", value: false },
              ]}
            />
          </Grid>
        </Box>
      </div>
      <SnackAlert message={message} setMessage={setMessage} />
    </>
  )
}

export default DispositionEdit