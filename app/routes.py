from flask import Blueprint, render_template

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
