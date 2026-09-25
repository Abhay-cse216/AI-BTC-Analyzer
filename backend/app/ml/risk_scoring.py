from typing import Any


def calculate_risk_points(
    tx: dict[str, Any],
) -> int:
    """
    Calculate a transparent investigation score
    from multiple transaction behavior indicators.

    This is not a fraud probability.
    """

    anomaly_score = float(
        tx.get("anomaly_score", 0.0)
    )

    input_count = int(
        tx.get("input_count") or 0
    )

    output_count = int(
        tx.get("output_count") or 0
    )

    fee_rate = float(
        tx.get("fee_rate_sat_vbyte") or 0.0
    )

    input_output_ratio = float(
        tx.get("input_output_ratio") or 0.0
    )

    points = 0

    # AI anomaly signal
    if anomaly_score >= 75:
        points += 5
    elif anomaly_score >= 50:
        points += 3
    elif anomaly_score >= 30:
        points += 1

    # Input structure
    if input_count >= 10:
        points += 3
    elif input_count >= 5:
        points += 1

    # Output structure
    if output_count >= 20:
        points += 3
    elif output_count >= 10:
        points += 1

    # Input/output relationship
    if input_output_ratio >= 5:
        points += 3
    elif input_output_ratio >= 3:
        points += 1

    # Fee behavior
    if fee_rate >= 200:
        points += 2
    elif fee_rate >= 100:
        points += 1

    return points


def calculate_risk_level(
    tx: dict[str, Any],
) -> str:
    """
    Convert behavioral risk points into
    an investigation priority.
    """

    risk_points = calculate_risk_points(tx)

    if risk_points >= 7:
        return "HIGH"

    if risk_points >= 3:
        return "MEDIUM"

    return "LOW"


def generate_risk_reasons(
    tx: dict[str, Any],
) -> list[str]:
    """
    Generate explainable reasons for the
    calculated investigation priority.
    """

    reasons: list[str] = []

    anomaly_score = float(
        tx.get("anomaly_score", 0.0)
    )

    input_count = int(
        tx.get("input_count") or 0
    )

    output_count = int(
        tx.get("output_count") or 0
    )

    fee_rate = float(
        tx.get("fee_rate_sat_vbyte") or 0.0
    )

    input_output_ratio = float(
        tx.get("input_output_ratio") or 0.0
    )

    # AI anomaly indicator
    if anomaly_score >= 75:
        reasons.append(
            "Strongly unusual transaction pattern"
        )
    elif anomaly_score >= 50:
        reasons.append(
            "Unusual transaction pattern"
        )
    elif anomaly_score >= 30:
        reasons.append(
            "Moderately unusual transaction pattern"
        )

    # Input structure
    if input_count >= 10:
        reasons.append(
            "Large number of transaction inputs"
        )
    elif input_count >= 5:
        reasons.append(
            "Elevated number of transaction inputs"
        )

    # Output structure
    if output_count >= 20:
        reasons.append(
            "Large number of transaction outputs"
        )
    elif output_count >= 10:
        reasons.append(
            "Elevated number of transaction outputs"
        )

    # Input/output relationship
    if input_output_ratio >= 5:
        reasons.append(
            "High input-to-output ratio"
        )
    elif input_output_ratio >= 3:
        reasons.append(
            "Elevated input-to-output ratio"
        )

    # Fee behavior
    if fee_rate >= 200:
        reasons.append(
            "Very high transaction fee rate"
        )
    elif fee_rate >= 100:
        reasons.append(
            "High transaction fee rate"
        )

    if not reasons:
        reasons.append(
            "No significant behavioral indicators detected"
        )

    return reasons


def add_risk_scores(
    transactions: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Add investigation priority and explainable
    behavioral indicators.
    """

    results = []

    for tx in transactions:
        risk_points = calculate_risk_points(tx)
        risk_level = calculate_risk_level(tx)

        risk_reasons = generate_risk_reasons(tx)

        results.append(
           {
    **tx,
    "risk_points": risk_points,
    "risk_level": risk_level,
    "risk_reasons": risk_reasons,
}
        )

    return results