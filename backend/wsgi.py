import os
import sys
from pathlib import Path

from django.core.wsgi import get_wsgi_application

# Ensure project root on path when served by WSGI server
sys.path.append(str(Path(__file__).resolve().parent.parent))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

application = get_wsgi_application()
