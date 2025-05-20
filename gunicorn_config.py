# Gunicorn configuration file
import multiprocessing

# Basic configuration
bind = "0.0.0.0:$PORT"  # Bind to the port Render assigns via environment variable
workers = multiprocessing.cpu_count() * 2 + 1  # Recommended number of workers
worker_class = "sync"  # Use synchronous workers
timeout = 120  # Worker timeout in seconds (increased for Render)
keepalive = 5  # Seconds to keep idle connections
preload_app = True  # Preload application code before worker processes are forked

# Logging - use stdout/stderr for Render to capture logs
accesslog = "-"  # Log to stdout
errorlog = "-"  # Log to stderr
loglevel = "info"

# Security and performance
limit_request_line = 4096  # Limit request line to prevent attacks
limit_request_fields = 100  # Limit request fields
