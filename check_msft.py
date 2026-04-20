import yfinance as yf
import pandas as pd
import numpy as np
import sys
sys.path.append('.')
from main import extract_combined_features

ticker = "MSFT"
df = yf.download(ticker, period="2y", progress=False)
if isinstance(df.columns, pd.MultiIndex): df.columns = df.columns.get_level_values(0)
X, df_aligned = extract_combined_features(df)
closes = df_aligned['Close'].values
atrs = df_aligned['ATR'].values
y = np.zeros(len(closes))
for i in range(len(closes) - 5):
    if (closes[i] - np.min(closes[i+1 : i+6])) >= (atrs[i] * 1.5):
        y[i] = 1

total = len(y)
crashes = int(np.sum(y))
print(f"Ticker: {ticker}")
print(f"Total Trading Days: {total}")
print(f"Number of 'Crashes' Detected: {crashes}")
print(f"Crash Probability: {crashes/total*100:.2f}%")
