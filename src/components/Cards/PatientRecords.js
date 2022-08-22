import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useHistory} from "react-router";
import {useParams} from "react-router-dom"
import {TerminologyTranslator} from "../../services/terminologyTranslator";
import {mainDiagnosisis} from "../../dictionaries/diagnosis";
import {encounters} from "../../dictionaries/encounters";
import {discharges} from "../../dictionaries/discharges";


export default function PatientRecords({color}) {
    const [records, setRecords] = useState([]);
    const [searchedRecords, setSearchedRecords] = useState([]);
    const [id, setId] = useState('');
    const [performedProcedureOptions , setPerformedProcedureOptions] = useState([]);

    let history = useHistory();
    const diagnosisTranslator = new TerminologyTranslator(mainDiagnosisis);
    const encounterTranslator = new TerminologyTranslator(encounters);
    const dischargeTranslator = new TerminologyTranslator(discharges);


    const handleKeyPress = (e) => {
        setId(e.target.value);
    }

    let params = useParams()
    function addRecord() {
        history.push(`/patient/${params.id}/record/add`)
    }
    function goToResult(recordId) {
        history.push(`/patient/${params.id}/record/${recordId}`);
    }
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_PATH}/procedures/`)
            .then(response => response.json())
            .then(resp => {
                setPerformedProcedureOptions(resp.procedures)
            })
            .catch(error => {
                console.error(error.response)
            })

    }, []);

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
        };
        fetch(`${process.env.REACT_APP_API_PATH}/patient/${params.id}/records/`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setRecords(data);
                setSearchedRecords(data);
            });
    }, []);

    useEffect(() => {
        if (id) {
            setSearchedRecords(
                records.filter(patient => (patient.id.toString()).indexOf(id) === 0)
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
                                Patient: {params.id}
                            </h3>
                        </div>
                        <div className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
                            <div className="relative flex w-full flex-wrap items-stretch">
              <span
                  className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-2">
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
                            onClick={addRecord}
                        >
                            New Record
                        </button>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                        <tr>
                            <th
                                className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                Height
                            </th>
                            <th
                                className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                Weight
                            </th>
                            <th
                                className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                Reason for encounter
                            </th>
                            <th
                                className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                Reason for discharge
                            </th>
                            <th
                                className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                Transplantations amount
                            </th>
                            <th
                                className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                Main Diagnosis
                            </th>
                            <th
                                className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                Performed Procedure
                            </th>
                            <th className={
                                "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                            }>
                                <span className="sr-only">See results</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {searchedRecords ? searchedRecords.map((record, index) => (
                            <tr key={index} className={"hover:table-row"} onClick={() => {goToResult(record._id)}}>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {record.height}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {record.weight}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {encounterTranslator.get(record.reason_for_encounter)}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {dischargeTranslator.get(record.reason_for_discharge)}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {record.number_of_transplantation}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {diagnosisTranslator.get(record.main_diagnosis)}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">

                                    {performedProcedureOptions.find(item => item.co_procedimento === record.performed_procedure)?.no_procedimento}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4  text-right">
                                    <a onClick={() => {goToResult(record._id)}} href="#"
                                       className="text-lightBlue-600 hover:underline">
                                        See results
                                    </a>
                                </td>
                            </tr>
                        )) : <></>}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

PatientRecords.defaultProps = {
    color: "light",
};

PatientRecords.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
