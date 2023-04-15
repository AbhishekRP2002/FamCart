import React from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['Product 1', 'Product 2', 'Product 3', 'Product 4'],
  datasets: [
    {
      label: 'Quantity',
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 1,
      data: [10, 20, 5, 15],
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const Graph = () => {
  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Graph;
