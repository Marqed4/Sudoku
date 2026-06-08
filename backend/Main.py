from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from PIL import Image
import traceback
import json
import os
from SudokuSolutions import SudokuSolutions
from CreateNewBoard import CreateNewBoard, SudokuGenerator
from ImageToArray import ImageToArray

# Backend uses 2000
# Frontend uses 2001
# Frontend uses 2002

app = Flask(__name__, static_folder = '../frontend/dist', static_url_path='')
CORS(app, origins=["http://localhost:2001"])

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

# <---- Game Logic ---->

# Determine if puzzle is solvable.
@app.route('/api/is_valid_sudoku', methods = ['POST'])
def is_valid_sudoku():
    data = request.get_json()
    if data is None:
        return jsonify({ "error": "No JSON body received" }), 400
    board = data['board']
    result = SudokuSolutions.is_valid_sudoku(board)
    return jsonify({ "is_valid": result })

# Determine solution to puzzle.
@app.route('/api/solve_sudoku', methods = ['POST'])
def solve_sudoku():
    data = request.get_json()
    if data is None:
        return jsonify({ "error": "No JSON body received" }), 400
    board = data['board']
    result = SudokuSolutions.solve_sudoku(board)
    return jsonify({ "solved_board": result })

# <---- New Game ---->

# Generate random sudoku problem.
@app.route('/api/generate_random_sudoku_puzzle', methods = ['GET'])
def generate_random_sudoku_puzzle():
    array = CreateNewBoard.generate_ranodom_sudoku_puzzle()
    return jsonify({ "array": array })

# <---- Test Functions ---->

# Retrieve default unsolved test sudoku problem.
@app.route('/api/give_test_puzzle', methods = ['GET'])
def give_test_puzzle():
    array = CreateNewBoard.give_test_puzzle
    return jsonify({ "array": array })

# Retrieve default solved test sudoku problem.
@app.route('/api/give_solves_test_puzzle', methods = ['GET'])
def give_solves_test_puzzle():
    array = CreateNewBoard.give_solves_test_puzzle()
    return jsonify({ "array": array })

# <---- Image Scanner ---->

# Turn an image object into an array.
@app.route('/api/get_array_from_image', methods = ['POST'])
def get_array_from_image():
    if 'image' not in request.files:
        return jsonify({ "error": "No image received" }), 400
    
    file = request.files['image']

    try:
        image = Image.open(file.stream)
        image.load()
        array = ImageToArray.get_array_from_image(image)
        return jsonify({ "array": array })
    except Exception as e:
        traceback.print_exc()
        return jsonify({ "error": str(e) }), 500

if __name__ == '__main__':
    app.run(debug=True, port=2000)