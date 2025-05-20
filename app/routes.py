from flask import Blueprint, render_template, jsonify, send_from_directory
import json
import os

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/fill-blank')
def fill_blank():
    return render_template('fill_blank.html')

@bp.route('/mcq')
def mcq():
    return render_template('mcq.html')

@bp.route('/memory')
def memory():
    return render_template('memory.html')

@bp.route('/api/questions')
def get_questions():
    # Load questions from JSON file
    questions_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app', 'data', 'questions.json')
    with open(questions_file, 'r') as f:
        questions = json.load(f)
    return jsonify(questions)

@bp.route('/static/js/questions.json')
def questions_js():
    # Serve the questions JSON for direct access from JavaScript
    return send_from_directory(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app', 'data'), 'questions.json')
