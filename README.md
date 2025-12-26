# 🔥 GAS Energy Forecsating

Application end-to-end pour prédire la **consommation mensuelle de gaz**
d'un bâtiment :

-   🧱 Backend : Django (API REST) avec Django REST Framework
-   💻 Frontend : React (Vite + MUI + Recharts)
-   🤖 ML : artefacts sauvegardés (modèle + métriques + dates)

------------------------------------------------------------------------

## 1️⃣ Prérequis

-   Python **3.10+**
-   Node.js (LTS) + npm
-   pip + venv

Vérifier :

    python --version
    node -v
    npm -v

------------------------------------------------------------------------

## 2️⃣ Structure du projet

    gas-energy-prediction/
    ├── backend/
    │   ├── ...
    │   ├── prediction/
    │   └── manage.py
    │
    ├── ml/
    │   ├── ml_pipeline.py
    │   └── artifacts/
    │       ├── estimator_model.pkl
    │       ├── metrics.json
    │       └── dates_predict.json
    │
    ├── frontend/
    │   ├── package.json
    │   ├── vite.config.js
    │   └── src/
    │       ├── main.jsx
    │       ├── App.jsx
    │       ├── services/api.js
    │       └── components/
    │           ├── PredictionForm.jsx
    │           └── HistoryChart.jsx
    └── README.md

------------------------------------------------------------------------

## 3️⃣ Générer (si besoin) les artefacts ML

Les fichiers utilisés par le backend :

-   `estimator_model.pkl`
-   `metrics.json`
-   `dates_predict.json`

Déjà présents --- sinon :

    cd ml
    python ml_pipeline.py

Les artefacts seront créés dans :

    ml/artifacts/

------------------------------------------------------------------------

## 4️⃣ Lancer le backend (API Django)

    cd backend

Créer un environnement :

### Windows

    python -m venv venv
    venv\Scripts\activate

### Linux / Mac

    python -m venv venv
    source venv/bin/activate

Installer :

    pip install -r requirements.txt

Migrer :

    python manage.py migrate

Lancer :

    python manage.py runserver

➡️ API : http://127.0.0.1:8000/api/

Endpoints utiles (base: http://127.0.0.1:8000/api) :
- `GET /predict-dates/` : dates autorisées
- `POST /predict/` : corps JSON `{ "jour": "YYYY-MM-DD", "input_type": "temperature|dju", "input_value": number }`
- `GET /metrics/` : métriques du modele
- `GET /prediction-history/` : historique des prédictions

------------------------------------------------------------------------

## 5️⃣ Lancer le frontend (React + Vite + MUI)

    cd frontend
    npm install # installe React, Vite, MUI, Recharts

Puis :

    npm run dev

➡️ http://localhost:5173

------------------------------------------------------------------------

## 6️⃣ Fonctionnement du formulaire

-   La **date** vient de `/api/predict-dates/`
-   L'utilisateur choisit :
    -   `temperature`
    -   ou `dju`
-   Si température → convertie en DJU côté backend
-   La prédiction est sauvegardée puis affichée dans le graphe

Formule DJU :

    DJU = max(0, Tref - Tmoy)

------------------------------------------------------------------------

## 7️⃣ Résumé exécution

1️⃣ Générer artefacts (optionnel) 2️⃣ Lancer Django 3️⃣ Lancer React 4️⃣
Utiliser l'interface

