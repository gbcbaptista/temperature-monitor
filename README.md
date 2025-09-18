# Real-Time IoT Temperature Dashboard with AWS Serverless & Next.js

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Serverless](https://img.shields.io/badge/Serverless-FD5750?style=for-the-badge&logo=serverless&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

This project is a complete, end-to-end demonstration of a modern Internet of Things (IoT) solution. It captures temperature data from a physical ESP32 microcontroller and visualizes it on a dynamic, real-time web dashboard. The entire cloud infrastructure is built on a serverless AWS architecture, ensuring scalability, low cost, and high availability, while the frontend is a responsive Next.js application automatically deployed via GitHub Actions.

**[>> View the Live Demo <<](YOUR_CLOUDFRONT_URL_HERE)**

![Project Screenshot](URL_TO_A_SCREENSHOT_OR_GIF_OF_YOUR_DASHBOARD)

## ✨ Key Features

- [cite_start]**Real-Time Data Ingestion:** An ESP32 microcontroller with a DS18B20 sensor reads and transmits temperature data every 30 seconds. [cite: 2]
- **Secure & Scalable Backend:** A fully serverless backend built on AWS handles data ingestion, processing, storage, and delivery.
- [cite_start]**Dynamic Frontend:** A responsive frontend built with Next.js and React that displays historical data and receives live updates. [cite: 29]
- [cite_start]**Live Updates via WebSockets:** The dashboard updates instantly with new temperature readings without needing to refresh the page. [cite: 29]
- [cite_start]**Historical Data View:** On initial load, the application fetches and displays the last 24 hours of temperature data. [cite: 29]
- [cite_start]**Internationalization (i18n):** The user interface supports both English (US) and Portuguese (BR), managed by a Zustand state store. [cite: 25, 30]
- [cite_start]**Automated Deployments:** A CI/CD pipeline using GitHub Actions automatically builds and deploys the Next.js frontend to AWS S3 and CloudFront on every push to the `main` branch. [cite: 31]

## 🏗️ Solution Architecture

The architecture is designed to be event-driven, decoupled, and highly scalable, following modern cloud-native best practices.

```mermaid
graph TD
    subgraph Hardware
        A[ESP32 with DS18B20 Sensor]
    end

    subgraph "AWS Cloud"
        B[AWS IoT Core]
        C{IoT Rule}
        D[Lambda: ProcessTemperatureData]
        E[DynamoDB: TemperatureData]
        F[API Gateway WebSocket API]
        H[API Gateway REST API]
        I[Lambda: GetTemperatureDataAPI]
        J[DynamoDB: WebSocketConnections]

        B --> C
        C --> D
        D --> E
        D --> J
        D --> F

        H --> I
        I --> E

        F -- onConnect/onDisconnect --> J
    end

    subgraph "Frontend (S3 + CloudFront)"
        G[Next.js / React App]
    end

    A -->|MQTT over TLS| B
    F -->|WSS| G
    G -->|HTTPS GET| H
```

**Data Flow Explained:**

1.  **Ingestion:** The **ESP32** device reads the temperature and securely publishes a JSON payload to a specific topic on **AWS IoT Core** using the MQTT protocol.
2.  **Routing:** An **IoT Rule** is configured to listen to this topic. When a message arrives, it triggers the **`ProcessTemperatureData` Lambda function**.
3.  **Processing & Storage:** This primary Lambda function:
    - Saves the temperature record (device_id, timestamp, temperature) into the **`TemperatureData` DynamoDB table**.
    - Scans the `WebSocketConnections` table to get a list of all currently connected clients.
    - Uses the **API Gateway Management API** to push the new temperature data to every active client via the **WebSocket API**.
4.  **Historical Data Request:** When a user first opens the web application, the **Next.js/React frontend** makes an HTTPS request to the **API Gateway REST API** (`/temperatures`).
5.  **Data Retrieval:** This request triggers the **`GetTemperatureDataAPI` Lambda**, which queries the `TemperatureData` DynamoDB table for the last 24 hours of data and returns it to the frontend.
6.  **Real-Time Connection:** Simultaneously, the frontend establishes a persistent connection to the **API Gateway WebSocket API**. API Gateway manages this connection's lifecycle, triggering Lambdas to add/remove the `connectionId` from the `WebSocketConnections` table.

## 🛠️ Tech Stack

- **Hardware:**
  - Microcontroller: ESP32
  - Sensor: DS18B20
- **Cloud - AWS:**
  - **AWS IoT Core:** For MQTT message ingestion and routing.
  - **AWS Lambda:** For serverless compute (data processing, API logic).
  - **Amazon DynamoDB:** NoSQL database for time-series data storage and WebSocket connection management.
  - **Amazon API Gateway:** For creating and managing both RESTful and WebSocket APIs.
  - **Amazon S3:** For static website hosting.
  - **Amazon CloudFront:** For global content delivery (CDN) and SSL/TLS termination.
  - **AWS IAM:** For secure permission management.
- **Frontend:**
  - [cite_start]Framework: **Next.js** with **React** [cite: 18, 20]
  - [cite_start]Styling: **Tailwind CSS** [cite: 20]
  - [cite_start]Charting: **Chart.js** with `react-chartjs-2` wrapper [cite: 18]
  - [cite_start]State Management: **Zustand** (for i18n) [cite: 18, 25]
  - [cite_start]Real-Time: **react-use-websocket** [cite: 18]
- **DevOps:**
  - [cite_start]**GitHub Actions:** For CI/CD and automated deployments to AWS. [cite: 31]

## 🧠 Challenges & Key Learnings

- **Time-Series Data Modeling in DynamoDB:** Implemented a composite primary key pattern (`device_id` as Partition Key, `timestamp` as Sort Key) to enable efficient time-range queries, a crucial task for a non-relational database.
- **Serverless WebSocket Architecture:** Designed and implemented a real-time system without a persistent server. This involved using API Gateway to manage the connection lifecycle and DynamoDB to maintain the state of active connections, which the data processing Lambda could then query to broadcast messages.
- **End-to-End Security:** Configured secure communication from the device to the cloud (MQTT over TLS) and from the cloud to the browser (HTTPS/WSS via CloudFront and API Gateway). Set up granular IAM roles and secure GitHub Secrets for the CI/CD pipeline.
- [cite_start]**CI/CD Automation:** Built a GitHub Actions workflow to automate the build, static export (`next export`), and deployment process, including syncing files to S3 and invalidating the CloudFront cache to ensure users always see the latest version. [cite: 20, 31]

## 🚀 Getting Started

[cite_start]This project is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)[cite: 19].

First, run the development server:

```bash
npm run dev
```

[cite_start]Open [http://localhost:3000](http://localhost:3000) with your browser to see the result[cite: 19].

You can start editing the page by modifying `app/page.tsx`. [cite_start]The page auto-updates as you edit the file[cite: 19].

## 👤 Author

**Gabriel Baptista**

- [LinkedIn](https://www.linkedin.com/in/gbcbaptista/)
- [GitHub](https://github.com/gbcbaptista)
- [Portfolio](https://gabriel-baptista.dev/)
