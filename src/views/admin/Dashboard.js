import React, {useEffect, useState} from "react";
// components

import CardVerticalChart from "../../components/Cards/CardVerticalChart";

export default function Dashboard(props) {
    const [data, setData] = useState();

    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                medical_record_id: props.match.params.id
            })
        };
        fetch(`${process.env.REACT_APP_API_PATH}/analysis/`, requestOptions)
            .then(response => response.json())
            .then(resp => {
                console.log(resp);
                setData(resp);
            })
            .catch(error => {
                console.error(error.response)
            })

    }, []);

    return (
            <>
                <div className="flex flex-wrap">
                    {/*<div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">*/}
                    {/*  <CardLineChart />*/}
                    {/*</div>*/}
                    <div className="w-full xl:w-12/12 mb-12 xl:mb-0 px-4">
                        {/*<CardBarChart />*/}
                        <CardVerticalChart patient_id={props.match.params.patientId} medical_record_id={props.match.params.id} data={data?.statistics} performed_procedure={data?.performed_procedure}/>
                    </div>
                </div>
                <div className="flex flex-wrap mt-4">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        {/*<CardPageVisits />*/}
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        {/*<CardSocialTraffic />*/}
                    </div>
                    <br/>
                    <br/>
                </div>
            </>

    );
}
