import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "chart.js/auto";

const API_URL =
  "https://bx85msyxwb.execute-api.sa-east-1.amazonaws.com/dev/temperatures";

const WEBSOCKET_URL =
  "wss://eu2xrp83l0.execute-api.sa-east-1.amazonaws.com/dev/";

function App() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Falha ao buscar dados da API");
        }
        const historicalData = await response.json();

        historicalData.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        setTemperatureData(historicalData);
      } catch (error) {
        console.error("Erro ao carregar dados históricos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const { lastJsonMessage, readyState } = useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setTemperatureData((prevData) => {
        const newData = [...prevData, lastJsonMessage];
        return newData.slice(-1000);
      });
    }
  }, [lastJsonMessage]);

  const chartData = {
    labels: temperatureData.map((data) =>
      new Date(data.timestamp).toLocaleTimeString("pt-BR")
    ),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temperatureData.map((data) => data.temperature),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.2,
        pointRadius: temperatureData.map((_, index) =>
          index === temperatureData.length - 1 ? 5 : 1
        ),
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: temperatureData.map((_, index) =>
          index === temperatureData.length - 1
            ? "rgb(255, 99, 132)"
            : "transparent"
        ),
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: 20,
        suggestedMax: 30,
      },
    },
    animation: {
      duration: 100,
    },
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Conectando...",
    [ReadyState.OPEN]: "Conectado",
    [ReadyState.CLOSING]: "Desconectando...",
    [ReadyState.CLOSED]: "Desconectado",
    [ReadyState.UNINSTANTIATED]: "Não instanciado",
  }[readyState];

  return (
    <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
      <h1>Dashboard de Temperatura em Tempo Real</h1>
      <p>
        Status da Conexão: <strong>{connectionStatus}</strong>
      </p>
      {isLoading ? (
        <p>Carregando dados das últimas 24 horas...</p>
      ) : temperatureData.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Nenhum dado encontrado. Aguardando leituras do sensor...</p>
      )}
      <p style={{ marginTop: "20px", fontSize: "0.9em" }}>
        Última Leitura:{" "}
        <strong>
          {temperatureData.length > 0
            ? `${temperatureData[temperatureData.length - 1].temperature}°C`
            : "N/A"}
        </strong>
      </p>
    </div>
  );
}

export default App;
