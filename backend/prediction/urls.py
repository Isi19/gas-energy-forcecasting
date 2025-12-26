from django.urls import path
from .views import (
    PredictView,
    MetricsView,
    PredictDatesView,
    PredictionHistoryView,
)

urlpatterns = [
    path("predict/", PredictView.as_view(), name="predict"),
    path("metrics/", MetricsView.as_view(), name="metrics"),
    path("predict-dates/", PredictDatesView.as_view(), name="predict_dates"),
    path("prediction-history/", PredictionHistoryView.as_view(), name="prediction_history"),
]

