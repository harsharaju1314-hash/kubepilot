# 🚀 KubePilot: AI-Assisted Kubernetes Operations Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![LangChain](https://img.shields.io/badge/AI-LangChain-1C3C3C?style=flat-square&logo=chainlink)](https://www.langchain.com/)
[![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?style=flat-square&logo=kubernetes)](https://kubernetes.io/)
[![Prometheus](https://img.shields.io/badge/Metrics-Prometheus-E6522C?style=flat-square&logo=prometheus)](https://prometheus.io/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

An enterprise-grade **AI-assisted Kubernetes Operations Platform & SRE Copilot** engineered to reduce **Mean Time to Resolution (MTTR)** by combining real-time cluster telemetry with automated LLM root-cause diagnosis.

---

## ❓ Why KubePilot?

Modern Kubernetes production environments generate thousands of logs, events, and metrics every minute.

When an application fails (e.g. `CrashLoopBackOff` or `OOMKilled`), Site Reliability Engineers (SREs) often spend significant time manually jumping between terminal windows, running `kubectl logs`, inspecting pod specs, reading stack traces, and searching documentation.

**KubePilot** eliminates this manual overhead. It correlates container log streams, pod specs, and warning events into a unified dashboard, running them through a **LangChain AI diagnostic pipeline** to instantly deliver root-cause explanations and step-by-step resolution commands.

---

## ✨ Feature Overview

| Feature | Description |
| :--- | :--- |
| **AI SRE Diagnostics** | One-click LangChain log analysis delivering root cause, severity rating, and step-by-step remediation steps. |
| **"What Changed Today?"** | AI-generated timeline summaries of recent deployments, scaling events, pod crashes, and deleted resources. |
| **Cluster Health Telemetry** | Real-time aggregate cluster status counters, node readiness, and active warning alerts. |
| **Resource Metrics & Prometheus** | Live CPU Core and RAM memory charts + native `/api/v1/metrics/prometheus` exposition endpoint for scrapers. |
| **Kubernetes Explorer** | Browse Namespaces, Pods, Deployments, ReplicaSets, Services, and Nodes with real-time status pills and filters. |
| **Interactive Log Viewer** | Stream container stdout/stderr logs with error level syntax highlighting (`[ERROR]`, `[WARN]`, `[INFO]`), search filtering, and copy features. |
| **Production Health Probes** | Pre-configured `livenessProbe` and `readinessProbe` configs for zero-downtime Kubernetes deployments. |

---

## 🏗️ Architecture & Data Flow

```mermaid
flowchart TB
    subgraph Client ["Client Layer"]
        UI["Next.js 14 Web Application\n(React 18 + Tailwind CSS + Recharts)"]
    end

    subgraph Backend ["FastAPI Backend Layer (App / API / Services / Core)"]
        API["FastAPI REST & Metrics Router\n(/api/v1/cluster, /pods, /ai, /metrics)"]
        Prometheus["Prometheus Exposition Exporter\n(/api/v1/metrics/prometheus)"]
        K8sService["Kubernetes Service Layer\n(CoreV1Api / AppsV1Api)"]
        Simulator["Dual-Mode State Simulator\n(CrashLoopBackOff / OOMKilled)"]
        AIService["LangChain AI Diagnostic Engine\n(PydanticOutputParser)"]
    end

    subgraph Infrastructure ["Cloud Infrastructure Layer"]
        K8sCluster["Live Kubernetes Cluster / Minikube\n(~/.kube/config or In-Cluster SA)"]
        LLM["LLM Provider\n(OpenAI GPT-4o / Ollama / Fallback)"]
    end

    UI <-->|JSON REST APIs| API
    API --> K8sService
    API --> AIService
    API --> Prometheus
    K8sService <-->|Py Client SDK| K8sCluster
    K8sService -.->|Fallback| Simulator
    AIService <-->|Structured Prompts| LLM
```

---

## 🤖 AI Diagnostic Workflow Pipeline

The step-by-step pipeline executed when an engineer clicks **"Troubleshoot with AI"**:

```
[ User selects Pod ]
         │
         ▼
[ Fetch Pod Logs (stdout/stderr) ] ───► [ Fetch Pod Spec & Environment Variables ]
                                                       │
                                                       ▼
                                       [ Construct Structured SRE Prompt ]
                                                       │
                                                       ▼
                                       [ LangChain Execution Pipeline ]
                                                       │
                                                       ▼
                                       [ LLM Execution (OpenAI / Ollama) ]
                                                       │
                                                       ▼
                                       [ Pydantic Output Parser Validation ]
                                                       │
                                                       ▼
                                [ Render Severity, Root Cause, & Fixes in UI ]
```

---

## 📂 Project Structure

```
kubepilot/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/      # REST & Prometheus route handlers
│   │   │       └── router.py
│   │   ├── core/                   # App configuration & logging
│   │   ├── schemas/                # Pydantic v2 validation models
│   │   ├── services/
│   │   │   ├── ai/                 # LangChain AI diagnostic engine
│   │   │   └── kubernetes/         # K8s Python SDK client & state simulator
│   │   ├── utils/                  # Prometheus metrics exporter
│   │   └── main.py                 # FastAPI application entrypoint
│   ├── tests/                      # Pytest automated test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   ├── components/             # Dashboard, Explorer, Log Viewer, AI Modal
│   │   ├── services/               # Axios API client
│   │   └── types/                  # TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
├── k8s/                            # Kubernetes production manifests with probes
├── .github/workflows/ci-cd.yml     # GitHub Actions CI pipeline
└── docker-compose.yml              # Unified local container orchestration
```

---

## 📚 REST API Reference & Sample Payload

### Sample Endpoint: `GET /api/v1/pods`

#### Request
```bash
curl -X GET "http://localhost:8000/api/v1/pods?namespace=production&status=CrashLoopBackOff"
```

#### JSON Response
```json
[
  {
    "name": "payment-service-75b897858-a912b",
    "namespace": "production",
    "status": "CrashLoopBackOff",
    "ip": "10.244.1.15",
    "node": "minikube-node-02",
    "creation_timestamp": "2026-08-06T18:22:10Z",
    "restart_count": 8,
    "cpu_usage_m": 450,
    "memory_usage_mb": 512,
    "labels": {
      "app": "payment-service",
      "tier": "backend"
    },
    "environment_vars": {
      "DB_HOST": "postgres-prod.internal",
      "DB_PORT": "5432",
      "DB_TIMEOUT_MS": "3000"
    },
    "containers": [
      {
        "name": "payment-app",
        "image": "ghcr.io/company/payment-service:v2.4.1",
        "ready": false,
        "restart_count": 8,
        "state": "waiting (CrashLoopBackOff)"
      }
    ]
  }
]
```

### Full API Endpoint Directory

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/cluster/health` | `GET` | Retrieve aggregate cluster health summary & metrics |
| `/api/v1/namespaces` | `GET` | List all Kubernetes namespaces |
| `/api/v1/pods` | `GET` | List & filter pods by namespace and status |
| `/api/v1/pods/{ns}/{name}` | `GET` | Retrieve detailed pod specs, env vars, and events |
| `/api/v1/logs/{pod_name}` | `GET` | Stream container stdout/stderr log output |
| `/api/v1/deployments` | `GET` | List deployments and ready replica counts |
| `/api/v1/services` | `GET` | List services, types, and ClusterIPs |
| `/api/v1/nodes` | `GET` | List node specs and resource utilization |
| `/api/v1/metrics` | `GET` | Retrieve time-series CPU and Memory JSON metrics |
| `/api/v1/metrics/prometheus` | `GET` | Expose **Prometheus exposition metrics** for scrapers |
| `/api/v1/ai/analyze` | `POST` | Trigger LangChain AI log analysis on a pod |
| `/api/v1/ai/summary` | `POST` | Generate AI change summary ("What changed today?") |
| `/api/v1/notifications` | `GET` | Fetch active cluster warning alerts |

---

## ⚡ Performance Benchmarks

Measured on standard development hardware (Intel i7 / 16GB RAM):

| Benchmark Metric | Measured Value |
| :--- | :--- |
| **FastAPI Backend Cold Startup** | `~1.2 seconds` |
| **REST API Endpoint Latency** | `< 45 ms` |
| **AI Diagnosis Pipeline Execution** | `~2.1 seconds` |
| **Prometheus Exporter Response** | `< 12 ms` |
| **Pytest Unit Test Suite Execution** | `0.81 seconds` (10/10 passed) |

---

## 🎯 System Design Decisions

- **Why FastAPI?** Chosen for high-performance asynchronous execution (`async`/`await`), automatic OpenAPI/Swagger documentation, and native Pydantic v2 data validation.
- **Why Kubernetes Python SDK?** Uses official client models (`CoreV1Api`, `AppsV1Api`) for typed, secure API calls without relying on shell commands.
- **Why LangChain?** Facilitates structured prompt templates and output parsing (`PydanticOutputParser`), ensuring deterministic, non-hallucinated JSON outputs from LLM providers.
- **Why Docker & Docker Compose?** Guarantees environment parity between local development and production container deployments.

---

## 🛡️ Error Handling & Reliability

- **Kubernetes Disconnection**: Automatically falls back to the internal state simulator if `~/.kube/config` is missing or unreachable.
- **Missing AI API Key**: Executes an intelligent rule-based SRE diagnostic engine to ensure zero downtime during offline testing.
- **Pod Deletion During Analysis**: Returns a graceful HTTP 404 response with human-readable error messaging.

---

## 🚀 Getting Started

### Option 1: Single-Command Setup with Docker Compose

```bash
# Clone the repository
git clone https://github.com/harsharaju1314-hash/kubepilot.git
cd kubepilot

# Build and launch unified container stack
docker-compose up --build
```

Access the services:
- 🌐 **AI Operations Platform UI**: [http://localhost:3000](http://localhost:3000)
- 📚 **FastAPI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 📊 **Prometheus Metrics Stream**: [http://localhost:8000/api/v1/metrics/prometheus](http://localhost:8000/api/v1/metrics/prometheus)

---

### Option 2: Local Development Setup

#### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run pytest unit tests
pytest -v

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup (Next.js)

```bash
cd frontend

# Install node dependencies
npm install

# Start Next.js dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🗺️ Roadmap & Future Enhancements

- 🌐 **Multi-Cluster Support**: Manage multiple Kubernetes contexts from a single dashboard.
- 🔔 **Slack & PagerDuty Alerts**: Webhook dispatching for critical pod incidents.
- 🔐 **OAuth2 & RBAC**: Role-based access control for namespace management.
- 📊 **Grafana Dashboard Templates**: Pre-configured dashboards for cluster metrics.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
