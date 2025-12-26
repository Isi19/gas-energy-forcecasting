from rest_framework import serializers

from .models import PredictionLog
from .utilis.model_registry import get_predict_dates


class PredictInputSerializer(serializers.Serializer):
    jour = serializers.DateField()
    input_type = serializers.ChoiceField(choices=["température", "dju"])
    input_value = serializers.FloatField()

    def validate_jour(self, value):
        allowed = {str(d).split(" ")[0] for d in get_predict_dates()}  # normalize to YYYY-MM-DD
        if value.isoformat() not in allowed:
            raise serializers.ValidationError(
                "Date non autorisee. Utilise une date fournie par GET /api/predict-dates/."
            )
        return value

    def validate(self, attrs):
        # quelques garde-fous pour eviter les inputs aberrants
        if attrs["input_type"] == "température":
            if attrs["input_value"] < -40 or attrs["input_value"] > 60:
                raise serializers.ValidationError("Température hors plage plausible.")
        if attrs["input_type"] == "dju":
            if attrs["input_value"] < 0:
                raise serializers.ValidationError("DJU doit etre >= 0.")
        return attrs


class PredictOutputSerializer(serializers.Serializer):
    prediction_consommation_kwh_pcs = serializers.FloatField()
    model_name = serializers.CharField()
    features_used = serializers.DictField()


class PredictionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionLog
        fields = [
            "id",
            "created_at",
            "jour",
            "input_type",
            "input_value",
            "prediction_consommation_kwh_pcs",
            "model_name",
        ]
