import yfinance as yf
import pandas as pd
import numpy as np
import sys
# Import from local main
sys.path.append('.')
from main import extract_combined_features
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, f1_score
import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression

def check_stock(ticker, use_smote=True):
    try:
        df = yf.download(ticker, period="2y", progress=False)
        if df.empty: return "Empty"
        if isinstance(df.columns, pd.MultiIndex): df.columns = df.columns.get_level_values(0)
        
        X, df_aligned = extract_combined_features(df)
        closes = df_aligned['Close'].values
        atrs = df_aligned['ATR'].values
        y = np.zeros(len(closes))
        for i in range(len(closes) - 5):
            if (closes[i] - np.min(closes[i+1 : i+6])) >= (atrs[i] * 1.5):
                y[i] = 1
        
        X_hist = X[:-5]
        y_hist = y[:-5]
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X_hist)
        X_tr, X_te, y_tr, y_te = train_test_split(X_scaled, y_hist, test_size=0.2, shuffle=False)
        
        if use_smote:
            from imblearn.over_sampling import SMOTE
            smote = SMOTE(random_state=42)
            try:
                X_tr_res, y_tr_res = smote.fit_resample(X_tr, y_tr)
                pos_w = 1.0
            except:
                X_tr_res, y_tr_res = X_tr, y_tr
                pos_w = np.sqrt(len(y_tr[y_tr==0])/len(y_tr[y_tr==1])) if sum(y_tr)>0 else 1.0
        else:
            X_tr_res, y_tr_res = X_tr, y_tr
            pos_w = np.sqrt(len(y_tr[y_tr==0])/len(y_tr[y_tr==1])) if sum(y_tr)>0 else 1.0

        xgb_clf = xgb.XGBClassifier(n_estimators=100, max_depth=4, scale_pos_weight=pos_w, random_state=42)
        rf_clf = RandomForestClassifier(n_estimators=100, max_depth=4, class_weight='balanced', random_state=42)
        lr_clf = LogisticRegression(class_weight='balanced', random_state=42, max_iter=1000)
        clf = VotingClassifier(estimators=[('xgb', xgb_clf), ('rf', rf_clf), ('lr', lr_clf)], voting='soft')
        
        clf.fit(X_tr_res, y_tr_res)
        y_pred = clf.predict(X_te)
        acc = accuracy_score(y_te, y_pred)
        f1 = f1_score(y_te, y_pred)
        return f"{acc*100:.1f}% (F1:{f1:.2f})"
    except Exception as e:
        return f"Error: {str(e)}"

print("--- SMOTE RESULTS (Paper Style) ---")
for t in ["RELIANCE.NS", "TSLA", "NVDA", "AAPL"]:
    print(f"{t}: {check_stock(t, True)}")

print("\n--- WEIGHTING RESULTS (Screen Style) ---")
for t in ["RELIANCE.NS", "TSLA", "NVDA", "AAPL"]:
    print(f"{t}: {check_stock(t, False)}")
