"use client";

import { useEffect, useState } from "react";
import {
  getAnomalies,
  type BitcoinTransaction,
} from "../../services/bitcoinApi";

export default function AlertsPage() {
  const [transactions, setTransactions] = useState<
    BitcoinTransaction[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await getAnomalies();

        const alerts = data.transactions.filter(
          (tx) => tx.risk_level !== "LOW"
        );

        setTransactions(alerts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, []);

  const highRisk = transactions.filter(
    (tx) => tx.risk_level === "HIGH"
  ).length;

  const mediumRisk = transactions.filter(
    (tx) => tx.risk_level === "MEDIUM"
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
      <h1>Risk Alerts</h1>

      <p style={{ color: "#71809d" }}>
        Real-time transactions requiring investigation.
      </p>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        <Stat
          title="High Risk"
          value={highRisk}
          color="#ff587c"
        />

        <Stat
          title="Medium Risk"
          value={mediumRisk}
          color="#ffb83e"
        />
      </div>

      <div
        style={{
          marginTop: "25px",
          background: "#0e1728",
          border: "1px solid #19263b",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 130px 120px 120px",
            padding: "15px 20px",
            color: "#71809d",
            fontSize: "11px",
            borderBottom: "1px solid #19263b",
          }}
        >
          <span>TRANSACTION</span>
          <span>ANOMALY SCORE</span>
          <span>RISK</span>
          <span>INPUT / OUTPUT</span>
        </div>

        {loading ? (
          <div style={{ padding: "25px" }}>
            Loading real alerts...
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: "25px", color: "#71809d" }}>
            No medium or high risk transactions detected.
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.txid}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "2fr 130px 120px 120px",
                padding: "17px 20px",
                borderBottom:
                  "1px solid #131e31",
                fontSize: "12px",
              }}
            >
              <span
                style={{
                  color: "#42bfff",
                  fontFamily: "monospace",
                }}
              >
                {tx.txid.slice(0, 12)}...
                {tx.txid.slice(-8)}
              </span>

              <span>
                {tx.anomaly_score.toFixed(2)}
              </span>

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

              <span>
                {tx.input_count} /{" "}
                {tx.output_count}
              </span>
            </div>
          ))
        )}
      </div>

      <p
        style={{
          marginTop: "20px",
          color: "#59677f",
          fontSize: "12px",
        }}
      >
        Risk alerts are investigation indicators. They do
        not establish that a transaction is fraudulent or
        illicit.
      </p>
    </main>
  );
}

function Stat({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#0e1728",
        border: "1px solid #19263b",
        borderRadius: "12px",
        padding: "18px 30px",
        minWidth: "160px",
      }}
    >
      <div
        style={{
          color: "#71809d",
          fontSize: "12px",
        }}
      >
        {title}
      </div>

      <strong
        style={{
          display: "block",
          color,
          fontSize: "28px",
          marginTop: "6px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}