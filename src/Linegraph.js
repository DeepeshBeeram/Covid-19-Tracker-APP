import React, { useState } from "react";
import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

function Linegraph({ caseType }) {
  const [data, setData] = useState({});

  const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

  useEffect(() => {
    const getHistoricData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, caseType);
          setData(chartData);
        });
    };

    getHistoricData();
  }, [caseType]);

  const buildChartData = (data, caseType) => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data[caseType]) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[caseType][date] - lastDataPoint,
        };

        chartData.push(newDataPoint);
      }

      lastDataPoint = data[caseType][date];
    }

    return chartData;
  };

  return (
    <div>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204,16,52,0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
        ></Line>
      )}
    </div>
  );
}

export default Linegraph;
