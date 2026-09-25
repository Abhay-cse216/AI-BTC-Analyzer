from typing import Any


def extract_transaction_features(tx: dict[str, Any]) -> dict[str, Any]:
    """
    Convert a raw Mempool.space transaction into ML-ready features.

    No synthetic values are created.
    """

    inputs = tx.get("vin", [])
    outputs = tx.get("vout", [])

    # Coinbase transactions have no normal previous output.
    is_coinbase = any(
        item.get("is_coinbase", False)
        for item in inputs
    )

    total_input_sats = sum(
        item.get("prevout", {}).get("value", 0)
        for item in inputs
        if item.get("prevout")
    )

    total_output_sats = sum(
        item.get("value", 0)
        for item in outputs
    )

    fee_sats = None

    if not is_coinbase and total_input_sats >= total_output_sats:
        fee_sats = total_input_sats - total_output_sats

    size = tx.get("size")
    weight = tx.get("weight")

    fee_rate = None

    if fee_sats is not None and size and size > 0:
        fee_rate = fee_sats / size

    input_output_ratio = None

    if len(outputs) > 0:
        input_output_ratio = len(inputs) / len(outputs)

    average_output_value = None

    if len(outputs) > 0:
        average_output_value = (
            total_output_sats / len(outputs)
        )

    return {
        "txid": tx.get("txid"),
        "is_coinbase": is_coinbase,

        "input_count": len(inputs),
        "output_count": len(outputs),

        "total_input_sats": total_input_sats,
        "total_output_sats": total_output_sats,

        "fee_sats": fee_sats,
        "fee_rate_sat_vbyte": fee_rate,

        "size": size,
        "weight": weight,

        "input_output_ratio": input_output_ratio,
        "average_output_value_sats": average_output_value,
    }


def extract_features_from_transactions(
    transactions: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """
    Extract features from multiple Bitcoin transactions.
    """

    return [
        extract_transaction_features(tx)
        for tx in transactions
    ]