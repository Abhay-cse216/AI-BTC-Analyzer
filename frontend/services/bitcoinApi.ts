export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface BitcoinTransaction {
  txid: string;
  is_coinbase: boolean;
  input_count: number;
  output_count: number;
  total_input_sats: number;
  total_output_sats: number;
  fee_sats: number | null;
  fee_rate_sat_vbyte: number | null;
  size: number | null;
  weight: number | null;
  input_output_ratio: number | null;
  average_output_value_sats: number | null;
  is_anomaly: boolean;
  anomaly_score: number;
  risk_level: RiskLevel;
risk_points: number;
risk_reasons: string[];
}

export interface AnomaliesResponse {
  source: string;
  block_hash: string;
  transaction_count: number;
  anomaly_count: number;
  transactions: BitcoinTransaction[];
  checked_at: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

export async function getAnomalies(): Promise<AnomaliesResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/bitcoin/anomalies`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    );
  }

  return response.json();
}
export interface NetworkNode {
  id: string;
  type: "input" | "output";
}

export interface NetworkEdge {
  source: string;
  target: string;
  txid: string;
}

export interface NetworkResponse {
  source: string;
  block_hash: string;
  node_count: number;
  edge_count: number;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  checked_at: string;
}

export async function getTransactionNetwork(): Promise<NetworkResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/bitcoin/network`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Network API request failed: ${response.status}`
    );
  }

  return response.json();
}
export interface NetworkNode {
  id: string;
  type: "input" | "output";
}

export interface NetworkEdge {
  source: string;
  target: string;
  txid: string;
}

export interface NetworkResponse {
  source: string;
  block_hash: string;
  node_count: number;
  edge_count: number;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  checked_at: string;
}

export async function getBackendHealth() {
  const response = await fetch(
    `${API_BASE_URL}/api/health`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Health check failed: ${response.status}`
    );
  }

  return response.json();
}
export interface MempoolTransaction extends BitcoinTransaction {}

export interface MempoolAnomaliesResponse {
  source: string;
  data_type: string;
  transaction_count: number;
  anomaly_count: number;
  transactions: MempoolTransaction[];
  checked_at: string;
}

export async function getMempoolAnomalies(): Promise<MempoolAnomaliesResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/bitcoin/mempool-anomalies`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Mempool API request failed: ${response.status}`
    );
  }

  return response.json();
}