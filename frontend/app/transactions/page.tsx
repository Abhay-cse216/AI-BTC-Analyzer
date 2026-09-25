"use client";

import { useEffect, useState } from "react";
import {
  getAnomalies,
  type BitcoinTransaction,
} from "../../services/bitcoinApi";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<
    BitcoinTransaction[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await getAnomalies();
        setTransactions(data.transactions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

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
      <h1>Bitcoin Transactions</h1>

      <p style={{ color: "#71809d" }}>
        Real transactions from the latest monitored Bitcoin block.
      </p>

      {loading ? (
        <p>Loading real Bitcoin transactions...</p>
      ) : (
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
                "2fr 100px 100px 100px 120px",
              padding: "15px 20px",
              color: "#71809d",
              borderBottom: "1px solid #19263b",
              fontSize: "12px",
            }}
          >
            <span>TRANSACTION</span>
            <span>INPUTS</span>
            <span>OUTPUTS</span>
            <span>SCORE</span>
            <span>RISK</span>
          </div>

          {transactions.map((tx) => (
            <div
              key={tx.txid}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "2fr 100px 100px 100px 120px",
                padding: "16px 20px",
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

              <span>{tx.input_count}</span>

              <span>{tx.output_count}</span>

              <span>
                {tx.anomaly_score.toFixed(2)}
              </span>

              <span
                style={{
                  color:
                    tx.risk_level === "HIGH"
                      ? "#ff587c"
                      : tx.risk_level === "MEDIUM"
                      ? "#ffb83e"
                      : "#3bdca4",
                  fontWeight: "bold",
                }}
              >
                {tx.risk_level}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}