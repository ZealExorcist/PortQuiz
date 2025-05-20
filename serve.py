# Production server using Waitress (works on Windows)
from waitress import serve
from app import create_app
import os

# Create the Flask application instance
app = create_app()

# Configuration
PORT = int(os.environ.get("PORT", 8000))
HOST = os.environ.get("HOST", "0.0.0.0")

if __name__ == "__main__":
    print(f"Starting Waitress server on {HOST}:{PORT}...")
    print("Visit http://localhost:8000 to access the application")
    serve(app, host=HOST, port=PORT, threads=4)
