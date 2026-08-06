from typing import List, Dict, Any
from fastapi import APIRouter
from app.services.kubernetes.k8s_service import k8s_service

router = APIRouter()

@router.get("/notifications")
def get_notifications() -> List[Dict[str, Any]]:
    """Retrieve real-time cluster notifications, warning alerts, and crash updates."""
    events = k8s_service.get_events()
    notifications = []
    for evt in events:
        notifications.append({
            "id": evt["id"],
            "title": f"Alert: {evt['reason']} in {evt['object']}",
            "message": evt["message"],
            "severity": "warning" if evt["type"] == "Warning" else "info",
            "timestamp": evt["timestamp"],
            "namespace": evt["namespace"]
        })
    return notifications
