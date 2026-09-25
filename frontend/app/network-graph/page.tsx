"use client";

import { useEffect, useState } from "react";
import {
  getTransactionNetwork,
  type NetworkResponse,
} from "../../services/bitcoinApi";

export default function NetworkGraphPage() {
  const [network, setNetwork] =
    useState<NetworkResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNetwork() {
      try {
        const data = await getTransactionNetwork();
        setNetwork(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNetwork();
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
      <h1>Bitcoin Transaction Network</h1>

      <p style={{ color: "#71809d" }}>
        Real transaction relationships from the monitored Bitcoin block.
      </p>

      {loading && <p>Loading network...</p>}

      {network && (
        <>
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "25px",
            }}
          >
            <Stat
              title="Nodes"
              value={network.node_count}
            />

            <Stat
              title="Connections"
              value={network.edge_count}
            />
          </div>

          <div
            style={{
              marginTop: "25px",
              background: "#0e1728",
              border: "1px solid #19263b",
              borderRadius: "15px",
              padding: "20px",
              overflow: "hidden",
            }}
          >
            <h2>Transaction Graph</h2>

            <svg
              viewBox="0 0 1000 600"
              style={{
                width: "100%",
                height: "600px",
              }}
            >
              {network.edges
                .slice(0, 100)
                .map((edge, index) => {
                  const sourceIndex =
                    network.nodes.findIndex(
                      (node) =>
                        node.id === edge.source
                    );

                  const targetIndex =
                    network.nodes.findIndex(
                      (node) =>
                        node.id === edge.target
                    );

                  if (
                    sourceIndex < 0 ||
                    targetIndex < 0
                  ) {
                    return null;
                  }

                  const sourceX =
                    50 +
                    (sourceIndex % 20) * 48;

                  const sourceY =
                    70 +
                    Math.floor(
                      sourceIndex / 20
                    ) * 75;

                  const targetX =
                    50 +
                    (targetIndex % 20) * 48;

                  const targetY =
                    70 +
                    Math.floor(
                      targetIndex / 20
                    ) * 75;

                  return (
                    <line
                      key={`${edge.txid}-${index}`}
                      x1={sourceX}
                      y1={sourceY}
                      x2={targetX}
                      y2={targetY}
                      stroke="#263750"
                      strokeWidth="1"
                    />
                  );
                })}

              {network.nodes
                .slice(0, 120)
                .map((node, index) => {
                  const x =
                    50 +
                    (index % 20) * 48;

                  const y =
                    70 +
                    Math.floor(
                      index / 20
                    ) * 75;

                  return (
                    <circle
                      key={node.id}
                      cx={x}
                      cy={y}
                      r="6"
                      fill={
                        node.type === "input"
                          ? "#ff5478"
                          : "#579cff"
                      }
                    />
                  );
                })}
            </svg>

            <div
              style={{
                display: "flex",
                gap: "25px",
                fontSize: "12px",
                color: "#71809d",
              }}
            >
              <span>
                🔴 Input address
              </span>

              <span>
                🔵 Output address
              </span>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      style={{
        background: "#0e1728",
        border: "1px solid #19263b",
        borderRadius: "12px",
        padding: "18px 30px",
        minWidth: "150px",
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
          fontSize: "26px",
          marginTop: "6px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}