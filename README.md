# 🧠 MindNest AI

> **An AI-powered student wellness signal built from everyday habits.**

MindNest AI is an end-to-end machine learning web application that uses everyday student lifestyle, academic, and digital-habit information to generate a simple **model-based wellness score**.

The project combines **data analysis, machine learning, FastAPI, and frontend development** into a complete pipeline:

**Data → Preprocessing → ML Model → API → Web Application**

---

## 🚀 Live Demo

### **[Try MindNest AI](https://mindnest-1-ki4z.onrender.com/)**

The deployed application provides a landing page, student assessment form, ML prediction, and an easy-to-understand wellness result.

---

## 📌 About the Project

Student wellbeing can be influenced by everyday patterns such as:

- 📱 Screen time and phone usage
- 😴 Sleep duration
- 🏃 Physical activity
- 📚 Study hours
- 😓 Perceived stress
- 🎓 Academic information
- 🌐 Digital habits and platform usage

MindNest AI explores whether these patterns can be transformed into a useful machine-learning signal.

The goal was not simply to train a model, but to understand and implement the **complete ML lifecycle**:

> **Explore → Preprocess → Train → Compare → Validate → Deploy → Integrate**

---

## ✨ Features

- 🏠 Interactive landing page
- 📝 Student wellness assessment
- 🤖 Machine-learning based prediction
- 📊 Wellness score generated from user inputs
- ⚡ FastAPI backend
- 🌐 HTML, CSS & JavaScript frontend
- 🔄 Real-time frontend-to-API communication
- 🧩 Serialized preprocessing + model pipeline
- 📱 Responsive and student-friendly interface
- ☁️ Deployed web application

---

## 🏗️ System Architecture

```text
┌──────────────────────┐
│      Web UI          │
│ Landing + Assessment │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    Frontend JS       │
│ Validate + JSON      │
└──────────┬───────────┘
           │
           │ POST /predict
           ▼
┌──────────────────────┐
│       FastAPI        │
│      Backend API     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   ML Pipeline        │
│ Preprocessing +      │
│    Extra Trees       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Prediction      │
│ Wellness Score +     │
│   Interpretation     │
└──────────────────────┘
```

The main prediction contract is:

```text
POST /predict
        ↓
predicted_mental_health_score
```

The frontend collects the user's information, creates the request payload, and sends it to the FastAPI backend. The backend loads the serialized ML pipeline, performs the required preprocessing, generates the prediction, and returns the result.

---

## 🤖 Machine Learning

### Dataset

The project dataset contains:

- **5,000 rows**
- **13 columns**
- Target range of approximately **3.6–9.4**

Exploratory analysis was performed to understand the structure of the dataset, distributions, duplicates, missing values, and relationships between features and the target.

Some of the relationships explored included:

```text
More screen time       → lower score tendency
More phone unlocks     → lower score tendency
More sleep             → higher score tendency
More physical activity → higher score tendency
More study hours       → higher score tendency
Higher stress          → lower score tendency
```

These are **patterns observed in the dataset**, not universal medical conclusions.

---

## ⚙️ Data Preprocessing

Different types of features require different transformations.

### Numerical Features

Features such as:

- Age
- Screen time
- Phone usage
- Unlocks
- Physical activity
- Sleep

are standardized using `StandardScaler`.

### Study Hours

`Study_Hours` is transformed using:

```text
log1p → StandardScaler
```

This helps handle its skewed distribution.

### Stress Level

Stress is treated as an ordinal feature:

```text
Low        → 0
Moderate   → 1
High       → 2
Very High  → 3
```

### Categorical Features

Categorical variables such as gender, country, platform, purpose, and academic level are transformed using:

```text
OneHotEncoder
```

The preprocessing is packaged together with the estimator using a `ColumnTransformer` and `Pipeline`, ensuring that the same transformations are applied during both training and live prediction.

---

## 📈 Model Comparison

Three regression models were evaluated on the same held-out test set:

| Model | R² |
|---|---:|
| Linear Regression | 0.740 |
| Random Forest | 0.878 |
| **Extra Trees** | **0.914** |

### 🏆 Selected Model: Extra Trees

The Extra Trees model achieved:

- **R²:** 0.914
- **MAE:** 0.273
- **RMSE:** 0.389

It performed best among the tested models on the evaluation set.

Extra Trees was selected because it can capture nonlinear relationships in tabular data while combining multiple decision trees to produce a stable prediction.

---

## 🔬 Validation

After comparing the models, the selected model was additionally checked using **5-fold cross-validation**.

Each fold uses approximately:

```text
80% → Training
20% → Validation
```

