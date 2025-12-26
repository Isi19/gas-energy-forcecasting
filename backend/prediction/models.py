from django.db import models


class PredictionLog(models.Model):
    # Date choisie par l'utilisateur (parmi les dates autorisées)
    jour = models.DateField()

    # Entrée utilisateur : température ou DJU
    input_type = models.CharField(max_length=20, choices=[("température", "température"), ("dju", "dju")])
    input_value = models.FloatField()


    # Features effectivement envoyées au modèle (traçabilité)
    dju_used = models.FloatField()
    mois_sin = models.FloatField()
    mois_cos = models.FloatField()

    # Résultat modèle
    prediction_consommation_kwh_pcs = models.FloatField()

    # Métadonnées
    model_name = models.CharField(max_length=64, default="model")
    # Date de création de l'entrée + heure européenne
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["jour"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.jour} - {self.prediction_consommation_kwh_pcs:.0f} kWh"
