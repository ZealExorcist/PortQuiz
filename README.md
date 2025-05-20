# Security+ Ports & Protocols Quiz App

A web-based study application designed to help users memorize key ports and protocols for the CompTIA Security+ exam.

## Features

- **Fill-in-the-Blank Quiz**: Test your knowledge by typing in the correct port or protocol.
- **Multiple Choice Quiz**: Select the correct port or protocol from a list of options.
- **Memory Match Game**: Match ports with their protocols in a memory game.
- **Two Quiz Variations**: 
  - Identify the protocol from a port number
  - Identify the port number from a protocol name
- **Optional Hints/Mnemonics**: Get helpful memory aids when you need them.
- **Local Score Tracking**: Keep track of your progress across sessions.
- **Two-Player Mode**: Practice with a friend on the same device.

## Getting Started

### Prerequisites

- Python 3.x
- Flask

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the application:

   **Development mode**:
   ```
   python app.py
   ```

   **Production mode** (with Gunicorn):
   ```
   gunicorn wsgi:application
   ```

4. Open your browser and navigate to `http://127.0.0.1:5000` for development or `http://127.0.0.1:8000` for Gunicorn

## Deployment

### Deploying to Render

This application is configured to deploy easily to [Render](https://render.com/):

1. Push your code to GitHub
2. In Render dashboard, click "New" and select "Web Service"
3. Connect your GitHub repository
4. Select the branch you want to deploy
5. Use the following settings:
   - **Name**: security-ports-quiz (or your preferred name)
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn wsgi:application`
6. Click "Create Web Service"

The application includes `render.yaml` for [Render Blueprint](https://render.com/docs/infrastructure-as-code) deployments.

## Project Structure

- `app/`: Main application directory
  - `templates/`: HTML templates
  - `static/`: Static files (CSS, JavaScript, images)
  - `data/`: Quiz question data
- `app.py`: Entry point for development
- `wsgi.py`: WSGI entry point for Gunicorn/production
- `Procfile`: Deployment configuration for Render
- `render.yaml`: Render Blueprint configuration

## License

This project is licensed under the MIT License.
