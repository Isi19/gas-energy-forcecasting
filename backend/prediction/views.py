import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import PredictionLog
from .serializers import PredictInputSerializer, PredictionHistorySerializer
from .utilis.model_registry import get_model, get_metrics, get_predict_dates
from .utilis.feature_engineering import build_features, FEATURE_ORDER

class PredictView(APIView):
    """
    POST
    - Valide date (liste prédéfinie)
    - Convertit température -> dju si besoin
    - Prédit
    - Enregistre en base (historique)
    """
    def post(self, request):
        serializer = PredictInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        feats = build_features(
            jour=data["jour"],
            input_type=data["input_type"],
            input_value=data["input_value"],
        )

        X = pd.DataFrame([[feats[c] for c in FEATURE_ORDER]], columns=FEATURE_ORDER)
        model = get_model()
        y_pred = round(float(model.predict(X)[0]), 2)

        metrics = get_metrics()
        model_name = metrics[0]["model"]

        # Save history
        log = PredictionLog.objects.create(
            jour=data["jour"],
            input_type=data["input_type"],
            input_value=float(data["input_value"]),

            dju_used=float(feats["dju"]),
            mois_sin=float(feats["mois_sin"]),
            mois_cos=float(feats["mois_cos"]),

            prediction_consommation_kwh_pcs=y_pred,
            model_name=model_name,
        )

        return Response(
            {
                "prediction_consommation_kwh_pcs": y_pred,
                "model_name": model_name,
                "features_used": feats,
                "log_id": log.id,
            },
            status=status.HTTP_200_OK,
        )



# class PredictView(APIView):
#     def post(self, request):
#         serializer = PredictInputSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         data = serializer.validated_data
#         feats = build_features(data["jour"], data["temperature"])

#         X = pd.DataFrame([[feats[f] for f in FEATURE_ORDER]], columns=FEATURE_ORDER)

#         model = get_model()
#         y_pred = float(model.predict(X)[0])

#         return Response(
#             {
#                 "prediction_consommation_kwh_pcs": y_pred,
#                 "model_name": "best_model_from_artifacts",
#                 "features_used": {k: feats[k] for k in FEATURE_ORDER},
#             },
#             status=status.HTTP_200_OK,
#         )

class MetricsView(APIView):
    def get(self, request):
        return Response(get_metrics(), status=status.HTTP_200_OK)

class PredictDatesView(APIView):
    def get(self, request):
        return Response({"dates": get_predict_dates()}, status=status.HTTP_200_OK)
    
class PredictionHistoryView(APIView):
    """
    Method GET
    Renvoie l'historique des prédictions demandées par l'utilisateur (pour le graphique).
    """
    def get(self, request):
        limit = int(request.query_params.get("limit", 200))
        limit = max(1, min(limit, 2000))

        qs = PredictionLog.objects.all().order_by("created_at")[:limit]
        data = PredictionHistorySerializer(qs, many=True).data
        return Response({"items": data}, status=status.HTTP_200_OK)

