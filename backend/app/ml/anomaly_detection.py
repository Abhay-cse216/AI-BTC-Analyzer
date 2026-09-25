from typing import Any

import numpy as np
from sklearn.ensemble import IsolationForest


FEATURE_COLUMNS = [
    "input_count",
    "output_count",
    "total_input_sats",
    "total_output_sats",
    "fee_sats",
    "fee_rate_sat_vbyte",
    "size",
    "weight",
    "input_output_ratio",
    "average_output_value_sats",
]


def detect_anomalies(
    features: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Detect unusual Bitcoin transactions using Isolation Forest.

    The resulting score is an anomaly indicator, not a probability
    of criminal or fraudulent activity.
    """

    # Coinbase transactions have no normal input value.
    usable = [
        tx for tx in features
        if not tx.get("is_coinbase", False)
    ]

    if len(usable) < 5:
        return [
            {
                **tx,
                "is_anomaly": False,
                "anomaly_score": 0.0,
            }
            for tx in features
        ]

    matrix = []

    for tx in usable:
        row = []

        for column in FEATURE_COLUMNS:
            value = tx.get(column)

            if value is None:
                value = 0.0

            row.append(float(value))

        matrix.append(row)

    X = np.array(matrix, dtype=float)

    model = IsolationForest(
        n_estimators=200,
        contamination="auto",
        random_state=42,
    )

    model.fit(X)

    predictions = model.predict(X)
    raw_scores = -model.decision_function(X)

    minimum = float(raw_scores.min())
    maximum = float(raw_scores.max())

    if maximum > minimum:
        normalized_scores = (
            (raw_scores - minimum)
            / (maximum - minimum)
            * 100
        )
    else:
        normalized_scores = np.zeros(len(raw_scores))

    results = []

    score_index = 0

    for tx in features:

        if tx.get("is_coinbase", False):
            results.append(
                {
                    **tx,
                    "is_anomaly": False,
                    "anomaly_score": 0.0,
                }
            )
            continue

        results.append(
            {
                **tx,
                "is_anomaly": bool(predictions[score_index] == -1),
                "anomaly_score": round(
                    float(normalized_scores[score_index]),
                    2,
                ),
            }
        )

        score_index += 1

    return results