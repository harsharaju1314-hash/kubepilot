# KubePilot: AI-Powered Kubernetes Operations Assistant 🚀

**KubePilot** is an enterprise-grade, cloud-native DevOps platform designed to help SREs and developers monitor cluster health, browse Kubernetes workloads, inspect real-time container logs, and perform **AI-driven root-cause troubleshooting** using LangChain and LLMs.

---

## 🌟 Key Features

- 📊 **Interactive Overview Dashboard**: Aggregate health status, running vs. failed pods, deployment counts, and real-time CPU & memory time-series charts.
- 🔍 **Kubernetes Resource Explorer**: Browse Namespaces, Pods, Deployments, ReplicaSets, Services, and Nodes with status pills and namespace filters.
- 📜 **Interactive Pod Log Viewer**: Stream stdout/stderr logs with level highlighting (`[ERROR]`, `[WARN]`, `[INFO]`), search filtering, copy-to-clipboard, and event timeline tracking.
- 🤖 **LangChain AI Log Analyzer**: Diagnostic engine analyzing container logs and pod specs to return:
  - **Root Cause**
  - **Severity Level** (`Low`, `Medium`, `High`, `Critical`)
  - **Technical Explanation**
  - **Step-by-step Actionable Remediation Guidelines**
  - **Clickable Kubernetes Documentation References**
- ⚡ **"What Changed Today?" Deployment Summarizer**: AI-generated timeline summaries of recent deployments, scaling events, pod crashes, and deleted resources.
- 🔔 **Cluster Warnings & Alerts**: Real-time notification system tracking pod restarts, `CrashLoopBackOff`, and `OOMKilled` events.
- ⚡ **Dual-Mode Engine**: Connects to live Minikube/Kind clusters via `~/.kube/config` or operates seamlessly via a built-in high-fidelity Kubernetes cluster simulator.

---

## 🏗️ Architecture

```
[ Frontend: Next.js + React + Tailwind CSS ]
                 │ (REST APIs)
                 ▼
[ Backend: FastAPI + Pydantic + Uvicorn ]
        │                        │
        ▼                        ▼
[ K8s Service Engine ]    [ LangChain AI Engine ]
   ├── K8s Client (Py)       ├── OpenAI / Ollama LLM
   └── Simulator Fallback    └── Smart SRE Fallback
```

---

## 🛠️ Technology Stack

- **Backend**: Python 3.11, FastAPI, Pydantic, Uvicorn, Kubernetes Client
- **AI Integration**: LangChain, OpenAI API / Ollama
- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide React Icons, Recharts
- **DevOps**: Docker, Docker Compose, Kubernetes Manifests, GitHub Actions CI/CD

---

## 🚀 Quickstart Guide

### 1. Run with Docker Compose (Recommended)

```bash
# Clone or navigate to directory
cd kubepilot

# Start unified container stack
docker-compose up --build
```
- **Frontend Dashboard**: `http://localhost:3000`
- **FastAPI Backend & Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### 2. Manual Development Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run pytest tests
pytest

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install packages
npm install

# Start Next.js dev server
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 📚 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/cluster/health` | `GET` | Get aggregate cluster health summary & metrics |
| `/api/v1/namespaces` | `GET` | List all Kubernetes namespaces |
| `/api/v1/pods` | `GET` | Filter pods by namespace & status |
| `/api/v1/pods/{ns}/{name}` | `GET` | Detailed specs, events, env vars for a pod |
| `/api/v1/logs/{pod_name}` | `GET` | Fetch stdout/stderr logs for a target pod |
| `/api/v1/deployments` | `GET` | List deployments and replica counts |
| `/api/v1/services` | `GET` | List services, types, and ClusterIPs |
| `/api/v1/nodes` | `GET` | List nodes, CPU & Memory usage percentages |
| `/api/v1/metrics` | `GET` | Time-series CPU and Memory metrics |
| `/api/v1/ai/analyze` | `POST` | Execute LangChain AI log diagnosis on a pod |
| `/api/v1/ai/summary` | `POST` | Generate AI deployment change summary ("What changed today?") |
| `/api/v1/notifications` | `GET` | Fetch cluster warning notifications |

---

## 🧪 Testing

Run backend API and AI unit tests using `pytest`:

```bash
cd backend
pytest -v
```

---

## 📜 License

MIT License. Built for cloud-native engineering teams.