The purpose was to check whether the model's performance remained reasonably consistent across different splits rather than relying on a single lucky train/test split.

---

## 🧪 End-to-End ML Pipeline

The project follows this workflow:

```text
Student Dataset
      ↓
Exploratory Data Analysis
      ↓
Data Preprocessing
      ↓
Model Comparison
      ↓
Extra Trees Selection
      ↓
Cross-Validation
      ↓
Final Pipeline
      ↓
mentalHealthModel.pkl
      ↓
FastAPI
      ↓
/predict
      ↓
Frontend
      ↓
Wellness Signal
```

The trained pipeline is serialized as:

```text
mentalHealthModel.pkl
```

and loaded by the FastAPI backend for live inference.

---

## 🛠️ Tech Stack

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- Joblib
- Jupyter Notebook

### Backend

- FastAPI
- Pydantic
- Uvicorn

### Frontend

- HTML
- CSS
- JavaScript

### Deployment

- Render

---

## 📂 Project Structure

A simplified representation of the project architecture:

```text
MindNest/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── main.py
├── mentalHealthModel.pkl
├── StudentMentalHealth.ipynb
├── requirements.txt
└── README.md
```

> File names may vary slightly depending on the current version of the repository.

---

## 🔌 API

### `POST /predict`

The frontend sends student information to the FastAPI backend.

Conceptually:

```json
{
  "age": 20,
  "gender": "Male",
  "country": "India",
  "screen_time": 5.5,
  "sleep": 7,
  "study_hours": 4,
  "stress_level": "Moderate"
}
```

The API processes the input through the saved ML pipeline and returns a predicted wellness score.

```text
POST /predict
        ↓
Model prediction
        ↓
predicted_mental_health_score
```

---

## 🎨 Product Experience

MindNest follows a simple three-stage experience:

### 1. Landing

Introduces MindNest and explains the purpose of the assessment.

### 2. Assessment

The user provides information about their everyday habits and lifestyle.

### 3. Result

The model generates a wellness signal and presents it with contextual interpretation.

The interface intentionally uses **non-clinical language** and focuses on providing an informational signal rather than presenting itself as a medical diagnostic system.

---

## ⚠️ Important Disclaimer

**MindNest AI is an educational and experimental machine-learning project. It is NOT a medical device, clinical assessment, or diagnostic tool.**

The generated score should **not** be interpreted as a diagnosis or professional mental-health assessment.

The model's predictions are limited by the dataset used for training, and unusual combinations of inputs may produce less reliable results. A strong machine-learning evaluation score does not establish clinical validity.

If someone is concerned about their mental health, they should seek advice from a qualified healthcare professional.

---

## 🚧 Limitations

Current limitations include:

- Training data limits what the model can learn.
- Predictions may be less reliable for inputs that differ significantly from the training data.
- Dataset representativeness can affect generalization.
- Model performance metrics do not establish clinical validity.
- Individual predictions currently have limited explainability.

---

## 🔮 Future Improvements

Potential improvements include:

- 📚 Expand and improve the training dataset
- 🧪 Stronger data validation
- 📊 Better model calibration
- 🔍 Individual prediction explainability
- 📈 Model monitoring after deployment
- ♿ Improved accessibility
- 🧪 Automated testing
- 🌎 More representative training data

These improvements would help make the system more robust and easier to evaluate in future iterations.

---

## 🎯 What I Learned

This project was built as an opportunity to understand how an ML model moves beyond a notebook and becomes an actual application.

Through MindNest AI, I worked across:

- Data exploration
- Feature preprocessing
- Regression
- Model comparison
- Cross-validation
- Model serialization
- FastAPI
- API integration
- Frontend development
- Deployment

The main learning objective was understanding the complete journey:

> **Data → Model → API → Product**

---

## 👨‍💻 Author

### Sambhav Shahi

Student & Aspiring AI/ML Developer

Interested in:

- Python
- Machine Learning
- Data Science
- Artificial Intelligence
- Web Development

MindNest AI was created as a practical project to learn and demonstrate the complete machine-learning development lifecycle.

---

## 🌐 Links

**Live Application:**  
https://mindnest-1-ki4z.onrender.com/

---

## ⭐ Project Status

**Status:** 🟢 Working End-to-End Web Application

**Current Pipeline:**

```text
Dataset
   ↓
EDA
   ↓
Preprocessing
   ↓
Extra Trees
   ↓
Serialized Model
   ↓
FastAPI
   ↓
Frontend
   ↓
Render Deployment
```

---

### Built with ❤️ using Python, Machine Learning, FastAPI, HTML, CSS & JavaScript.

**MindNest AI — From notebook → model → API → product.**