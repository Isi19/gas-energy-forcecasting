import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { getPredictDates, predict } from "../services/api";

export default function PredictionForm({ onPredicted }) {
  const [dates, setDates] = useState([]);
  const [jour, setJour] = useState("");
  const [inputType, setInputType] = useState("température"); // "température" | "dju"
  const [inputValue, setInputValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPredictDates();
        setDates(data.dates || []);
        if ((data.dates || []).length > 0) setJour(data.dates[0]);
      } catch (e) {
        setError(String(e.message || e));
      }
    })();
  }, []);

  const canSubmit = useMemo(() => {
    return jour && inputValue !== "" && !Number.isNaN(Number(inputValue));
  }, [jour, inputValue]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const payload = {
        jour,
        input_type: inputType,
        input_value: Number(inputValue),
      };

      const data = await predict(payload);
      setResult(data);
      onPredicted?.(data); // refresh history/summary
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Box component="h2" sx={{ m: 0, fontSize: 20, fontWeight: 700 }}>Prédire la consommation</Box>
          <Box sx={{ color: "text.secondary", fontSize: 13 }}>Choisis la date, saisis la température ou DJU, puis lance la prédiction.</Box>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Date à prédire"
              value={jour}
              onChange={(e) => setJour(e.target.value)}
              disabled={dates.length === 0}
              SelectProps={{ native: true }}
            >
              {dates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </TextField>

            <FormControl>
              <FormLabel>Type d'entrée</FormLabel>
              <RadioGroup row value={inputType} onChange={(e) => setInputType(e.target.value)}>
                <FormControlLabel value="température" control={<Radio />} label="Température" />
                <FormControlLabel value="dju" control={<Radio />} label="DJU" />
              </RadioGroup>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  label={inputType === "température" ? "Température (C)" : "DJU"}
                  placeholder={inputType === "température" ? "ex: 12.5" : "ex: 120"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  inputMode="decimal"
                />
              </Grid>
            </Grid>

            <Button variant="contained" type="submit" disabled={!canSubmit || loading}>
              {loading ? "Prédiction..." : "Prédire"}
            </Button>
          </Stack>
        </form>

        {result && (
          <Alert severity="success">
            <div><b>Consommation prédite :</b> {Math.round(result.prediction_consommation_kwh_pcs).toLocaleString()} kWh</div>
            <div style={{ fontSize: 12 }}>Modèle : {result.model_name}</div>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
