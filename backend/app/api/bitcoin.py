from datetime import datetime, timezone
from urllib.request import Request, urlopen
import json

from fastapi import APIRouter, HTTPException

from app.config import get_settings
from app.ml.feature_engineering import extract_features_from_transactions
from app.ml.anomaly_detection import detect_anomalies
from app.ml.risk_scoring import add_risk_scores


router = APIRouter(
    prefix="/api/bitcoin",
    tags=["bitcoin"],
)

settings = get_settings()


def mempool_get(path: str):
    """Make a real request to the Mempool.space REST API."""
    url = f"{settings.MEMPOOL_API_BASE_URL}{path}"

    request = Request(
        url,
        headers={
            "User-Agent": "AI-BTC-Analyzer/1.0",
            "Accept": "application/json",
        },
    )

    with urlopen(
        request,
        timeout=settings.MEMPOOL_REQUEST_TIMEOUT_SECONDS,
    ) as response:
        return response.read().decode()


@router.get("/latest-block")
async def latest_block():
    """Fetch the latest Bitcoin block from Mempool.space."""

    try:
        height = int(
            mempool_get("/blocks/tip/height").strip()
        )

        block_hash = mempool_get(
            "/blocks/tip/hash"
        ).strip()

        block = json.loads(
            mempool_get(f"/block/{block_hash}")
        )

        return {
            "source": "mempool.space",
            "height": height,
            "hash": block_hash,
            "timestamp": block.get("timestamp"),
            "size": block.get("size"),
            "weight": block.get("weight"),
            "transaction_count": block.get("tx_count"),
            "total_fees": block.get("fee"),
            "checked_at": datetime.now(
                timezone.utc
            ).isoformat(),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to retrieve Bitcoin block data: "
                f"{exc}"
            ),
        )


@router.get("/latest-transactions")
async def latest_transactions():
    """Fetch real Bitcoin transactions from the latest block."""

    try:
        block_hash = mempool_get(
            "/blocks/tip/hash"
        ).strip()

        transactions = json.loads(
            mempool_get(
                f"/block/{block_hash}/txs/0"
            )
        )

        results = []

        for tx in transactions:
            inputs = tx.get("vin", [])
            outputs = tx.get("vout", [])

            total_input_value = sum(
                item.get("prevout", {}).get(
                    "value", 0
                )
                for item in inputs
                if item.get("prevout")
            )

            total_output_value = sum(
                item.get("value", 0)
                for item in outputs
            )

            fee = total_input_value - total_output_value

            results.append(
                {
                    "txid": tx.get("txid"),
                    "version": tx.get("version"),
                    "locktime": tx.get("locktime"),
                    "input_count": len(inputs),
                    "output_count": len(outputs),
                    "total_input_value_sats": (
                        total_input_value
                    ),
                    "total_output_value_sats": (
                        total_output_value
                    ),
                    "fee_sats": (
                        fee
                        if fee >= 0
                        else None
                    ),
                    "size": tx.get("size"),
                    "weight": tx.get("weight"),
                    "fee_rate_sat_vbyte": (
                        fee / tx["size"]
                        if fee >= 0
                        and tx.get("size")
                        else None
                    ),
                }
            )

        return {
            "source": "mempool.space",
            "block_hash": block_hash,
            "transaction_count": len(results),
            "transactions": results,
            "checked_at": datetime.now(
                timezone.utc
            ).isoformat(),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to retrieve Bitcoin "
                f"transactions: {exc}"
            ),
        )


@router.get("/transaction-features")
async def transaction_features():
    """
    Fetch real Bitcoin transactions and convert
    them into ML-ready features.
    """

    try:
        block_hash = mempool_get(
            "/blocks/tip/hash"
        ).strip()

        transactions = json.loads(
            mempool_get(
                f"/block/{block_hash}/txs/0"
            )
        )

        features = extract_features_from_transactions(
            transactions
        )

        return {
            "source": "mempool.space",
            "block_hash": block_hash,
            "transaction_count": len(features),
            "features": features,
            "checked_at": datetime.now(
                timezone.utc
            ).isoformat(),
        }

    except TimeoutError as exc:
        raise HTTPException(
            status_code=504,
            detail=f"Mempool request timed out: {exc}",
        )

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to generate transaction "
                f"features: {exc}"
            ),
        )
