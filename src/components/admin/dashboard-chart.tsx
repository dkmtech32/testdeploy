'use client'
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface DashboardChartProps {
  data: {
    users: number[];
    leagues: number[];
    groups: number[];
  };
}

const DashboardChart: React.FC<DashboardChartProps> = ({ data }) => {
  const createChartData = (active: number, inactive: number) => ({
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [active, inactive],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row justify-around items-center gap-8">
      <div className="w-full md:w-1/3">
        <h2 className="text-xl font-semibold mb-4 text-center">Users</h2>
        <Pie data={createChartData(data.users[0], data.users[1])} options={options} />
      </div>
      <div className="w-full md:w-1/3">
        <h2 className="text-xl font-semibold mb-4 text-center">Leagues</h2>
        <Pie data={createChartData(data.leagues[0], data.leagues[1])} options={options} />
      </div>
      <div className="w-full md:w-1/3">
        <h2 className="text-xl font-semibold mb-4 text-center">Groups</h2>
        <Pie data={createChartData(data.groups[0], data.groups[1])} options={options} />
      </div>
    </div>
  );
};

export default DashboardChart;
