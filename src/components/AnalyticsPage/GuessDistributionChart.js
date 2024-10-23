import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Ensure Chart.js is correctly imported
import { fetchGuessDistribution } from './api'; // Adjust the path as needed

const GuessDistributionChart = ({ selectedNumber }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Guess Distribution',
      data: [],
      backgroundColor: 'rgba(153,102,255,0.2)',
      borderColor: 'rgba(153,102,255,1)',
      borderWidth: 1
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchGuessDistribution(selectedNumber);
        const parsedResult = JSON.parse(result);

        // Convert parsedResult to an array of [key, value] pairs
        const sortedData = Object.entries(parsedResult)
          .sort((a, b) => b[1] - a[1]) // Sort by count (value) in descending order
          .slice(0, 10); // Limit to top 10

        const labels = sortedData.map(([key]) => 
          key
            .replace(/[']/g, '')
            .replace(/,/g, ', ')
        );
        const values = sortedData.map(([, value]) => value);

        setChartData({
          labels,
          datasets: [{
            label: 'Guess Distribution',
            data: values,
            backgroundColor: 'rgba(153,102,255,0.2)',
            borderColor: 'rgba(153,102,255,1)',
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
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `Count: ${tooltipItem.raw}`;
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
                text: 'Count',
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

export default GuessDistributionChart;