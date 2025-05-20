# WSGI entry point for Gunicorn
import os
from app import create_app

# Create the Flask application instance
application = create_app()
app = application  # Some platforms look for 'app' instead of 'application'

# This allows running the file directly
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    application.run(host="0.0.0.0", port=port)
