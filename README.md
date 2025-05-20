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
   ```
   python app.py
   ```
4. Open your browser and navigate to `http://127.0.0.1:5000`

## Project Structure

- `app/`: Main application directory
  - `templates/`: HTML templates
  - `static/`: Static files (CSS, JavaScript, images)
  - `data/`: Quiz question data
- `app.py`: Entry point for the application

## License

This project is licensed under the MIT License.
