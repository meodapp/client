import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom"

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {useHistory} from "react-router";
import {TextField} from "@mui/material";
import {Autocomplete} from "@mui/lab";
import {associatedCauseses} from "../../dictionaries/causes";
import {encounters} from "../../dictionaries/encounters";
import {discharges} from "../../dictionaries/discharges";
import {mainDiagnosisis} from "../../dictionaries/diagnosis";


export default function AddRecordForm() {
  const [weight , setWeight] = useState(80);
  const [height , setHeight] = useState(1.80);
  const [encounter , setEncountert] = useState(encounters[0].value);
  const [discharge , setDischarge] = useState(discharges[0].value);
  const [indicatorOfTransplantation , setIndicatorOfTransplantation] = useState('N');
  const [numberOfTransplantation , setNumberOfTransplantation] = useState(0);
  const [mainDiagnosis , setMainDiagnosis] = useState('');
  const [secondaryDiagnosis , setSecondaryDiagnosis] = useState('');
  const [associatedCauses , setAssociatedCauses] = useState('0000');
  const [performedProcedure , setPerformedProcedure] = useState('');

  const [performedProcedureOptions , setPerformedProcedureOptions] = useState([]);
  const [performedProcedureGroups , setPerformedProcedureGroups] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_PATH}/procedures/`)
        .then(response => response.json())
        .then(resp => {
          setPerformedProcedureOptions(resp.procedures)
          setPerformedProcedureGroups(resp.groups)
        })
        .catch(error => {
          console.error(error.response)
        })

  }, []);


  let history = useHistory();
  const params = useParams();

  function str2bool (value) {
    if (value && typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
    }
    return value;
  }

  const goAnalysis = (id , patiendId) => {
    history.push({
      pathname:  `/patient/${patiendId}/record/${id}`,
    });
  }

  function sendForm(){
    const visit = {};
    visit.patient_id = params.id;
    visit.weight = weight;
    visit.height = height;
    visit.reason_for_encounter = encounter;
    visit.reason_for_discharge = discharge;
    visit.indicator_of_transplantation = indicatorOfTransplantation;
    visit.number_of_transplantation = numberOfTransplantation;
    visit.main_diagnosis = mainDiagnosis;
    visit.secondary_diagnosis = secondaryDiagnosis;
    visit.associated_causes = associatedCauses;
    visit.performed_procedure = performedProcedure;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(visit),
    };

    fetch(`${process.env.REACT_APP_API_PATH}/record/`, requestOptions)
    // .then(response => response.json()).then(data => console.log("data: " + JSON.stringify(data)));
    .then(response => response.json()).then(data => goAnalysis(data.id , params.id));

  }

  function weightChange(event) {
    setWeight(event.target.value);
  }
  function heightChange(event) {
    setHeight(event.target.value);
  }
  function encounterChange(e, data) {
    setEncountert(data.value);
  }
  function dischargeChange(e, data) {
    setDischarge(data.value);
  }
  function indicatorOfTransplantationChange(event) {
    setIndicatorOfTransplantation(event.target.value);
  }
  function numberOfTransplantationChange(event) {
    setNumberOfTransplantation(event.target.value);
  }
  function mainDiagnosisChange(e, data) {
    setMainDiagnosis(data.value);
  }
  function secondaryDiagnosisChange(e, data) {
    setSecondaryDiagnosis(data.value);
  }
  function associatedCausesChange(event) {
    setAssociatedCauses(event.target.value);
  }
  function performedProcedureChange(e, data) {
    setPerformedProcedure(data.co_procedimento);
  }






  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              New Visit
            </h6>
            <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"

                  >
                    Weight
                  </label>
                  <input
                    type="number"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="weight"
                    defaultValue={80}
                    onChange={weightChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Height
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={1.80}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Height"
                    onChange={heightChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Reason for encounter
                  </label>
                  <Autocomplete
                      className={"border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={encounters}
                      sx={{ width: "100%" }}
                      onChange={encounterChange}
                      defaultValue={encounters[0]}
                      renderInput={(params) => <TextField {...params} label="Reason for encounter"/>}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Reason for discharge
                  </label>
                  <Autocomplete
                      className={"border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={discharges}
                      sx={{ width: "100%" }}
                      onChange={dischargeChange}
                      defaultValue={discharges[0]}
                      renderInput={(params) => <TextField {...params} label="Reason for discharge"/>}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                  Indicator of transplantation
                  </label>
                  <RadioGroup
                      row
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="N"
                      name="radio-buttons-group"
                      onChange={indicatorOfTransplantationChange}
                  >
                    <FormControlLabel value="S" control={<Radio />} label="Yes"  />
                    <FormControlLabel value="N" control={<Radio />} label="No"  />

                  </RadioGroup>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Number of transplantation
                  </label>
                  <input
                    type="number"
                    defaultValue={0}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Number of transplantation"
                    onChange={numberOfTransplantationChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Main diagnosis
                  </label>
                  <Autocomplete
                      className={"border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={mainDiagnosisis}
                      sx={{ width: "100%" }}
                      onChange={mainDiagnosisChange}
                      renderOption={(props, option) => {
                        return (
                            <li {...props} key={option.value}>
                              {option.label}
                            </li>
                        );
                      }}
                      renderInput={(params) => <TextField {...params} label="Main diagnosis"/>}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Secondary diagnosis
                  </label>
                  <Autocomplete
                      className={"border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={mainDiagnosisis}
                      sx={{ width: "100%" }}
                      onChange={secondaryDiagnosisChange}
                      renderOption={(props, option) => {
                        return (
                            <li {...props} key={option.value}>
                              {option.label}
                            </li>
                        );
                      }}
                      renderInput={(params) => <TextField {...params} label="Secondary diagnosis"/>}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Associated causes
                  </label>
                  <Autocomplete
                      className={"border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={associatedCauseses}
                      sx={{ width: "100%" }}
                      defaultValue={associatedCauseses[0]}
                      onChange={associatedCausesChange}
                      renderInput={(params) => <TextField {...params} label="Associated causes"/>}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Performed procedure
                  </label>
                  <Autocomplete
                      className={"border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"}
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      getOptionLabel={(option) => option.no_procedimento}
                      options={performedProcedureOptions}
                      groupBy={(option) => performedProcedureGroups[parseInt(option.co_grupo) - 1].no_grupo}
                      sx={{ width: "100%" }}
                      onChange={performedProcedureChange}
                      renderOption={(props, option) => {
                        return (
                            <li {...props} key={option.co_procedimento}>
                              {option.no_procedimento}
                            </li>
                        );
                      }}
                      renderInput={(params) => <TextField {...params} label="Performed procedure"/>}
                  />
                </div>
              </div>
            </div>
            <button
              className="bg-lightBlue-500 btn--send text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
              style={{"margin" : "0px auto" , "display": "block"}}
              onClick={sendForm}
            >
              Find Anomaly
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