@router.get("/anomalies")
async def detect_transaction_anomalies():
    """
    Fetch real Bitcoin transactions and detect unusual
    transaction patterns using Isolation Forest.
    """

    try:
        block_hash = mempool_get(
            "/blocks/tip/hash"
        ).strip()

        transactions = json.loads(
            mempool_get(
                f"/block/{block_hash}/txs/0"
            )
        )

        features = extract_features_from_transactions(
            transactions
        )

        results = detect_anomalies(features)
        results = add_risk_scores(results)

        anomaly_count = sum(
            1
            for tx in results
            if tx["is_anomaly"]
        )

        return {
            "source": "mempool.space",
            "block_hash": block_hash,
            "transaction_count": len(results),
            "anomaly_count": anomaly_count,
            "transactions": results,
            "checked_at": datetime.now(
                timezone.utc
            ).isoformat(),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to detect transaction anomalies: "
                f"{exc}"
            ),
        )

    
@router.get("/network")
async def get_transaction_network():
    """
    Build a real transaction network from the latest Bitcoin block.

    Nodes = Bitcoin addresses
    Edges = transaction input -> output relationships
    """

    try:
        block_hash = mempool_get(
            "/blocks/tip/hash"
        ).strip()

        transactions = json.loads(
            mempool_get(
                f"/block/{block_hash}/txs/0"
            )
        )

        nodes = {}
        edges = []

        for tx in transactions:
            txid = tx.get("txid")

            input_addresses = []
            output_addresses = []

            # Get addresses from transaction inputs
            for vin in tx.get("vin", []):
                prevout = vin.get("prevout") or {}
                address = prevout.get(
                    "scriptpubkey_address"
                )

                if address:
                    input_addresses.append(address)

            # Get addresses from transaction outputs
            for vout in tx.get("vout", []):
                address = vout.get(
                    "scriptpubkey_address"
                )

                if address:
                    output_addresses.append(address)

            # Register input nodes
            for address in input_addresses:
                nodes[address] = {
                    "id": address,
                    "type": "input",
                }

            # Register output nodes
            for address in output_addresses:
                nodes[address] = {
                    "id": address,
                    "type": "output",
                }

            # Create input -> output relationships
            for source in input_addresses:
                for target in output_addresses:
                    if source != target:
                        edges.append(
                            {
                                "source": source,
                                "target": target,
                                "txid": txid,
                            }
                        )

        return {
            "source": "mempool.space",
            "block_hash": block_hash,
            "node_count": len(nodes),
            "edge_count": len(edges),
            "nodes": list(nodes.values()),
            "edges": edges,
            "checked_at": datetime.now(
                timezone.utc
            ).isoformat(),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to build transaction network: "
                f"{exc}"
            ),
        )

@router.get("/mempool-transactions")
async def mempool_transactions():
    """
    Fetch real unconfirmed Bitcoin transactions
    currently visible in the Mempool.space mempool.
    """

    try:
        transactions = json.loads(
            mempool_get("/mempool/recent")
        )

        results = []

        for tx in transactions:
            results.append(
                {
                    "txid": tx.get("txid"),
                    "fee": tx.get("fee"),
                    "vsize": tx.get("vsize"),
                    "value": tx.get("value"),
                    "fee_rate": (
                        tx.get("fee") / tx.get("vsize")
                        if tx.get("fee") is not None
                        and tx.get("vsize")
                        else None
                    ),
                    "time": tx.get("time"),
                }
            )

        return {
            "source": "mempool.space",
            "transaction_count": len(results),
            "transactions": results,
            "checked_at": datetime.now(
                timezone.utc
            ).isoformat(),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to retrieve live mempool "
                f"transactions: {exc}"
            ),
        )
@router.get("/mempool-anomalies")
async def mempool_anomalies():
    """
    Fetch live unconfirmed Bitcoin transactions and
    analyze their full transaction structure.
    """

    try:
        mempool_transactions = json.loads(
            mempool_get("/mempool/recent")
        )

        results = []

        for item in mempool_transactions:
            txid = item.get("txid")

            if not txid:
                continue

            try:
                tx = json.loads(
                    mempool_get(
                        f"/tx/{txid}"
                    )
                )

                results.append(tx)

            except Exception:
                continue

        features = extract_features_from_transactions(
            results
        )

        results = detect_anomalies(features)

        results = add_risk_scores(results)

        anomaly_count = sum(
            1
            for tx in results
            if tx["is_anomaly"]
        )

        return {
            "source": "mempool.space",
            "data_type": "live_mempool",
            "transaction_count": len(results),
            "anomaly_count": anomaly_count,
            "transactions": results,
            "checked_at": datetime.now(
                timezone.utc
            ).isoformat(),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to analyze live mempool "
                f"transactions: {exc}"
            ),
        )