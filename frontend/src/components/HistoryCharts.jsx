import { useEffect, useState } from "react";
import { Paper, Stack, Typography, Alert, Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { getHistory } from "../services/api";

function formatHistory(items = []) {
  return items
    .slice()
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((item) => ({
      date: item.jour,
      y: item.prediction_consommation_kwh_pcs,
      input: `${item.input_type}: ${item.input_value}`,
      model: item.model_name,
    }));
}

export default function HistoryChart({ refreshToken }) {
  const [series, setSeries] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getHistory(400);
        const items = data.items || [];
        setRows(items);
        setSeries(formatHistory(items));
      } catch (e) {
        setError(String(e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshToken]);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Historique des prédictions</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Typography color="text.secondary">Chargement...</Typography>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary">Aucune prédiction enregistrée pour l'instant.</Typography>
      ) : (
        <Stack spacing={2}>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="y" stroke="#2563eb" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date prédiction</TableCell>
                  <TableCell>Jour</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Valeur</TableCell>
                  <TableCell>Consommation (kWh)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </TableCell>
                    <TableCell>{row.jour}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>{row.input_type}</TableCell>
                    <TableCell>{row.input_value}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{Math.round(row.prediction_consommation_kwh_pcs).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
    </Paper>
  );
}
