"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";

import {
  getAnomalies,
  getMempoolAnomalies,
  getTransactionNetwork,
  getBackendHealth,
  type BitcoinTransaction,
  type NetworkResponse,
} from "../services/bitcoinApi";

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [backendOnline, setBackendOnline] = useState(false);

  const [transactions, setTransactions] = useState<
    BitcoinTransaction[]
  >([]);
  const [
  mempoolAnomalyCount,
  setMempoolAnomalyCount,
] = useState(0);

const [
  mempoolTransactionCount,
  setMempoolTransactionCount,
] = useState(0);
  const [network, setNetwork] =
    useState<NetworkResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  async function loadData() {
    try {
      setLoading(true);

const anomalyData = await getAnomalies();

const mempoolData = await getMempoolAnomalies();

const networkData = await getTransactionNetwork();

    setTransactions(anomalyData.transactions);

setMempoolAnomalyCount(
  mempoolData.anomaly_count
);
setMempoolTransactionCount(
  mempoolData.transaction_count
);
setNetwork(networkData);
      console.log(
  "LIVE MEMPOOL:",
  mempoolData.transactions
);

console.log(
  "LIVE MEMPOOL ANOMALIES:",
  mempoolData.anomaly_count
);

      await getBackendHealth();

      setBackendOnline(true);
      setError("");
    } catch (err) {
      console.error(err);

      setBackendOnline(false);

      setError(
        "Unable to connect to Bitcoin backend."
      );
    } finally {
      setLoading(false);
    }
  }

  loadData();

  const interval = setInterval(
    loadData,
    30000
  );


     

    // Stop timer when page is closed
    return () => {
      clearInterval(interval);
    };
  }, []);

  const totalTransactions = transactions.length;

  const anomalyCount = transactions.filter(
    (tx) => tx.is_anomaly
  ).length;

  const highRiskCount = transactions.filter(
    (tx) => tx.risk_level === "HIGH"
  ).length;

  const mediumRiskCount = transactions.filter(
    (tx) => tx.risk_level === "MEDIUM"
  ).length;

  const lowRiskCount = transactions.filter(
    (tx) => tx.risk_level === "LOW"
  ).length;

  return (
    <main className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="bitcoin-logo">₿</div>

          <div>
            <strong>AI-BTC</strong>{" "}
            <span>Analyzer</span>
          </div>
        </div>

        <nav>
          {[
            ["▦", "Dashboard"],
            ["⇄", "Transactions"],
            ["◉", "Risk Analysis"],
            ["⌘", "Network Graph"],
            ["♧", "Alerts"],
            ["▣", "Wallet Insights"],
            ["▤", "Reports"],
          ].map(([icon, name]) => (
            <button
              key={name}
              className={`nav-item ${
                active === name ? "active" : ""
              }`}
     onClick={() => {
  setActive(name);

  if (name === "Transactions") {
    window.location.href = "/transactions";
  }

  if (name === "Risk Analysis") {
    window.location.href = "/risk-analysis";
  }

  if (name === "Network Graph") {
    window.location.href = "/network-graph";
  }

  if (name === "Alerts") {
    window.location.href = "/alerts";
  }

  if (name === "Wallet Insights") {
    window.location.href = "/wallet-insights";
  }

  if (name === "Reports") {
    window.location.href = "/reports";
  }
}}
            >
              <span className="nav-icon">
                {icon}
              </span>

              {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">

            <span className="status-dot"></span>

            <div>
              <small>System Status</small>
              <strong>
                Monitoring Active
              </strong>
            </div>

          </div>
        </div>

      </aside>

      {/* MAIN AREA */}
      <section className="content">

        {/* TOP BAR */}
        <header className="topbar">

          <div className="search">
            <span>⌕</span>

            <input
              placeholder="Search transaction / wallet / hash..."
            />
          </div>

          <div className="top-actions">

           <div className="live">
  <span
    className="live-dot"
    style={{
      background: backendOnline
        ? "#3bdca4"
        : "#ff587c",
    }}
  ></span>

  {backendOnline
    ? "Live Data"
    : "Backend Offline"}
</div>

            <div className="ai-avatar">
              AI
            </div>

          </div>

        </header>

        {/* PAGE HEADER */}
        <div className="page-header">

          <div>
            <h1>Dashboard</h1>

            <p>
              Real-time overview of Bitcoin
              transaction activity and risk.
            </p>
            <div
  style={{
    marginTop: "8px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "rgba(59, 220, 164, 0.08)",
    border: "1px solid rgba(59, 220, 164, 0.25)",
    color: "#3bdca4",
    fontSize: "12px",
    fontWeight: 600,
  }}
>
  <span
    style={{
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background: "#3bdca4",
    }}
  ></span>

  Live Mempool Anomalies: {mempoolAnomalyCount}
</div>
          </div>

          <div className="data-badge">
            REAL DATA
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* KPI CARDS */}
        <div className="kpi-grid">

          <div className="kpi-card blue">

            <div className="kpi-icon">
              ⇄
            </div>

            <div>
              <span>
                Total Transactions
              </span>

              <h2>
                {loading
                  ? "..."
                  : totalTransactions}
              </h2>

              <small>
                Latest monitored block
              </small>
            </div>

          </div>

          <div className="kpi-card red">

            <div className="kpi-icon">
              ◉
            </div>

            <div>
              <span>
                Anomalies Detected
              </span>

              <h2>
                 {loading
                    ? "..."
    : mempoolAnomalyCount}
              </h2>

              <small>
                Requires investigation
              </small>
            </div>

          </div>

          <div className="kpi-card orange">

            <div className="kpi-icon">
              !
            </div>

            <div>
              <span>
                High Risk
              </span>

              <h2>
                {loading
                  ? "..."
                  : highRiskCount}
              </h2>

              <small>
                Risk score ≥ 75
              </small>
            </div>

          </div>

          <div className="kpi-card green">

            <div className="kpi-icon">
              ✓
            </div>

            <div>
              <span>
                Low Risk
              </span>

              <h2>
                {loading
                  ? "..."
                  : lowRiskCount}
              </h2>

              <small>
                Normal activity
              </small>
            </div>

          </div>

        </div>

        {/* CHART ROW */}
        <div className="chart-grid">

          {/* DONUT */}
          <div className="panel">

            <div className="panel-header">

              <div>
                <h3>
                  Transaction Risk Distribution
                </h3>

                <p>
                  Current monitored transactions
                </p>
              </div>

            </div>

            <div className="donut-area">

              <div
                className="donut"
                style={
                  {
                    "--high-angle":
                      `${
                        (highRiskCount /
                          Math.max(
                            1,
                            totalTransactions
                          )) *
                        360
                      }deg`,

                    "--medium-angle":
                      `${
                        ((highRiskCount +
                          mediumRiskCount) /
                          Math.max(
                            1,
                            totalTransactions
                          )) *
                        360
                      }deg`,
                  } as CSSProperties
                }
              >

                <div className="donut-center">
                  <strong>
                    {totalTransactions}
                  </strong>

                  <span>
                    Transactions
                  </span>
                </div>

              </div>

              <div className="legend">

                <div>
                  <i className="legend-red"></i>
                  <span>High Risk</span>
                  <strong>
                    {highRiskCount}
                  </strong>
                </div>

                <div>
                  <i className="legend-orange"></i>
                  <span>Medium Risk</span>
                  <strong>
                    {mediumRiskCount}
                  </strong>
                </div>

                <div>
                  <i className="legend-green"></i>
                  <span>Low Risk</span>
                  <strong>
                    {lowRiskCount}
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* ACTIVITY */}
          <div className="panel">

            <div className="panel-header">

              <div>
                <h3>
                  Transaction Activity
                </h3>

                <p>
                  Latest monitored transaction scores
                </p>
              </div>

            </div>

            <div className="activity-chart">

              <div className="y-labels">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              <svg
                viewBox="0 0 600 250"
                className="line-chart"
              >

                <line
                  x1="40"
                  y1="30"
                  x2="580"
                  y2="30"
                />

                <line
                  x1="40"
                  y1="80"
                  x2="580"
                  y2="80"
                />

                <line
                  x1="40"
                  y1="130"
                  x2="580"
                  y2="130"
                />

                <line
                  x1="40"
                  y1="180"
                  x2="580"
                  y2="180"
                />

                <line
                  x1="40"
                  y1="220"
                  x2="580"
                  y2="220"
                />

                {transactions
                  .slice(0, 10)
                  .map((tx, index) => {

                    const x =
                      55 +
                      index *
                        (500 / 9);

                    const score =
                      Math.min(
                        100,
                        Math.max(
                          0,
                          tx.anomaly_score
                        )
                      );

                    const y =
                      220 -
                      (score / 100) *
                        190;

                    return (
                      <circle
                        key={tx.txid}
                        cx={x}
                        cy={y}
                        r={
                          tx.is_anomaly
                            ? 6
                            : 4
                        }
                        className={
                          tx.is_anomaly
                            ? "real-anomaly-point"
                            : "real-normal-point"
                        }
                      />
                    );
                  })}

                {transactions.length > 1 && (
                  <polyline
                    points={transactions
                      .slice(0, 10)
                      .map(
                        (tx, index) => {

                          const x =
                            55 +
                            index *
                              (500 / 9);

                          const score =
                            Math.min(
                              100,
                              Math.max(
                                0,
                                tx.anomaly_score
                              )
                            );

                          const y =
                            220 -
                            (score / 100) *
                              190;

                          return `${x},${y}`;
                        }
                      )
                      .join(" ")}
                    className="real-score-line"
                  />
                )}

              </svg>

            </div>

            <div className="chart-legend">

              <span>
                <i className="blue-dot"></i>
                Normal
              </span>

              <span>
                <i className="red-dot"></i>
                Anomalous
              </span>

            </div>

          </div>

        </div>

        {/* BOTTOM ROW */}
        <div className="bottom-grid">

          {/* NETWORK */}
          <div className="panel network-panel">

            <div className="panel-header">

              <div>
                <h3>
                  Transaction Network
                </h3>

                <p>
                  Real Bitcoin transaction
                  relationships
                </p>
              </div>

            </div>

            <div className="network">

              <svg viewBox="0 0 600 300">

                {network && (
                  <>

                    <g className="network-lines">

                      {network.edges
                        .slice(0, 40)
                        .map(
                          (
                            edge,
                            index
                          ) => {

                            const sourceIndex =
                              network.nodes.findIndex(
                                (node) =>
                                  node.id ===
                                  edge.source
                              );

                            const targetIndex =
                              network.nodes.findIndex(
                                (node) =>
                                  node.id ===
                                  edge.target
                              );

                            if (
                              sourceIndex ===
                                -1 ||
                              targetIndex ===
                                -1
                            ) {
                              return null;
                            }

                            const sourceX =
                              40 +
                              (sourceIndex %
                                10) *
                                55;

                            const sourceY =
                              40 +
                              Math.floor(
                                sourceIndex /
                                  10
                              ) *
                                45;

                            const targetX =
                              40 +
                              (targetIndex %
                                10) *
                                55;

                            const targetY =
                              40 +
                              Math.floor(
                                targetIndex /
                                  10
                              ) *
                                45;

                            return (
                              <line
                                key={`${edge.txid}-${index}`}
                                x1={sourceX}
                                y1={sourceY}
                                x2={targetX}
                                y2={targetY}
                              />
                            );
                          }
                        )}

                    </g>

                    {network.nodes
                      .slice(0, 60)
                      .map(
                        (
                          node,
                          index
                        ) => {

                          const x =
                            40 +
                            (index % 10) *
                              55;

                          const y =
                            40 +
                            Math.floor(
                              index / 10
                            ) *
                              45;

                          return (
                            <circle
                              key={node.id}
                              cx={x}
                              cy={y}
                              r="6"
                              className={
                                node.type ===
                                "input"
                                  ? "node-red"
                                  : "node-blue"
                              }
                            />
                          );
                        }
                      )}

                  </>
                )}

              </svg>

            </div>

          </div>

          {/* ALERTS */}
          <div className="panel alerts-panel">

            <div className="panel-header">

              <div>
                <h3>
                  Recent Risk Alerts
                </h3>

                <p>
                  Transactions requiring attention
                </p>
              </div>

             <button
  className="view-all"
  onClick={() => {
    window.location.href = "/alerts";
  }}
>
  View All →
</button>

            </div>

            <div className="alerts-table">

              <div className="table-head">
                <span>TRANSACTION</span>
                <span>SCORE</span>
                <span>RISK</span>
              </div>

             {transactions
  .filter((tx) => tx.risk_level !== "LOW")
  .slice(0, 8)
  .map((tx) => (
    <div
      className="table-row"
      key={tx.txid}
      style={{
        display: "grid",
        gridTemplateColumns: "1.5fr 100px 100px",
        gap: "15px",
        alignItems: "start",
      }}
    >
      <div>
        <div className="hash">
          {tx.txid.slice(0, 8)}
          ...
          {tx.txid.slice(-6)}
        </div>

        <div
          style={{
            marginTop: "6px",
            fontSize: "11px",
            color: "#71809d",
            lineHeight: "1.5",
          }}
        >
          {tx.risk_reasons?.join(" • ")}
        </div>
      </div>

    <div className="score">
  <div>
    Anomaly: {tx.anomaly_score.toFixed(2)}
  </div>

  <div
    style={{
      marginTop: "4px",
      fontSize: "11px",
      color: "#71809d",
    }}
  >
    Risk points: {tx.risk_points}
  </div>
</div>

      <span
        className={`risk ${tx.risk_level.toLowerCase()}`}
      >
        {tx.risk_level}
      </span>
    </div>
  ))}

            </div>

          </div>

        </div>

        <footer>
          AI-BTC Analyzer • Bitcoin Transaction Intelligence
        </footer>

      </section>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .dashboard {
          min-height: 100vh;
          background: #060a14;
          color: #e8eefc;
          display: flex;
          font-family: Arial, Helvetica, sans-serif;
        }

        .sidebar {
          width: 235px;
          min-height: 100vh;
          background: #080e1b;
          border-right: 1px solid #182235;
          padding: 22px 14px;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 10px 30px;
          font-size: 15px;
        }

        .brand strong {
          color: #f2f5ff;
        }

        .brand span {
          color: #39b9ff;
        }

        .bitcoin-logo {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5bd32;
          color: #10131b;
          font-weight: bold;
          font-size: 20px;
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .nav-item {
          border: 0;
          background: transparent;
          color: #7f8ca7;
          padding: 12px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          text-align: left;
          font-size: 13px;
        }

        .nav-item:hover {
          background: #101a2d;
          color: #dce6fa;
        }

        .nav-item.active {
          color: white;
          background: #122c48;
          box-shadow: inset 2px 0 0 #31b7ff;
        }

        .nav-icon {
          width: 20px;
          text-align: center;
          font-size: 17px;
        }

        .sidebar-bottom {
          position: absolute;
          bottom: 25px;
          left: 18px;
          right: 18px;
        }

        .system-status {
          background: #0d1728;
          border: 1px solid #1c2a40;
          border-radius: 12px;
          padding: 12px;
          display: flex;
          gap: 9px;
          align-items: center;
        }

        .status-dot,
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #31df9b;
          box-shadow: 0 0 10px #31df9b;
        }

        .system-status small {
          display: block;
          color: #71809d;
          font-size: 10px;
        }

        .system-status strong {
          display: block;
          color: #dce6f8;
          font-size: 11px;
          margin-top: 3px;
        }

        .content {
          margin-left: 235px;
          width: calc(100% - 235px);
          padding: 0 25px 25px;
        }

        .topbar {
          height: 70px;
          border-bottom: 1px solid #131d2f;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .search {
          width: 440px;
          height: 38px;
          background: #0b1424;
          border: 1px solid #1a2940;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 12px;
          color: #66748e;
        }

        .search input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          width: 100%;
          font-size: 12px;
        }

        .search input::placeholder {
          color: #68758d;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .live {
          border: 1px solid #253249;
          background: #0c1525;
          padding: 8px 13px;
          border-radius: 18px;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #c7d2e7;
        }

        .ai-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            #5e8cff,
            #a855f7
          );
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
        }

        .page-header {
          padding: 25px 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        h1 {
          margin: 0;
          font-size: 24px;
        }

        .page-header p {
          margin: 7px 0 0;
          color: #77849c;
          font-size: 12px;
        }

        .data-badge {
          border: 1px solid #1b8066;
          color: #42e0ad;
          background: #08251e;
          border-radius: 7px;
          padding: 7px 11px;
          font-size: 10px;
          font-weight: bold;
        }

        .error-box {
          background: #351722;
          border: 1px solid #7d2941;
          color: #ff7d99;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 14px;
          font-size: 12px;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .kpi-card {
          min-height: 110px;
          border: 1px solid #19263b;
          background: #10192b;
          border-radius: 15px;
          padding: 18px;
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .kpi-icon {
          width: 43px;
          height: 43px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          font-weight: bold;
        }

        .blue .kpi-icon {
          background: #102b55;
          color: #50a5ff;
        }

        .red .kpi-icon {
          background: #3b1629;
          color: #ff557d;
        }

        .orange .kpi-icon {
          background: #3b2914;
          color: #ffb23f;
        }

        .green .kpi-icon {
          background: #0c362b;
          color: #39dca4;
        }

        .kpi-card span {
          color: #8491a9;
          font-size: 11px;
        }

        .kpi-card h2 {
          margin: 6px 0 3px;
          font-size: 25px;
        }

        .kpi-card small {
          color: #5f6d85;
          font-size: 9px;
        }

        .chart-grid,
        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 14px;
        }

        .panel {
          background: #0e1728;
          border: 1px solid #19263b;
          border-radius: 15px;
          min-height: 290px;
          overflow: hidden;
        }

        .panel-header {
          padding: 18px 19px 10px;
        }

        .panel-header h3 {
          margin: 0;
          font-size: 13px;
        }

        .panel-header p {
          margin: 6px 0 0;
          font-size: 10px;
          color: #697891;
        }

        .donut-area {
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 45px;
        }

        .donut {
          width: 145px;
          height: 145px;
          border-radius: 50%;
          position: relative;
          background: conic-gradient(
            #ff5379 0deg var(--high-angle),
            #ffb83f var(--high-angle) var(--medium-angle),
            #34dfa6 var(--medium-angle) 360deg
          );
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .donut::before {
          content: "";
          width: 94px;
          height: 94px;
          position: absolute;
          border-radius: 50%;
          background: #0d1728;
        }

        .donut-center {
          position: relative;
          text-align: center;
        }

        .donut-center strong {
          display: block;
          font-size: 22px;
        }

        .donut-center span {
          color: #68758c;
          font-size: 9px;
        }

        .legend {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .legend div {
          display: grid;
          grid-template-columns: 9px 80px 25px;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          color: #8490a5;
        }

        .legend i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-red {
          background: #ff5379;
        }

        .legend-orange {
          background: #ffb83f;
        }

        .legend-green {
          background: #34dfa6;
        }

        .activity-chart {
          height: 190px;
          position: relative;
          margin: 5px 18px 0;
          border-bottom: 1px solid #1b2739;
        }

        .y-labels {
          position: absolute;
          left: 0;
          top: 0;
          height: 165px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #4f5c73;
          font-size: 8px;
        }

        .line-chart {
          position: absolute;
          left: 30px;
          top: 0;
          width: calc(100% - 30px);
          height: 175px;
        }

        .line-chart line {
          stroke: #17243a;
          stroke-width: 1;
        }

        .real-score-line {
          fill: none;
          stroke: #4f9dff;
          stroke-width: 3;
        }

        .real-normal-point {
          fill: #4f9dff;
          stroke: #b8d7ff;
          stroke-width: 2;
        }

        .real-anomaly-point {
          fill: #ff547a;
          stroke: #ffd0da;
          stroke-width: 2;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          font-size: 9px;
          color: #74819a;
          padding: 7px;
        }

        .chart-legend i {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          margin-right: 5px;
        }

        .blue-dot {
          background: #4f9dff;
        }

        .red-dot {
          background: #ff547a;
        }

        .network-panel,
        .alerts-panel {
          min-height: 330px;
        }

        .network {
          height: 255px;
          padding: 5px 20px 20px;
        }

        .network svg {
          width: 100%;
          height: 100%;
        }

        .network-lines line {
          stroke: #25334a;
          stroke-width: 1.2;
        }

        .node-blue {
          fill: #579cff;
        }

        .node-red {
          fill: #ff5478;
        }

        .view-all {
          border: none;
          background: transparent;
          color: #31c4ff;
          font-size: 10px;
          cursor: pointer;
        }

        .alerts-table {
          padding: 5px 18px 15px;
        }

        .table-head,
        .table-row {
          display: grid;
          grid-template-columns: 1fr 70px 80px;
          align-items: center;
          gap: 10px;
        }

        .table-head {
          padding: 12px 8px;
          color: #526078;
          font-size: 8px;
          border-bottom: 1px solid #1b2739;
        }

        .table-row {
          padding: 13px 8px;
          border-bottom: 1px solid #131e31;
          font-size: 10px;
        }

        .hash {
          color: #42bfff;
          font-family: monospace;
        }

        .score {
          color: #e3eaf8;
        }

        .risk {
          width: fit-content;
          padding: 4px 7px;
          border-radius: 5px;
          font-size: 8px;
          font-weight: bold;
        }

        .risk.high {
          background: #3a1525;
          color: #ff587c;
        }

        .risk.medium {
          background: #3a2913;
          color: #ffb83e;
        }

        .risk.low {
          background: #0b3328;
          color: #3bdca4;
        }

        footer {
          text-align: center;
          color: #3e4c64;
          font-size: 9px;
          padding: 20px;
        }

        @media (max-width: 1100px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .chart-grid,
          .bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .sidebar {
            width: 70px;
          }

          .content {
            margin-left: 70px;
            width: calc(100% - 70px);
          }

          .search {
            width: 220px;
          }

          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }

      `}</style>

    </main>
  );
}