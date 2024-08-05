import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [year, setYear] = useState('');
  const [topic, setTopic] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const chartRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:3000/data')
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: filteredData.map(item => item.year),
        datasets: [
          {
            label: 'Intensity',
            data: filteredData.map(item => item.intensity),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Likelihood',
            data: filteredData.map(item => item.likelihood),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Relevance',
            data: filteredData.map(item => item.relevance),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [filteredData]);

  const handleYearChange = (e) => setYear(e.target.value);
  const handleTopicChange = (e) => setTopic(e.target.value);
  const handleCountryChange = (e) => setCountry(e.target.value);
  const handleRegionChange = (e) => setRegion(e.target.value);
  const handleCityChange = (e) => setCity(e.target.value);

  const applyFilters = () => {
    const queryParams = [];
    if (year) queryParams.push(`year=${year}`);
    if (topic) queryParams.push(`topic=${topic}`);
    if (country) queryParams.push(`country=${country}`);
    if (region) queryParams.push(`region=${region}`);
    if (city) queryParams.push(`city=${city}`);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    axios.get(`http://localhost:3000/data${queryString}`)
      .then(response => setFilteredData(response.data))
      .catch(error => console.error('Error fetching filtered data:', error));
  };

  return (
    <div>
      <h1>Data Visualization Dashboard</h1>
      <div>
        <label>
          Year:
          <input type="text" value={year} onChange={handleYearChange} />
        </label>
        <label>
          Topic:
          <input type="text" value={topic} onChange={handleTopicChange} />
        </label>
        <label>
          Country:
          <input type="text" value={country} onChange={handleCountryChange} />
        </label>
        <label>
          Region:
          <input type="text" value={region} onChange={handleRegionChange} />
        </label>
        <label>
          City:
          <input type="text" value={city} onChange={handleCityChange} />
        </label>
        <button onClick={applyFilters}>Apply Filters</button>
      </div>
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default Dashboard;
