import React , {useState} from "react";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {useHistory} from "react-router";
import {Autocomplete, DatePicker, LocalizationProvider} from "@mui/lab";
import {TextField} from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {states} from "../../dictionaries/states";
import {nationalities} from "../../dictionaries/nationalities";
import {healthCareUnit} from "../../dictionaries/healthCareUnit";



export default function AddPatientForm() {
  const [id , setID] = useState('');
  const [dateOfBirth , setDateOfBirth] = useState(new Date(637523573000));
  const [state , setState] = useState('');
  const [gender , setGender] = useState('M');
  const [nationality , setNationality] = useState('');
  const [healthcareUnit , setHealthcareUnit] = useState('');
  let history = useHistory();


  function sendForm(){
    const patient = new Object;
    patient.id = id;
    patient.date_of_birth = dateOfBirth.toLocaleDateString("en-US");
    patient.state = state;
    patient.gender = gender;
    patient.nationality = nationality;
    patient.healthcare_unit = healthcareUnit;


    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patient),
    };

    fetch(`${process.env.REACT_APP_API_PATH}/patient/`, requestOptions)
    .then(response => response.json());
    console.log(patient);
    setTimeout(() => {  goToHome(); }, 250);
  }

  const goToHome = () => {
    history.push({
      pathname:  `/home`,
    });
  }


  function idChange(event) {
    setID(event.target.value);
  }
  function dateOfBirthChange(date) {
    setDateOfBirth(date);
  }
  function stateChange(e, data) {
    setState(data.value);
  }
  function genderChange(event) {
    setGender(event.target.value);
  }
  function nationalityChange(e, data) {
    setNationality(data.value);
  }
  function healthcareUnitChange(e, data) {
    setHealthcareUnit(data.value);
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              New Patient
            </h6>
            <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"

                  >
                    Patient ID
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Patient id"
                    onChange={idChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Date Of Birth
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDateFns} className={"border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}>
                    <DatePicker
                        mask="____/__/__"
                        label="Date Of Birth"
                        value={dateOfBirth}
                        onChange={dateOfBirthChange}
                        renderInput={(params) => <TextField {...params}  />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4 py-3">
                <div className="relative w-full">
                  <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                  >
                    State
                  </label>
                  <Autocomplete
                      className={"border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={states}
                      sx={{ width: "100%" }}
                      onChange={stateChange}
                      renderInput={(params) => <TextField {...params} label="State"/>}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4 py-3">
                <div className="relative w-full">
                  <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                  >
                    Nationality
                  </label>
                  <Autocomplete
                      className={"border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={nationalities}
                      sx={{ width: "100%" }}
                      onChange={nationalityChange}
                      renderInput={(params) => <TextField {...params} label="Nationality"/>}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4 py-3">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                  Gender
                  </label>
                  <RadioGroup
                      row
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="M"
                      name="radio-buttons-group"
                      onChange={genderChange}
                  >
                    <FormControlLabel value="M" control={<Radio />} label="Male"  />
                    <FormControlLabel value="F" control={<Radio />} label="Female"  />

                  </RadioGroup>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Health Care Unit
                  </label>
                  <Autocomplete
                      className={"border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={healthCareUnit}
                      sx={{ width: "100%" }}
                      onChange={healthcareUnitChange}
                      renderInput={(params) => <TextField {...params} label="Health Care Unit"/>}
                  />
                  {/*<input*/}
                  {/*  type="text"*/}
                  {/*  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"*/}
                  {/*  placeholder="Health Care Unit"*/}
                  {/*  onChange={healthcareUnitChange}*/}
                  {/*/>*/}
                </div>
              </div>
            </div>
            <button
              className="bg-lightBlue-500 btn--send text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
              style={{"margin" : "0px auto" , "display": "block"}}
              onClick={sendForm}
            >
              Add Patient
            </button>
          </form>
        </div>
      </div>
    </>
  );
}


