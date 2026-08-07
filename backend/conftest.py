import os
import sys

# Ensure backend root directory is in sys.path for test runners (Pytest, CI/CD)
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
