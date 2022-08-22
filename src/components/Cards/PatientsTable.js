import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useHistory} from "react-router";
import {states} from "../../dictionaries/states";
import {TerminologyTranslator} from "../../services/terminologyTranslator";
import {nationalities} from "../../dictionaries/nationalities";
import {genders} from "../../dictionaries/genders";
import moment from "moment";


export default function PatientsTable({ color }) {
  const [patients, setPatients] = useState([]);
  const [searchedPatients, setSearchedPatients] = useState([]);
  const [id, setId] = useState('');
  let history = useHistory();
  const statesTranslator = new TerminologyTranslator(states);
  const nationalityTranslator = new TerminologyTranslator(nationalities);
  const genderTranslator = new TerminologyTranslator(genders);
  const handleKeyPress = (e) => {
    setId(e.target.value);
  }
  const goToPatient = (patientId , patient) => {
    history.push({
      pathname:  `/patient/${patientId}`,
      patient: patient
    });
  }

  function compare( a, b ) {
    if ( a.id < b.id ){
      return -1;
    }
    if ( a.id > b.id ){
      return 1;
    }
    return 0;
  }

  const sortPatients = () => {
    const sortedPatients = patients.sort(compare)
    setSearchedPatients(sortedPatients)
    console.log(searchedPatients)
  }

  function addPatient() {
    history.push({
      pathname:  "/patient/add",
      state: { detail: 'some_value' }
    });
  }

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
    };
    fetch(`${process.env.REACT_APP_API_PATH}/patient/`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setPatients(data);
          console.log(data);
          setSearchedPatients(data);
        });
  }, []);

  useEffect(() => {
    if (id) {
      setSearchedPatients(
          patients.filter(patient => (patient.id.toString()).indexOf(id) === 0)
      )
    }
  }, [id]);

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Patients
              </h3>
            </div>
            <div className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
              <div className="relative flex w-full flex-wrap items-stretch">
              <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-2">
                <i className="fas fa-search"></i>
              </span>
                <input
                    type="text"
                    placeholder="Search here..."
                    onKeyUp={handleKeyPress}
                    className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                />
              </div>
            </div>
            <button
                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
                onClick={addPatient}
            >
              New Patient
            </button>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                    onClick={sortPatients}
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Id
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Age
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Location
                </th>
                <th
                    className={
                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                        (color === "light"
                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                >
                  Nationality
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Gender
                </th>
                <th className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                }>
                  <span className="sr-only">See patient</span>
                </th>
              </tr>
            </thead>
            <tbody>
                {searchedPatients && searchedPatients.map((patient, index) => (
                  <tr key={index} className={"hover:table-row"} onClick={() => {goToPatient(patient.id , patient)}}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {patient.id}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {moment().diff(moment(patient.date_of_birth), 'years')}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {statesTranslator.get(patient.state)}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {nationalityTranslator.get(patient.nationality)}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {genderTranslator.get(patient.gender)}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4  text-right">
                      <a onClick={() => {goToPatient(patient.id , patient)}} href="#"
                         className="text-lightBlue-600 hover:underline">
                        See patient
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

PatientsTable.defaultProps = {
  color: "light",
};

PatientsTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
