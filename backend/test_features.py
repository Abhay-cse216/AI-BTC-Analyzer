from app.ml.feature_engineering import extract_transaction_features


sample_transaction = {
    "txid": "test",
    "vin": [
        {
            "prevout": {
                "value": 2125640
            }
        }
    ],
    "vout": [
        {"value": 2097440},
        {"value": 0}
    ],
    "size": 222,
    "weight": 561,
}


features = extract_transaction_features(
    sample_transaction
)

print("\nExtracted features:\n")

for key, value in features.items():
    print(f"{key}: {value}")