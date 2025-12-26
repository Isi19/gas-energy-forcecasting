import { useEffect, useState } from "react";
import { Box, Container, Grid, Paper, Stack, Typography, Divider, Alert, Chip } from "@mui/material";
import PredictionForm from "./components/PredictionForm";
import HistoryChart from "./components/HistoryCharts";
import { getMetrics } from "./services/api";

export default function App() {
  const [refreshToken, setRefreshToken] = useState(0);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [metricsError, setMetricsError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setMetricsError("");
        const data = await getMetrics();
        setMetrics(data || []);
      } catch (e) {
        setMetricsError(String(e.message || e));
      }
    })();
  }, [refreshToken]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="flex-start" spacing={2} mb={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Prévision de la consommation d'énergie d'un bâtiment</Typography>
          <Typography variant="body2" color="text.secondary">Prévoir la consommation et suivre l'historique.</Typography>
        </Box>
        {/* <Chip color="primary" label="API : http://127.0.0.1:8000/api" /> */}
      </Stack>

      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <PredictionForm
            onPredicted={(data) => {
              setLastPrediction(data);
              setRefreshToken((x) => x + 1);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={2} height="100%">
            <SummaryCard lastPrediction={lastPrediction} metrics={metrics} metricsError={metricsError} />
            <HistoryChart refreshToken={refreshToken} />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

function SummaryCard({ lastPrediction, metrics, metricsError }) {
  const best = Array.isArray(metrics) && metrics.length > 0 ? metrics[0] : null;

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Dernière prédiction</Typography>
      {lastPrediction ? (
        <Stack spacing={0.5}>
          <Typography variant="h5" fontWeight={700}>
            {Math.round(lastPrediction.prediction_consommation_kwh_pcs).toLocaleString()} kWh
          </Typography>
          <Typography variant="caption" color="text.secondary">Modèle : {lastPrediction.model_name}</Typography>
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">Fais une première prédiction pour voir le résumé.</Typography>
      )}

      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2">Métriques du modèle</Typography>
      {metricsError && <Alert severity="error" sx={{ mt: 1 }}>{metricsError}</Alert>}
      {best ? (
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {best.model} (alpha {best.alpha})<br />
          R2: {best.R2?.toFixed?.(3)} | MAE: {Math.round(best.MAE)} | RMSE: {Math.round(best.RMSE)}
        </Typography>
      ) : (
        !metricsError && <Typography variant="body2" color="text.secondary">Aucune métrique chargée.</Typography>
      )}
    </Paper>
  );
}
