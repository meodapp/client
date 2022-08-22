import React, {useEffect, useState} from "react";
import Chart from "chart.js";
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function CardHorizontalChart(props) {
  const [time, setData] = useState(0);

  useEffect(() => {
    if (time < 90) {
      setTimeout(() => {
        setData(time+getRandomInt(1, 3))
      }, 300)
    }
  }, [time]);

  function getProbabilities(items) {
    return Object.entries(items).map(([key, value]) => {
      if (key !== props.performed_procedure) {
        return value.probability
      }
      return 0;
    })
  }

  function getLabels(items) {
    return Object.entries(items).map(([key, value]) => value.display_name)
  }

  function getDoctorProbabilities(items) {
    return Object.entries(items).map(([key, value]) => {
      if (key === props.performed_procedure) {
        return value.probability
      }
      return 0;
    })
  }


  React.useEffect(() => {
    if (props.data) {
      const chartData = {
        labels: getLabels(props.data),
        datasets: [
          {
            label: 'System recommendations',
            data: getProbabilities(props.data),
            borderColor: 'blue',
            backgroundColor: 'blue',
            stack: 'Stack 0',
          },
          {
            label: 'Doctor decision',
            data: getDoctorProbabilities(props.data),
            borderColor: 'red',
            backgroundColor: 'red',
            stack: 'Stack 0',
          }
        ]
      }
      const config = {
        type: 'horizontalBar',
        data: chartData,
        options: {
          indexAxis: 'y',
          // Elements options apply to all of the options unless overridden in a dataset
          // In this case, we are setting the border of each horizontal bar to be 2px wide
          elements: {
            bar: {
              borderWidth: 2,
            }
          },
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            },
            title: {
              display: true,
              text: 'Chart.js Horizontal Bar Chart'
            }
          },
          tooltips: {
            filter: function (tooltipItem, data) {
              // data contains the charts data, make sure you select the right
              // value.
              var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              if (value === 0) {
                return false;
              } else {
                return true;
              }
            }
          }
        },
      };
      let ctx = document.getElementById("bar-chart").getContext("2d");
      window.myBar = new Chart(ctx, config);
    }
  }, [props.data]);
  return ( props.data && props.performed_procedure ?
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                Performed procedures
              </h6>
              <h2 className="text-blueGray-700 text-xl font-semibold">
                Probabilities
              </h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative h-1000-px">
            <canvas id="bar-chart"></canvas>
          </div>
        </div>
      </div>
    </> : <div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200">
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
                <div style={{width: `${time}%`}} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-lightBlue-500"></div>
              </div>
            </div>
          </div>
  );
}
