"use client";

import { useEffect, useState } from "react";
import {
  getAnomalies,
  type BitcoinTransaction,
} from "../../services/bitcoinApi";

export default function RiskAnalysisPage() {
  const [transactions, setTransactions] = useState<
    BitcoinTransaction[]
  >([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAnomalies();
        setTransactions(data.transactions);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  const high = transactions.filter(
    (tx) => tx.risk_level === "HIGH"
  ).length;

  const medium = transactions.filter(
    (tx) => tx.risk_level === "MEDIUM"
  ).length;

  const low = transactions.filter(
    (tx) => tx.risk_level === "LOW"
  ).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#060a14",
        color: "#e8eefc",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Risk Analysis</h1>

      <p style={{ color: "#71809d" }}>
        AI-based anomaly and transaction risk indicators.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        <div style={card}>
          <h3>HIGH RISK</h3>
          <strong style={{ color: "#ff587c" }}>
            {high}
          </strong>
          <p>Requires investigation</p>
        </div>

        <div style={card}>
          <h3>MEDIUM RISK</h3>
          <strong style={{ color: "#ffb83e" }}>
            {medium}
          </strong>
          <p>Needs monitoring</p>
        </div>

        <div style={card}>
          <h3>LOW RISK</h3>
          <strong style={{ color: "#3bdca4" }}>
            {low}
          </strong>
          <p>Normal indicator</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "25px",
          background: "#0e1728",
          border: "1px solid #19263b",
          borderRadius: "15px",
          padding: "20px",
        }}
      >
        <h2>Risk Transactions</h2>

       {transactions
  .filter((tx) => tx.risk_level !== "LOW")
  .map((tx) => (
    <div
      key={tx.txid}
      style={{
        padding: "18px 0",
        borderBottom: "1px solid #19263b",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 120px 120px",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#42bfff" }}>
          {tx.txid.slice(0, 12)}...
          {tx.txid.slice(-8)}
        </span>

       <div>
  <div>
    Anomaly: {tx.anomaly_score.toFixed(2)}
  </div>

  <div
    style={{
      marginTop: "4px",
      color: "#71809d",
      fontSize: "12px",
    }}
  >
    Risk points: {tx.risk_points}
  </div>
</div>

        <strong
          style={{
            color:
              tx.risk_level === "HIGH"
                ? "#ff587c"
                : "#ffb83e",
          }}
        >
          {tx.risk_level}
        </strong>
      </div>

      <div
        style={{
          marginTop: "12px",
          padding: "12px 15px",
          background: "#091120",
          borderRadius: "10px",
          border: "1px solid #19263b",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#71809d",
            marginBottom: "8px",
          }}
        >
          WHY THIS TRANSACTION WAS FLAGGED
        </div>

        {tx.risk_reasons.map(
          (reason, index) => (
            <div
              key={index}
              style={{
                color: "#c9d5ea",
                fontSize: "13px",
                marginTop: "5px",
              }}
            >
              • {reason}
            </div>
          )
        )}
      </div>
    </div>
  ))}
      </div>

      <p
        style={{
          marginTop: "20px",
          color: "#59677f",
          fontSize: "12px",
        }}
      >
        Risk scores are indicators for investigation and do not
        establish that a transaction is fraudulent or illicit.
      </p>
    </main>
  );
}

const card = {
  background: "#0e1728",
  border: "1px solid #19263b",
  borderRadius: "15px",
  padding: "20px",
};
