import math
from datetime import date

import pandas as pd

T_REF = 18.0  # convention DJU chauffage
FEATURE_ORDER = ["dju", "mois_sin", "mois_cos"]


def to_dju(input_type: str, input_value: float) -> float:
    if input_type == "dju":
        return float(input_value)
    temp = float(input_value)
    return max(0.0, T_REF - temp)


def build_features(jour: date, input_type: str, input_value: float) -> dict:
    nb_jours = pd.Period(jour, freq="M").days_in_month
    dju = to_dju(input_type, input_value) * nb_jours if input_type == "température" else to_dju("dju", input_value) # daily to monthly

    mois = jour.month
    mois_sin = math.sin(2 * math.pi * (mois - 1) / 12.0)
    mois_cos = math.cos(2 * math.pi * (mois - 1) / 12.0)

    

    return {
        "dju": dju, 
        "mois_sin": mois_sin,
        "mois_cos": mois_cos,
    }
