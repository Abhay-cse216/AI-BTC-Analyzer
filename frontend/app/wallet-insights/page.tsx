"use client";

import { useEffect, useState } from "react";
import {
  getTransactionNetwork,
  type NetworkResponse,
} from "../../services/bitcoinApi";

export default function WalletInsightsPage() {
  const [network, setNetwork] =
    useState<NetworkResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getTransactionNetwork();
        setNetwork(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <main style={pageStyle}>
        <h1>Wallet Insights</h1>
        <p style={{ color: "#71809d" }}>
          Loading real Bitcoin wallet data...
        </p>
      </main>
    );
  }

  const nodes = network?.nodes ?? [];

  const inputWallets = nodes.filter(
    (node) => node.type === "input"
  ).length;

  const outputWallets = nodes.filter(
    (node) => node.type === "output"
  ).length;

  const uniqueWallets = new Set(
    nodes.map((node) => node.id)
  ).size;

  return (
    <main style={pageStyle}>
      <h1>Wallet Insights</h1>

      <p style={{ color: "#71809d" }}>
        Address-level insights derived from the monitored
        Bitcoin transaction network.
      </p>

      <div style={gridStyle}>
        <Stat
          title="Unique Addresses"
          value={uniqueWallets}
          color="#42bfff"
        />

        <Stat
          title="Input Addresses"
          value={inputWallets}
          color="#ff587c"
        />

        <Stat
          title="Output Addresses"
          value={outputWallets}
          color="#3bdca4"
        />

        <Stat
          title="Network Connections"
          value={network?.edge_count ?? 0}
          color="#ffb83e"
        />
      </div>

      <div style={panelStyle}>
        <h2>Monitored Wallet Addresses</h2>

        <div
          style={{
            marginTop: "15px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          {nodes.slice(0, 50).map((node) => (
            <div
              key={node.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "13px 5px",
                borderBottom: "1px solid #19263b",
              }}
            >
              <span
                style={{
                  color: "#42bfff",
                  fontFamily: "monospace",
                  fontSize: "12px",
                }}
              >
                {node.id}
              </span>

              <span
                style={{
                  color:
                    node.type === "input"
                      ? "#ff587c"
                      : "#3bdca4",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              >
                {node.type.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p
        style={{
          marginTop: "20px",
          color: "#59677f",
          fontSize: "12px",
        }}
      >
        Address relationships shown here are derived from
        the monitored transaction network. They do not by
        themselves identify ownership of an address.
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
    <div style={cardStyle}>
      <span
        style={{
          color: "#71809d",
          fontSize: "12px",
        }}
      >
        {title}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: "8px",
          fontSize: "28px",
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
  gridTemplateColumns: "repeat(4, 1fr)",
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