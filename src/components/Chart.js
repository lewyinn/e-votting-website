'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Chart({ data }) {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Votes',
        data: data.map(item => item.votes),
        backgroundColor: 'var(--color-secondary)',
        borderColor: 'var(--color-primary)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Hasil Voting', color: 'var(--color-neutral)', font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return <Bar data={chartData} options={options} />;
}