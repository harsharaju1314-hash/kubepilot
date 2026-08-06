import urllib.request
import json

def get(url):
    req = urllib.request.urlopen(url)
    return json.loads(req.read().decode('utf-8'))

def post(url, data):
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(req).read().decode('utf-8'))

def run_demo():
    print("==================================================")
    print("       KUBEPILOT AI OPERATIONS PLATFORM DEMO      ")
    print("==================================================")

    print("\n--- 1. GET /api/v1/cluster/health ---")
    health = get('http://127.0.0.1:8000/api/v1/cluster/health')
    print(json.dumps(health, indent=2))

    print("\n--- 2. GET /api/v1/pods ---")
    pods = get('http://127.0.0.1:8000/api/v1/pods')
    print(f"Total Pods: {len(pods)}")
    for p in pods:
        print(f" - [{p['namespace']}] {p['name']} -> Status: {p['status']} (Restarts: {p['restart_count']})")

    print("\n--- 3. POST /api/v1/ai/analyze (AI Root Cause Diagnosis) ---")
    ai_analysis = post('http://127.0.0.1:8000/api/v1/ai/analyze', {
        'pod_name': 'payment-service-75b897858-a912b',
        'namespace': 'production'
    })
    print(json.dumps(ai_analysis, indent=2))

    print("\n--- 4. POST /api/v1/ai/summary (Deployment Change Log) ---")
    summary = post('http://127.0.0.1:8000/api/v1/ai/summary', {'timeframe': '24h'})
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    run_demo()
