import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import logo from './Assets/logo.png';

const App = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [currencyData, setCurrencyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(`https://economia.awesomeapi.com.br/json/last/${selectedCurrency}-BRL`);
      const data = await response.json();
      const currencyInfo = data[selectedCurrency+'BRL'];
      setCurrencyData(prevData => [...prevData, currencyInfo.ask]);
      setLoading(false);
    };

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedCurrency]);

  useEffect(() => {
    if (chartRef.current !== null) {
      chartRef.current.destroy();
    }
    const ctx = document.getElementById('currencyChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: currencyData.length }, (_, i) => ''),
        datasets: [{
          label: `${selectedCurrency} to BRL`,
          data: currencyData,
          borderColor: '#BF1F2C',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        },
        plugins: {
          legend: {
            labels: {
              font: {
                family: 'Roboto', // Define a fonte como Roboto
                size: 16
              }
            }
          }
        }
      }
    });
  }, [currencyData, selectedCurrency]);

  const handleChangeCurrency = (event) => {
    setSelectedCurrency(event.target.value);
    setCurrencyData([]);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#091D42', fontFamily: 'Roboto, sans-serif' }}> {/* Define a fonte padrão como Roboto */}
      <div style={{ maxWidth: '65%', width: '65%', backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ marginBottom: '20px' }}>
          <img src={logo} alt="Logo" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <select value={selectedCurrency} onChange={handleChangeCurrency} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #404040', borderRadius: '5px', backgroundColor: '#BFBFBF', color: '#0D0D0D', fontWeight: 'bold', fontSize: '16px', fontFamily: 'Roboto, sans-serif' }}> {/* Define a fonte do seletor como Roboto */}
          <option value="USD">Dólar</option>
          <option value="EUR">Euro</option>
          <option value="BTC">Bitcoin</option>
        </select>
        {loading ? <p>Carregando...</p> : <canvas id="currencyChart" style={{ width: '100%', height: '300px' }}></canvas>}
      </div>
    </div>
  );
};

export default App;
