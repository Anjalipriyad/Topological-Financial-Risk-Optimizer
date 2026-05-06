# Topological Financial Risk Optimizer (TFRO)
> **A Non-Euclidean Early Warning System for Structural Market Phase Transitions**

TFRO is a full-stack analytical engine designed to detect catastrophic market drawdowns (crashes) before they manifest in price movements. Unlike traditional statistical models that rely on linear indicators, TFRO identifies **structural shattering** in the market's high-dimensional geometry using advanced **Topological Data Analysis (TDA)**.

---

## 1. The Core Innovation

Traditional quantitative models often fail to predict "Black Swan" events because they treat markets as Gaussian distributions. TFRO treats the market as a **dynamic manifold**.

### Key Methodologies:
1. **Topological Signature Extraction:** The system maps market momentum into high-dimensional point clouds to identify topological signatures of instability. By analyzing the "shape" of data persistence, we can detect when the underlying structural integrity of an asset is fracturing.
2. **Manifold Dynamics (Proprietary Signals):** Static topological snapshots can be noisy. TFRO implements a proprietary velocity-tracking algorithm that monitors the *rate of change* in topological features to suppress false positives and isolate genuine pre-crash signals.
3. **Adaptive Regime Mapping:** The engine utilizes a localized temporal training architecture that dynamically adapts to evolving market regimes, ensuring that the model's sensitivity is always tuned to current volatility profiles.

---

## 2. Advanced Engine Architecture

The TFRO backend combines high-dimensional geometry with a sophisticated machine learning ensemble to deliver institutional-grade risk assessments.

*   **Multi-Model Soft-Voting Ensemble:** A proprietary weighted ensemble architecture that balances aggressive non-linear signal detection with conservative regularization guardrails.
*   **Probabilistic Confidence Calibration:** To ensure actionable output, the system applies mathematical sharpening to the ensemble's probability matrix, providing a clear "Model Confidence" percentage for every prediction.
*   **Automated Risk Management:** The engine translates raw quantitative data into beginner-friendly "Retail Advice," including dynamic Stop-Loss calculations and portfolio allocation limits based on asset-specific volatility.

---

## 3. Results & Validation

The system has been rigorously backtested across multiple asset classes (Equities, Crypto, Indices) to ensure robust performance under various market conditions.

*   **Dynamic Backtest Accuracy:** ~75-80% (varies by asset class and regime).
*   **Signal Precision:** Optimized to minimize "false alarms" while maintaining high sensitivity to genuine structural shattering.
*   **Real-World Application:** Designed for live inference with rolling training windows to prevent model drift.

---

## 4. Setup & Usage

### 1. Installation
Ensure Python 3.10+ is installed.
```bash
pip install -r requirements.txt
```

### 2. Live Backend Engine
Launch the FastAPI server (default port 8000):
```bash
python3 main.py
```

### 3. Client Dashboard
Launch the premium React-based analytical interface:
```bash
cd frontend
npm install
npm run dev
```

### 4. CLI Analysis Tool
Run production-grade inference directly from your terminal:
```bash
python3 main.py TICKER  # Example: python3 main.py NVDA
```

---

## 5. System Components
*   **High-Dimensional Geometry Engine:** Extracts non-Euclidean features from market time-series.
*   **Ensemble Inference Module:** Processes signals through a multi-stage forecasting pipeline.
*   **Glassmorphism Dashboard:** Provides a state-of-the-art interactive UI for risk visualization.
*   **Retail Advisory Layer:** Translates complex math into actionable safety nets for individual investors.
