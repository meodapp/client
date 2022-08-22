import React, {useEffect, useState} from "react";
import "./meod-chart.css"
import {TerminologyTranslator} from "../../services/terminologyTranslator";
import {mainDiagnosisis} from "../../dictionaries/diagnosis";
import {encounters} from "../../dictionaries/encounters";
import {discharges} from "../../dictionaries/discharges";
import moment from "moment";
import {states} from "../../dictionaries/states";
import {nationalities} from "../../dictionaries/nationalities";
import {genders} from "../../dictionaries/genders";


var Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export default function CardVerticalChart(props) {
    const [time, setTIme] = useState(0);
    const [isShowAgeDistribution, setIsShowAgeDistribution] = useState(false);
    const [isShowGenderDistribution, setIsShowGenderDistribution] = useState(false);
    const [isShowDiagnosisDistribution, setIsShowDiagnosisDistribution] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [sortedItems, setSortedItems] = useState([]);
    const [groupedLabels, setGroupedLabels] = useState([]);
    const [patient, setPatient] = useState({});
    const [medicalRecord, setMedicalRecord] = useState({});
    const [performedProcedureOptions, setPerformedProcedureOptions] = useState([]);

    const diagnosisTranslator = new TerminologyTranslator(mainDiagnosisis);
    const encounterTranslator = new TerminologyTranslator(encounters);
    const dischargeTranslator = new TerminologyTranslator(discharges);

    const statesTranslator = new TerminologyTranslator(states);
    const nationalityTranslator = new TerminologyTranslator(nationalities);
    const genderTranslator = new TerminologyTranslator(genders);

    const color = "light"
    useEffect(() => {
        if (time < 90) {
            setTimeout(() => {
                setTIme(time + getRandomInt(1, 3))
            }, 300)
        }
    }, [time]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_PATH}/patient/${props.patient_id}/`)
            .then(response => response.json())
            .then(resp => {
                console.log(resp);
                setPatient(resp);
            })
            .catch(error => {
                console.error(error.response)
            })
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_PATH}/patient/${props.patient_id}/records/${props.medical_record_id}/`)
            .then(response => response.json())
            .then(resp => {
                console.log(resp);
                setMedicalRecord(resp);
            })
            .catch(error => {
                console.error(error.response)
            })
    }, []);

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


    function getLabels(items) {
        return items.map(([, value]) => {
            try {
                return value.display_name.charAt(0).toUpperCase() + value.display_name.toLowerCase().slice(1)
            } catch {
                return value.display_name
            }
        })
    }
    function getAndSetGroupedLabels(items) {
        setGroupedLabels(Array.from(new Set(items.map(([, value]) => value.group))));
    }



    function getProbabilities(items) {
        return items.map(([key, value]) => {
            if (key !== props.performed_procedure) {
                return parseFloat(value.probability.toFixed(1))
            }
            return null;
        })
    }

    function getDoctorProbabilities(items) {
        return items.map(([key, value]) => {
            if (key === props.performed_procedure) {
                return parseFloat(value.probability.toFixed(1))
            }
            return null;
        })
    }

    function getGroupedProbabilities(items) {
        const groups = groupedLabels;
        return items.map(([key, value]) => {
            const color = key === props.performed_procedure ? "#11b981" : "#aeafb1"
            const groupId = groups.findIndex(elements => elements === value.group)
            console.log(`groupId: ${groupId} for ${value.group}`)
            const data = new Array(groups.length).fill(null);
            data[groupId] = parseFloat(value.probability.toFixed(1))
            try {
                return {
                    name: value.display_name.charAt(0).toUpperCase() + value.display_name.toLowerCase().slice(1),
                    data: data,
                    color: color,
                }
            } catch {
                return {
                    name: value.display_name,
                    data: data,
                    color: color,
                }
            }
        })
    }



    function getSortedData(items) {
        const itemList = Object.entries(items)
        return itemList
            .sort(([_, a], [__, b]) => (a.probability > b.probability) ? -1 : 1)
            .filter(([key, value]) => value.probability > 0.1 || key === props.performed_procedure);
    }

    function getSortedAndFilterData(items) {
        const itemList = Object.entries(items)
        const res = itemList
            .sort(([_, a], [__, b]) => (a.probability > b.probability) ? -1 : 1).filter(([key, value], index) => index < 10 || key === props.performed_procedure)
        console.log(res);
        getAndSetGroupedLabels(res);
        return res;
    }

    function getAgeDistribution (items, treatmentLabel) {
        const [, item] = items.find(([, value]) => {
            try {
                return value.display_name.toLowerCase() === treatmentLabel.toLowerCase()
            } catch {
                return value.display_name === treatmentLabel
            }
        })

        return item.age_distribution
    }

    function getGenderDistribution (items, treatmentLabel) {
        const [, item] = items.find(([, value]) => {
            try {
                return value.display_name.toLowerCase() === treatmentLabel.toLowerCase()
            } catch {
                return value.display_name === treatmentLabel
            }
        })

        return item.gender_distribution
    }

    function getDiagnosisDistribution (items, treatmentLabel) {
        const [, item] = items.find(([, value]) => {
            try {
                return value.display_name.toLowerCase() === treatmentLabel.toLowerCase()
            } catch {
                return value.display_name === treatmentLabel
            }
        })

        return item.diagnosis_distribution
    }

    function setChart (items) {
        return Highcharts.chart('container', {
            chart: {
                type: 'bar',
                inverted: false,
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    stacking: 'normal',
                    point: {
                        events: {
                            click: function () {
                                showAgeDistribution(getAgeDistribution(items, this.category), this.category);
                                showGenderDistribution(getGenderDistribution(items, this.category), this.category);
                                showDiagnosisDistribution(getDiagnosisDistribution(items, this.category), this.category);
                            }
                        }
                    },
                    pointWidth: 20,
                    dataLabels: {
                        inside: true,
                        enabled: true,
                        format: '{point.y:.1f}%', // one decimal
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }
            },
            title: {
                text: 'Percentage of the performed procedure based on similar cases'
            },
            yAxis: {
                title: {
                    text: 'Percentage'
                },
            },
            xAxis: {
                categories: getLabels(items),
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'System recommendations',
                data: getProbabilities(items),
                color: '#aeafb1'
            },
            {
                name: 'Doctor decision',
                data: getDoctorProbabilities(items),
                color: '#1e831c'
            }]
        });
    }
    function setStackedChart (items) {
        return Highcharts.chart('group-container', {
            chart: {
                type: 'column',
                inverted: true,
            },
            title: {
                text: 'Sum of percentages of the performed procedure based on similar cases in the same group'
            },
            xAxis: {
                categories: groupedLabels
            },

            yAxis: {
                min: 0,
                title: {
                    text: 'Percentage'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
            legend: {
                enabled: false,
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}%<br/>Total: {point.stackTotal}%'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        inside: true,
                        enabled: true,
                        format: '{point.y:.1f}%', // one decimal
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }
            },
            series: getGroupedProbabilities(items),
        });
    }
    React.useEffect(() => {
        if (props.data) {
            setFilteredItems(getSortedAndFilterData(props.data));
            setSortedItems(getSortedData(props.data));
        }
    }, [props.data]);

    React.useEffect(() => {
        if (props.data && filteredItems && groupedLabels && sortedItems) {
            setChart(filteredItems);
            setStackedChart(sortedItems);
        }
    }, [filteredItems]);

    function showAgeDistribution(ageDistribution, treatmentLabel) {
        setIsShowAgeDistribution(true);
        Highcharts.chart('age-container', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: `Age distribution for treatment: <br> <span class="capitalized">${treatmentLabel.toLowerCase()}</span>`
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name} years old</b><br>{point.percentage:.1f}%',
                        filter: {
                            property: 'percentage',
                            operator: '>',
                            value: 5
                        }
                    }
                }
            },
            series: [{
                name: 'Probability',
                data: Object.entries(ageDistribution).map(([key, value]) => {return {"name": key, "y": value}})
            }]
        });
    }
    function showDiagnosisDistribution(diagnosisDistribution, treatmentLabel) {
        setIsShowDiagnosisDistribution(true);
        Highcharts.chart('diagnosis-container', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: `Diagnosis distribution for treatment: </b><br> <span class="capitalized">${treatmentLabel.toLowerCase()}</span>`
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
                        filter: {
                            property: 'percentage',
                            operator: '>',
                            value: 5
                        }
                    }
                }
            },
            series: [{
                name: 'Percentage',
                data: Object.entries(diagnosisDistribution).map(([key, value]) => {return {"name": getDiagnosis(key), "y": value}})
            }]
        });
    }

    function showGenderDistribution(genderDistribution, treatmentLabel) {
        setIsShowGenderDistribution(true);
        Highcharts.chart('gender-container', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: `Gender distribution for treatment: </b><br> <span class="capitalized">${treatmentLabel.toLowerCase()}</span>`
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    colors: ['#f1aa77', '#154360'],
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
                        filter: {
                            property: 'percentage',
                            operator: '>',
                            value: 5
                        }
                    }
                }
            },
            series: [{
                name: 'Percentage',
                data: Object.entries(genderDistribution).map(([key, value]) => {return {"name": getGender(key), "y": value}})
            }]
        });
    }
    function getGender (gender) {
        if (gender === "F") {
            return "Female"
        }
        return "Male";
    }
    function getDiagnosis (diagnosis) {
        return diagnosisTranslator.get(diagnosis) || "Other"
    }
    return (props.data && props.performed_procedure ?
            <>
                <div className="relative flex my-4 flex-col justify-between bg-gradient-to-r ">


                    <div
                        className="flex w-96 flex-col justify-center bg-white rounded-2xl shadow-xl shadow-slate-300/60 rounded-lg w-auto my-4">
                        {patient ? <div
                            className="flex w-96 flex-col justify-center bg-white rounded-2xl rounded-lg w-auto">
                            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                                <div className="flex flex-wrap items-center">
                                    <div className="relative w-full max-w-full flex-grow flex-1">
                                        <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                                            Patient
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <table className="items-center m-2 w-auto bg-transparent border-collapse">
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
                                </tr>
                                </thead>
                                <tbody>
                                    <tr  className={"hover:table-row"}>
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

                                    </tr>
                                </tbody>
                            </table>
                        </div> : <></>}
                    </div>
                    {medicalRecord && performedProcedureOptions ? <div
                        className="flex w-96 flex-col justify-center bg-white rounded-2xl shadow-xl shadow-slate-300/60 rounded-lg w-auto my-4">
                        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                            <div className="flex flex-wrap items-center">
                                <div className="relative w-full max-w-full flex-grow flex-1">
                                    <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                                        Record
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <table className="items-center m-2 w-auto bg-transparent border-collapse">
                            <thead>
                            <tr>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Height
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Weight
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Reason for encounter
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Reason for discharge
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Transplantations amount
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Main Diagnosis
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Performed Procedure
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {(
                                <tr  className={"hover:table-row"}>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {medicalRecord.height}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {medicalRecord.weight}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {encounterTranslator.get(medicalRecord.reason_for_encounter)}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {dischargeTranslator.get(medicalRecord.reason_for_discharge)}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {medicalRecord.number_of_transplantation}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {diagnosisTranslator.get(medicalRecord.main_diagnosis)}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">

                                        {performedProcedureOptions.find(item => item.co_procedimento === medicalRecord.performed_procedure)?.no_procedimento}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div> : <></>}
                </div>
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                        <div className="flex flex-wrap items-center">
                            <div className="relative w-full max-w-full flex-grow flex-1">
                                <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                                    Performed procedures groups
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 flex-auto">
                        <div className="relative h-1000-px">
                            <div id="group-container" style={{"width": "100%", "height": "400px"}}></div>
                            <svg version="1.1" className="highcharts-root"
                                 style={{"fontFamily": "'Lucida Grande', 'Lucida Sans Unicode', 'Arial', 'Helvetica', 'sans-serif'", "fontSize": "12px;"}}
                                 xmlns="http://www.w3.org/2000/svg" width="100%" height="30" viewBox="0 0 300 30">g
                                class="highcharts-legend highcharts-no-tooltip" data-z-index="7"
                                transform="translate(602,359)"&gt;
                                <rect fill="none" className="highcharts-legend-box" rx="0" ry="0" x="0" y="0"
                                      width="333" height="26" visibility="visible"></rect>
                                <g data-z-index="1">
                                    <g>
                                        <g className="highcharts-legend-item highcharts-bar-series highcharts-color-undefined highcharts-series-0"
                                           data-z-index="1" transform="translate(8,3)">
                                            <text x="21" text-anchor="start" data-z-index="2" y="15"
                                                  style={{"color": "rgb(51, 51, 51)", "cursor": "pointer", "fontSize": "12px", "fontWeight": "bold", "fill": "rgb(51, 51, 51)"}}>System
                                                recommendations
                                            </text>
                                            <rect x="2" y="4" width="12" height="12" fill="#aeafb1" rx="6" ry="6"
                                                  className="highcharts-point" data-z-index="3"></rect>
                                        </g>
                                        <g className="highcharts-legend-item highcharts-bar-series highcharts-color-undefined highcharts-series-1"
                                           data-z-index="1" transform="translate(207.953125,3)">
                                            <text x="21" y="15" text-anchor="start" data-z-index="2"
                                                  style={{"color": "rgb(51, 51, 51)", "cursor": "pointer", "fontSize": "12px", "fontWeight": "bold", "fill": "rgb(51, 51, 51)"}}>Doctor
                                                decision
                                            </text>
                                            <rect x="2" y="4" width="12" height="12" fill="#1e831c" rx="6" ry="6"
                                                  className="highcharts-point" data-z-index="3"></rect>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>

                    </div>

                </div>
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                        <div className="flex flex-wrap items-center">
                            <div className="relative w-full max-w-full flex-grow flex-1">
                                <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                                    Performed procedures
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 flex-auto">
                        <div className="relative h-1000-px">
                            <div id="container" style={{"width": "100%", "height": "400px"}}></div>
                        </div>

                    </div>

                </div>

                <div style={{"display": "flex", 'justifyContent': 'space-between'}}>
                {
                    isShowAgeDistribution && (
                        <div className="relative flex flex-col mr-4 inline-flex min-w-0 break-words bg-white xl:w-4/12 mb-6 shadow-lg rounded">
                            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                                <div className="flex flex-wrap items-center">
                                    <div className="relative w-full max-w-full flex-grow flex-1">
                                        <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                                            Age distribution
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex-auto">
                                <div className="relative h-1000-px">
                                    <div id="age-container" style={{"width": "100%", "height": "400px"}}></div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    isShowGenderDistribution && (
                        <div className="relative flex flex-col mr-4 inline-flex min-w-0 break-words bg-white xl:w-4/12 mb-6 shadow-lg rounded">
                            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                                <div className="flex flex-wrap items-center">
                                    <div className="relative w-full max-w-full flex-grow flex-1">
                                        <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                                            Gender distribution
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex-auto">
                                <div className="relative h-1000-px">
                                    <div id="gender-container" style={{"width": "100%", "height": "400px"}}></div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    isShowDiagnosisDistribution && (
                        <div className="relative flex flex-col ml-4 inline-flex min-w-0 break-words bg-white xl:w-4/12 mb-6 shadow-lg rounded">
                            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                                <div className="flex flex-wrap items-center">
                                    <div className="relative w-full max-w-full flex-grow flex-1">
                                        <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                                            Diagnosis distribution
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex-auto">
                                <div className="relative h-1000-px">
                                    <div id="diagnosis-container" style={{"width": "100%", "height": "400px"}}></div>
                                </div>
                            </div>
                        </div>
                    )
                }
                </div>
            </> : <div>
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span
                              className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200">
                            Loading
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-lightBlue-600">
                            {`${time}%`}
                          </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-lightBlue-200">
                        <div style={{width: `${time}%`}}
                             className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-lightBlue-500"></div>
                    </div>
                </div>
            </div>
    );
}
