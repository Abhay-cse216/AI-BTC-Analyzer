"use client";

import { useEffect, useState } from "react";
import {
  getAnomalies,
  type BitcoinTransaction,
} from "../../services/bitcoinApi";

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<
    BitcoinTransaction[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await getAnomalies();
        setTransactions(data.transactions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  const total = transactions.length;

  const anomalies = transactions.filter(
    (tx) => tx.is_anomaly
  ).length;

  const high = transactions.filter(
    (tx) => tx.risk_level === "HIGH"
  ).length;

  const medium = transactions.filter(
    (tx) => tx.risk_level === "MEDIUM"
  ).length;

  const low = transactions.filter(
    (tx) => tx.risk_level === "LOW"
  ).length;

  const averageScore =
    total > 0
      ? transactions.reduce(
          (sum, tx) => sum + tx.anomaly_score,
          0
        ) / total
      : 0;

  return (
    <main style={pageStyle}>
      <h1>Security Report</h1>

      <p style={{ color: "#71809d" }}>
        Summary of the latest monitored Bitcoin transaction
        activity.
      </p>

      {loading ? (
        <p>Generating report...</p>
      ) : (
        <>
          <div style={gridStyle}>
            <Stat
              title="Transactions"
              value={total}
              color="#42bfff"
            />

            <Stat
              title="Anomalies"
              value={anomalies}
              color="#ff587c"
            />

            <Stat
              title="High Risk"
              value={high}
              color="#ff587c"
            />

            <Stat
              title="Medium Risk"
              value={medium}
              color="#ffb83e"
            />

            <Stat
              title="Low Risk"
              value={low}
              color="#3bdca4"
            />

            <Stat
              title="Average Score"
              value={averageScore.toFixed(2)}
              color="#a78bfa"
            />
          </div>

          <section style={panelStyle}>
            <h2>Risk Summary</h2>

            <div style={barContainer}>
              <div
                style={{
                  ...bar,
                  width: `${(high / Math.max(total, 1)) * 100}%`,
                  background: "#ff587c",
                }}
              />

              <div
                style={{
                  ...bar,
                  width: `${(medium / Math.max(total, 1)) * 100}%`,
                  background: "#ffb83e",
                }}
              />

              <div
                style={{
                  ...bar,
                  width: `${(low / Math.max(total, 1)) * 100}%`,
                  background: "#3bdca4",
                }}
              />
            </div>

            <div style={legend}>
              <span>🔴 High: {high}</span>
              <span>🟠 Medium: {medium}</span>
              <span>🟢 Low: {low}</span>
            </div>
          </section>

          <section style={panelStyle}>
            <h2>Recent Investigations</h2>

            {transactions
              .filter((tx) => tx.is_anomaly)
              .slice(0, 10)
              .map((tx) => (
                <div
                  key={tx.txid}
                  style={rowStyle}
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
                    Score:{" "}
                    {tx.anomaly_score.toFixed(2)}
                  </span>

                  <strong
                    style={{
                      color:
                        tx.risk_level === "HIGH"
                          ? "#ff587c"
                          : tx.risk_level === "MEDIUM"
                          ? "#ffb83e"
                          : "#3bdca4",
                    }}
                  >
                    {tx.risk_level}
                  </strong>
                </div>
              ))}
          </section>

          <p style={noteStyle}>
            This report summarizes model-generated anomaly
            indicators. An anomaly or risk category does not
            establish that a transaction is fraudulent or
            illicit.
          </p>
        </>
      )}
    </main>
  );
}

function Stat({
  title,
  value,
  color,
}: {
  title: string;
  value: number | string;
  color: string;
}) {
  return (
    <div style={cardStyle}>
      <span style={{ color: "#71809d" }}>
        {title}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: "8px",
          fontSize: "27px",
          color,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#060a14",
  color: "#e8eefc",
  padding: "30px",
  fontFamily: "Arial, sans-serif",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "15px",
  marginTop: "25px",
};

const cardStyle = {
  background: "#0e1728",
  border: "1px solid #19263b",
  borderRadius: "15px",
  padding: "20px",
};

const panelStyle = {
  marginTop: "25px",
  background: "#0e1728",
  border: "1px solid #19263b",
  borderRadius: "15px",
  padding: "20px",
};

const barContainer = {
  display: "flex",
  height: "22px",
  marginTop: "20px",
  borderRadius: "10px",
  overflow: "hidden",
  background: "#131e31",
};

const bar = {
  height: "100%",
};

const legend = {
  display: "flex",
  gap: "25px",
  marginTop: "15px",
  color: "#9aa8c0",
  fontSize: "12px",
};

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 100px",
  padding: "15px 5px",
  borderBottom: "1px solid #19263b",
  fontSize: "12px",
};

const noteStyle = {
  marginTop: "20px",
  color: "#59677f",
  fontSize: "12px",
};