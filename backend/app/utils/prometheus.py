from typing import Dict, Any

def generate_prometheus_metrics(cluster_health: Dict[str, Any]) -> str:
    """Generate Prometheus exposition format metrics string."""
    lines = [
        "# HELP kubepilot_cluster_pods_total Total number of pods tracked in cluster",
        "# TYPE kubepilot_cluster_pods_total gauge",
        f"kubepilot_cluster_pods_total {cluster_health.get('total_pods', 0)}",
        "",
        "# HELP kubepilot_cluster_pods_running Number of running healthy pods",
        "# TYPE kubepilot_cluster_pods_running gauge",
        f"kubepilot_cluster_pods_running {cluster_health.get('running_pods', 0)}",
        "",
        "# HELP kubepilot_cluster_pods_failed Number of failing or crashlooping pods",
        "# TYPE kubepilot_cluster_pods_failed gauge",
        f"kubepilot_cluster_pods_failed {cluster_health.get('failed_pods', 0)}",
        "",
        "# HELP kubepilot_cpu_utilization_percent Average CPU utilization percentage",
        "# TYPE kubepilot_cpu_utilization_percent gauge",
        f"kubepilot_cpu_utilization_percent {cluster_health.get('cpu_utilization_percent', 0.0)}",
        "",
        "# HELP kubepilot_memory_utilization_percent Average Memory utilization percentage",
        "# TYPE kubepilot_memory_utilization_percent gauge",
        f"kubepilot_memory_utilization_percent {cluster_health.get('memory_utilization_percent', 0.0)}",
        "",
        "# HELP kubepilot_active_warnings Total count of active cluster warning alerts",
        "# TYPE kubepilot_active_warnings gauge",
        f"kubepilot_active_warnings {cluster_health.get('active_warnings', 0)}",
    ]
    return "\n".join(lines) + "\n"
