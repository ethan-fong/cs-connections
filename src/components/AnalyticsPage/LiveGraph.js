import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Ensure Chart.js is correctly imported
import { fetchGuessTimeDistribution } from './api'; // Adjust the path as needed

const LiveGraph = ({ selectedNumber }) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [{
      label: 'Average Guess Time',
      data: [],
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchGuessTimeDistribution(selectedNumber);
        const parsedResult = JSON.parse(result);

        // Ensure the data is being parsed correctly
        console.log('Parsed Result:', parsedResult);
        let parsedResult2 = parsedResult["guess distribution"];
        //console.log('Parsed Result inner:', parsedResult2);
        // Convert parsedResult to an array of [key, value] pairs
        const labels = Object.keys(parsedResult2).map(key => 
          key
            .replace(/[']/g, '')
            .replace(/,/g, ', ')
        );
        const values = Object.values(parsedResult2).map(item => item[0]);

        // Log the processed labels and values
        console.log('Labels:', labels);
        console.log('Values:', values);

        setData({
          labels,
          datasets: [{
            label: 'Average Guess Time',
            data: values,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1
          }]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    //const intervalId = setInterval(fetchData, 15000); // Set up interval to fetch data every 15 seconds

    //return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [selectedNumber]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `Average Time: ${tooltipItem.raw} seconds`;
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Categories',
                font: {
                  size: 14
                }
              },
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 30,
                maxTicksLimit: 10,
                padding: 10
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Average Time (seconds)',
                font: {
                  size: 14
                }
              },
              ticks: {
                stepSize: 1
              }
            }
          },
          layout: {
            padding: {
              left: 20,
              right: 20,
              top: 20,
              bottom: 20
            }
          }
        }}
      />
    </div>
  );
};

export default LiveGraph;