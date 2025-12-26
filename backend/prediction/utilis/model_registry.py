import json
import pickle
from pathlib import Path

import pandas as pd
from django.conf import settings

ARTIFACT_DIR = getattr(settings, "ML_ARTIFACT_DIR", Path(__file__).resolve().parents[3] / "ml" / "artifacts")
MODEL_PATH = ARTIFACT_DIR / "estimator_model.pkl"
METRICS_PATH = ARTIFACT_DIR / "metrics.json"
PREDICT_DATES_PATH = ARTIFACT_DIR / "dates_predict.json"
PREDICTIONS_CSV_PATH = ARTIFACT_DIR / "predictions.csv"

model = None
metrics = None
predict_dates = None
predictions_df = None


def get_model():
    global model
    if model is None:
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
    return model


def get_metrics():
    global metrics
    if metrics is None:
        with open(METRICS_PATH, "r", encoding="utf-8") as f:
            metrics = json.load(f)
    return metrics


def get_predict_dates():
    global predict_dates
    if predict_dates is None:
        with open(PREDICT_DATES_PATH, "r", encoding="utf-8") as f:
            raw_dates = json.load(f)
        predict_dates = [str(d).split(" ")[0] for d in raw_dates]
    return predict_dates


def get_predictions_df() -> pd.DataFrame | None:
    """Optional: returns predictions.csv if present, else None."""
    global predictions_df
    if predictions_df is None:
        if not PREDICTIONS_CSV_PATH.exists():
            return None
        predictions_df = pd.read_csv(PREDICTIONS_CSV_PATH)
    return predictions_df
