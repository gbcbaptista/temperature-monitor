"use client";

import React, { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useLocaleStore } from "@/store/localStore";
import { WEBSOCKET_URL } from "@/constants";
import { TemperatureData } from "@/types/TemperatureData";
import { TemperatureDataStore } from "@/store/temperatureStore";

const ConectionStatus = () => {
  const { currentLocale } = useLocaleStore();
  const { temperatureData, setTemperatureData } = TemperatureDataStore();

  const { lastJsonMessage, readyState } = useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      setTemperatureData(
        [...temperatureData, lastJsonMessage as TemperatureData].slice(-1000)
      );
    }
  }, [lastJsonMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: currentLocale.labels.connecting,
    [ReadyState.OPEN]: currentLocale.labels.connected,
    [ReadyState.CLOSING]: currentLocale.labels.disconnecting,
    [ReadyState.CLOSED]: currentLocale.labels.disconnected,
    [ReadyState.UNINSTANTIATED]: currentLocale.labels.uninstantiated,
  }[readyState];

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-2">
        {currentLocale.labels.title}
      </h2>
      <p className="text-secondary mb-8">
        {currentLocale.labels.connectionStatus}:{" "}
        <strong
          className={`px-2 py-1 rounded-full text-sm ${
            readyState === ReadyState.OPEN
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {connectionStatus}
        </strong>
      </p>
    </div>
  );
};

export default ConectionStatus;
