import os

class Settings:
    PROJECT_NAME: str = "KubePilot API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # OpenAI & LangChain
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    
    # Kubernetes config
    KUBE_CONFIG_PATH: str = os.getenv("KUBE_CONFIG_PATH", "~/.kube/config")
    USE_SIMULATOR: bool = os.getenv("USE_SIMULATOR", "true").lower() == "true"

settings = Settings()
