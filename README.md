# 🚀 KubePilot: AI-Powered Kubernetes Operations Assistant

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![LangChain](https://img.shields.io/badge/AI-LangChain-1C3C3C?style=flat-square&logo=chainlink)](https://www.langchain.com/)
[![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?style=flat-square&logo=kubernetes)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.style=flat-square)](LICENSE)

**KubePilot** is an enterprise-grade cloud-native DevOps platform designed to reduce **Mean Time to Resolution (MTTR)** for Site Reliability Engineers (SREs) and developers managing Kubernetes applications.

KubePilot provides a web dashboard and REST APIs to monitor cluster health, browse workloads, stream real-time container logs, and perform **one-click AI-driven root cause troubleshooting** using LangChain and LLMs.

---

## 📑 Table of Contents
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [REST API Reference](#-rest-api-reference)
- [Getting Started](#-getting-started)
  - [Option 1: Single-Command Setup with Docker Compose](#option-1-single-command-setup-with-docker-compose)
  - [Option 2: Local Development Setup](#option-2-local-development-setup)
- [Kubernetes Manifests & Deployment](#-kubernetes-manifests--deployment)
- [Testing](#-testing)
- [License](#-license)

---

## ✨ Key Features

- 📊 **Cluster Health Telemetry**: Aggregate health counters, running vs. failed pods, deployment counts, and active alert notifications.
- ⚡ **Resource Telemetry & Metrics**: Real-time CPU core and RAM memory time-series charts powered by Recharts.
- 🔍 **Kubernetes Resource Explorer**: Browse Namespaces, Pods, Deployments, ReplicaSets, Services, and Nodes with status pills and namespace filters.
- 📜 **Interactive Log Viewer**: Stream container `stdout`/`stderr` logs with syntax highlighting (`[ERROR]`, `[WARN]`, `[INFO]`), search filtering, copy-to-clipboard, and event timeline.
- 🤖 **LangChain AI Log Analyzer**: Diagnostic engine parsing container logs and pod specs to return:
  - **Identified Root Cause**
  - **Severity Rating** (`Critical`, `High`, `Medium`, `Low`)
  - **Technical Explanation**
  - **Step-by-step Actionable Remediation Commands**
  - **Official Kubernetes Documentation References**
- 📈 **"What Changed Today?" Change Summarizer**: AI-generated timeline summaries of recent deployments, scaling events, pod crashes, and deleted resources.
- ⚡ **Dual-Mode K8s Engine**: Connects to live Minikube/Kind clusters via `~/.kube/config` or falls back to an internal Kubernetes cluster simulator with realistic pod failure scenarios (`CrashLoopBackOff`, `OOMKilled`, DB timeouts).

---

## 🏗️ Architecture

```
                                 ┌──────────────────────────────────────────┐
                                 │   Next.js 14 Web Application (Port 3000) │
                                 │   (Tailwind CSS + Lucide + Recharts)     │
                                 └────────────────────┬─────────────────────┘
                                                      │ (Axios REST API Calls)
                                                      ▼
                                 ┌──────────────────────────────────────────┐
                                 │       Python FastAPI Backend (Port 8000) │
                                 └───────────┬──────────────────┬───────────┘
                                             │                  │
                      ┌──────────────────────┘                  └──────────────────────┐
                      ▼                                                                ▼
   ┌────────────────────────────────────┐                           ┌─────────────────────────────────────┐
   │    Kubernetes Python Client SDK    │                           │       LangChain AI Engine           │
   │  (CoreV1Api / AppsV1Api / Simulator)│                           │   (OpenAI GPT-4o / Ollama / Fallback)│
   └──────────────────┬─────────────────┘                           └──────────────────┬──────────────────┘
                      │                                                                │
                      ▼                                                                ▼
   ┌────────────────────────────────────┐                           ┌─────────────────────────────────────┐
   │     Kubernetes Cluster / Minikube  │                           │   Structured Root Cause Diagnosis   │
   └────────────────────────────────────┘                           └─────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Backend**: Python 3.11, FastAPI, Pydantic v2, Uvicorn, Kubernetes Python SDK
- **AI Engine**: LangChain, OpenAI API / Ollama, Pydantic Output Parser
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React Icons, Recharts
- **DevOps & CI/CD**: Docker, Docker Compose, Kubernetes Manifests (`k8s/`), GitHub Actions (`.github/workflows/ci-cd.yml`)

---

## 📚 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/cluster/health` | `GET` | Retrieve cluster status, pod counts, and health metrics |
| `/api/v1/namespaces` | `GET` | List all Kubernetes namespaces |
| `/api/v1/pods` | `GET` | Filter pods by namespace & status |
| `/api/v1/pods/{ns}/{name}` | `GET` | Detailed specs, environment variables, and events |
| `/api/v1/logs/{pod_name}` | `GET` | Fetch container stdout/stderr log streams |
| `/api/v1/deployments` | `GET` | List deployments and ready replica counts |
| `/api/v1/services` | `GET` | List services, types, and ClusterIPs |
| `/api/v1/nodes` | `GET` | List nodes, CPU & Memory usage percentages |
| `/api/v1/metrics` | `GET` | Time-series CPU and Memory telemetry |
| `/api/v1/ai/analyze` | `POST` | Execute LangChain AI log diagnosis on a pod |
| `/api/v1/ai/summary` | `POST` | Generate AI deployment change summary ("What changed today?") |
| `/api/v1/notifications` | `GET` | Fetch real-time cluster incident alerts |

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
- 🌐 **Web Dashboard UI**: [http://localhost:3000](http://localhost:3000)
- 📚 **FastAPI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

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
pytest

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup (Next.js)

```bash
cd frontend

# Install node dependencies
npm install

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## ☸️ Kubernetes Manifests & Deployment

Deploy KubePilot onto any active Kubernetes cluster using the included manifests:

```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

---

## 🧪 Testing

Run backend API and AI unit tests using `pytest`:

```bash
cd backend
pytest -v
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
