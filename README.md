#MindNest AI

MindNest AI is a student wellness prediction system that uses everyday lifestyle, academic, and digital-habit information to generate a model-based mental-health signal.

Important: MindNest AI is an informational/educational project. It is not a medical or clinical diagnostic tool and should not be used as a replacement for professional mental-health care.

Features

AI-powered mental-health score prediction

Student profile and academic inputs

Digital-habit inputs such as screen time and daily phone unlocks

Lifestyle inputs such as sleep, study time, and physical activity

Perceived stress-level input

Interactive result gauge with a plain-language interpretation

Responsive landing page and assessment experience

FastAPI backend for model inference

Serialized ML pipeline stored as mentalHealthModel.pkl

How It Works

User
  ↓
MindNest Web Interface
  ↓
Assessment Form
  ↓
FastAPI /predict endpoint
  ↓
Saved ML Pipeline
  ↓
Predicted Mental Health Score
  ↓
Result shown in the UI

The frontend collects the student's information and sends it to the backend as JSON. The backend loads the trained pipeline and uses it to generate a prediction.

Dataset

The project uses the Student Social Media And Mental Health Impact dataset.

The dataset contains:

5,000 rows

13 columns

The target variable is:

Mental_Health_Score

The model uses:

Age
Gender
Country
Academic_Level
Most_Used_Platform
Purpose_Of_Use
Avg_Daily_Usage_Hours
Daily_Unlocks
Study_Hours
Physical_Activity_Hours
Sleep_Hours_Per_Night
Stress_Level

The observed target values in the dataset range from 3.6 to 9.4.

Exploratory Data Analysis

The notebook performs:

Dataset shape inspection

First-row inspection

Missing-value checks

Duplicate checks

Data-type inspection

Descriptive statistics

Mental-health score distribution analysis

Stress-level analysis

Screen-time relationship analysis

The purpose of EDA is to understand the dataset and relationships between student habits and the target before modeling.

Data Preprocessing

Different feature types use different preprocessing strategies.

Numerical features

These features are standardized with StandardScaler:

Age
Avg_Daily_Usage_Hours
Daily_Unlocks
Physical_Activity_Hours
Sleep_Hours_Per_Night

Study hours

Study_Hours is treated as a skewed numerical feature:

log1p transformation
        ↓
StandardScaler

Stress level

Stress_Level is ordinal:

Low
Medium
High
Very High

It is encoded using OrdinalEncoder so the ordering is preserved.

Nominal categorical features

These are one-hot encoded:

Gender
Academic_Level
Most_Used_Platform
Purpose_Of_Use
Grouped_Country

handle_unknown="ignore" is used so an unseen category does not cause the encoder to fail during inference.

All transformations are combined with the estimator using a ColumnTransformer and Pipeline.

Model Selection

The notebook compares:

Linear Regression

Random Forest Regressor

Extra Trees Regressor

The models are evaluated using R², MAE, and RMSE.

Test-set comparison

Model

R²

MAE

RMSE

Linear Regression

~0.740

~0.536

~0.676

Random Forest

~0.878

~0.347

~0.464

Extra Trees

~0.914

~0.273

~0.389

Extra Trees performed best on the held-out test set.

Cross-validation

Five-fold cross-validation is used as an additional generalization check. Instead of relying on one train/test split, the data is evaluated across five different folds.

The purpose is to check whether the model's performance remains reasonably stable across different subsets of the dataset.

Why Extra Trees?

The final estimator is an ExtraTreesRegressor.

Extra Trees is an ensemble of decision trees that introduces more randomness in how tree splits are selected. The predictions of the individual trees are aggregated to produce the final regression output.

Extra Trees was selected because it performed best among the evaluated candidate models on this dataset.

After model selection, the final pipeline is trained on the complete dataset.

Model Output

The model predicts:

Mental_Health_Score

The website presents the prediction as a 0–10 wellness signal.

This number is a model prediction learned from the training dataset, not a clinical severity scale. The model was trained on observed target values ranging from 3.6 to 9.4.

Project Structure

StudentMentalHealth/
│
├── index.html
├── style.css
├── script.js
│
├── main.py
├── mentalHealthModel.pkl
│
├── StudentMentalHealth.ipynb
├── Student Social Media And Mental Health Impact.csv
│
└── README.md

Main files

File

Purpose

index.html

Frontend structure and UI

style.css

UI styling and responsive design

script.js

Form validation, API requests, and result display

main.py

FastAPI backend

mentalHealthModel.pkl

Serialized trained ML pipeline

StudentMentalHealth.ipynb

Data analysis, preprocessing, model training, and evaluation

Dataset CSV

Training and evaluation data

API

The backend exposes:

POST /predict

Request example

{
  "age": 21,
  "gender": "Male",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Education",
  "avg_daily_usage_hours": 4.0,
  "daily_unlocks": 120,
  "study_hours": 4.0,
  "physical_activity_hours": 2.0,
  "sleep_hours_per_night": 7.0,
  "stress_level": "Medium"
}

Response example

{
  "predicted_mental_health_score": 6.42
}

Running Locally

1. Clone the repository

git clone <your-repository-url>
cd StudentMentalHealth

2. Install dependencies

Use your project's dependency file if you have one. The core backend/model stack includes packages such as:

pip install fastapi uvicorn pandas numpy scikit-learn joblib

3. Start the FastAPI backend

uvicorn main:app --reload

4. Serve the frontend

Because this project uses plain HTML/CSS/JavaScript, serve the frontend through HTTP instead of opening index.html directly with file://.

For example:

python -m http.server 8000

Then open:

http://localhost:8000

Deployment

The frontend and FastAPI backend can be deployed using services such as Render.

For deployment, make sure:

main.py is present in the backend service

mentalHealthModel.pkl is present alongside the backend

script.js points to the correct backend URL

The frontend can reach the /predict endpoint

Retraining the Model

The notebook documents the complete ML workflow:

Load dataset
    ↓
Inspect and explore data
    ↓
Define features and target
    ↓
Train/test split
    ↓
Build preprocessing pipeline
    ↓
Train candidate models
    ↓
Evaluate models
    ↓
Cross-validation
    ↓
Select Extra Trees
    ↓
Train final model on full dataset
    ↓
Save mentalHealthModel.pkl

The final trained pipeline is serialized with Joblib:

joblib.dump(finalModel, "mentalHealthModel.pkl")

When retraining, validate the new model before replacing the deployed .pkl.

Limitations

Dataset limitations

The quality of predictions depends on the quality and representativeness of the training dataset.

Model limitations

The model learns statistical patterns from the dataset. It does not clinically assess a student's mental state.

Out-of-distribution inputs

Predictions may be less reliable for combinations of values that are very different from the training data.

Not a medical diagnosis

The result must not be interpreted as a diagnosis, screening result, or medical recommendation.

Privacy

This is an educational project. Users should avoid entering unnecessary personally identifiable or sensitive information.

A real-world mental-health system would require stronger privacy, security, consent, and data-governance controls.

Project Goal

MindNest AI demonstrates an end-to-end machine-learning application:

Data Analysis
      ↓
Feature Engineering
      ↓
Preprocessing
      ↓
Model Comparison
      ↓
Model Evaluation
      ↓
Model Deployment
      ↓
Web Application

The project combines data science, machine learning, FastAPI, and frontend development into a single student-focused application.

Creator

Created by Sambhav Shahi

Disclaimer

MindNest AI is an educational/informational project.

It is not intended to diagnose, treat, prevent, or replace professional assessment of any mental-health condition.
