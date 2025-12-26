from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include


def root(request):
    return JsonResponse(
        {
            "message": "Consom_Prev API",
            "available": {
                "predict": "/api/predict/",
                "metrics": "/api/metrics/",
                "predict_dates": "/api/predict-dates/",
                "history": "/api/prediction-history/",
                "admin": "/admin/",
            },
        }
    )

urlpatterns = [
    path("", root, name="root"),
    path("admin/", admin.site.urls),
    path("api/", include("prediction.urls")),
]

