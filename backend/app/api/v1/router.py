from fastapi import APIRouter
from app.api.v1.endpoints import cluster, pods, deployments, services, nodes, metrics, ai, notifications

api_router = APIRouter()

api_router.include_router(cluster.router, tags=["Cluster Health"])
api_router.include_router(pods.router, tags=["Pods & Logs"])
api_router.include_router(deployments.router, tags=["Deployments"])
api_router.include_router(services.router, tags=["Services"])
api_router.include_router(nodes.router, tags=["Nodes"])
api_router.include_router(metrics.router, tags=["Metrics"])
api_router.include_router(ai.router, tags=["AI Log Analyzer & Summaries"])
api_router.include_router(notifications.router, tags=["Notifications"])
