import SudokuScanner from './components/SudokuScanner'
import './components/SudokuScanner.css'

import SudokuBoard from './components/SudokuBoard'
import './components/SudokuBoard.css'

import { useState, useEffect } from 'react'

import './App.css'
import './DirectionsBoard.css'

// < ---- Display ---->
const emptyBoard = Array(9).fill(null).map(() => Array(9).fill('.'))

// Safely read and parse a value 
// from localStorage, clearing it if corrupted
function loadFromStorage(key) {
    const saved = localStorage.getItem(key)
    if (!saved || saved === 'undefined') {
        return null
    }

    try {
        return JSON.parse(saved)
    } catch (error) {
        localStorage.removeItem(key)
        return null
    }
}

function StatusBadge({ result1, result2, onResult1Expire, onResult2Expire}) {
    console.log('result1:', result1, 'result2:', result2)

    useEffect(() => {
        if (result1 !== null) {
            const timer = setTimeout(() => {
                onResult1Expire()
            }, 15000)
            return () => clearTimeout(timer)
        }
    }, [result1])

    useEffect(() => {
        if (result2 !== null) {
            const timer = setTimeout(() => {
                onResult2Expire()
            }, 15000)
            return () => clearTimeout(timer)
        }
    }, [result2])

    return (
        <>
            {result1 !== null && (
                <div className={`status-badge validity ${result1 ? 'solvable' : 'unsolvable'}`}>
                    {result1 ? 'Unadulterated board is solvable' : 'Unadulterated board unsolvable'}
                </div>
            )}
            {result2 !== null && (
                <div className={`status-badge validity ${result2 ? 'correct' : 'incorrect'}`}>
                    {result2 ? 'Board Solution Is Correct' : 'Board Solution Is Incorrect'}
                </div>
            )}
        </>
    )

    return null
}

function App() {

    const [board, setBoard] = useState(() => loadFromStorage('sudoku-board'))
    const [originalBoard, setOriginalBoardState] = useState(() => loadFromStorage('original-sudoku-board'))
    const [clues, setClues] = useState(() => loadFromStorage('sudoku-clues'))
    const [hintCells, setHintCells] = useState(() => loadFromStorage('sudoku-hint-cells'))

    const [canBeSolved, setCanBeSolved] = useState(null)
    const [correctSolution, setCorrectSolution] = useState(null)
    const [hints, setHints] = useState(1)
    
// <---- Game Logic ---->

    const isValid = async () => {
        if (!originalBoard) return alert("Please upload or generate a puzzle first")
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/is_valid_sudoku`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalBoard })
        })
        const data = await response.json()
        console.log(data.is_valid)
        setCanBeSolved(data.is_valid)
    }

    // Can be used to take board + adulturations and see if 
    // board is solvable, way to cheat
    const solveSudoku = async () => {
        if (!originalBoard) return alert("Please upload or generate a puzzle first")
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/solve_sudoku`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalBoard })
        })
        const data = await response.json()
        updateBoard(data.solved_board)
    }

    // Duplicated Code
    // Solve the puzzle but don't update the board
    const solveOriginalBoard = async () => {
        if (!originalBoard) return alert("Please upload or generate a puzzle first")
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/solve_sudoku`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalBoard })
        })
        const data = await response.json()
        return data.solved_board
    }

    // How do you pass the orginal board and an integer value
    const getHint = async () => {
    if (!originalBoard) return alert("Please upload or generate a puzzle first")

        console.table(board)
        console.log(hints)

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get_hint`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({ board, hints })
        })
        const data = await response.json()
        console.table(data.board)
        updateBoard(data.board)

        // Build a 9x9 boolean grid from the list of (row, col, value) hint tuples
        const newHintCells = Array(9).fill(null).map(() => Array(9).fill(false))
        data.hint_locations.forEach(([row, col, value]) => {
            newHintCells[row][col] = true
        })
        
        let savedHintCells = JSON.parse(localStorage.getItem('sudoku-hint-cells'));
        
        // User never used hints for this puzzle, build blank matrix.
        if (!savedHintCells) {
            savedHintCells = Array.from({ length: 9 }, () => Array(9).fill(false))
        }

        // Merge the array of old hints w/ new hints.
        for (let i = 0; i < 9; i++){
            for (let o = 0; o < 9; o++){
                if (newHintCells[i][o] === true){
                    savedHintCells[i][o] = true;
                }
            }
        }

        console.table(savedHintCells) // Used to print matrix
        localStorage.setItem('sudoku-hint-cells', JSON.stringify(savedHintCells))

        // Apply to puzzle board.
        setHintCells(savedHintCells)
    }

    // Return solved board state & original board state (clues - board)
    const testBoardCorrect = async () => {
        const solved_board = await solveOriginalBoard()
        console.log(solved_board)
        console.log(board)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/is_board_state_correct`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ solved_board, board })

        })
        const data = await response.json()
        console.log(data.result)
        return setCorrectSolution(data.result)
    }

    // <---- New Game ---->

    const generateSudoku = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate_random_sudoku_puzzle`, {
            method: 'GET'
        })
        const data = await response.json()
        loadPuzzle(data.array)
        setCanBeSolved(null)
    }

    // Update a single cell and save to localStorage
    const updateCell = (row, col, val) => {
        const newBoard = board.map((r, ri) =>
            r.map((c, ci) => ri === row && ci === col ? val : c)
        )
        updateBoard(newBoard)
    }

    // Wrap setBoard so every update also saves to localStorage
    const updateBoard = (newBoard) => {
        setBoard(newBoard)
        if (newBoard === null) {
            localStorage.removeItem('sudoku-board')
        } else {
            localStorage.setItem('sudoku-board', JSON.stringify(newBoard))
        }
    }

    const setOriginalBoard = (newBoard) => {
        setOriginalBoardState(newBoard)
        if (newBoard === null) {
            localStorage.removeItem('original-sudoku-board')
        } else {
            localStorage.setItem('original-sudoku-board', JSON.stringify(newBoard))
        }
    }

    // Wrap updateBoard to also update clues
    const loadPuzzle = (newBoard) => {
        updateBoard(newBoard)
        setClues(newBoard.map(row => row.map(cell => cell !== '.')))
        localStorage.setItem('sudoku-clues', JSON.stringify(
            newBoard.map(row => row.map(cell => cell !== '.'))
        ))
        setOriginalBoard(newBoard)
        setCanBeSolved(null)
        setHintCells(null)
        localStorage.removeItem('sudoku-hint-cells')
    }

    // Save your work as an image!
    // print(data.is_valid)

    // TODO:
    // http://localhost:2000/api/give_test_puzzle
    // http://localhost:2000/api/give_solves_test_puzzle

    return (
        <>
            <div className="app-container">
                <h1 className="app-title">SUDOKU</h1>

                {/* Upload / camera buttons above the board */}
                <SudokuScanner setBoard={loadPuzzle} />

                <div className="board-layout">

                    {/* Left - how to play */}
                    <div className="wrd directions-board">
                        <h2><u>How 2 Play</u>❓</h2>
                        <div className="divider" />
                        <p>Upload or take a photo of your Sudoku puzzle.</p>
                        <p>The board will populate automatically.</p>
                        <p>Use the buttons below to solve, test, validate, or generate a new puzzle.</p>
                    </div>

                    {/* left - center hint button/selector */}
                    <div>
                        <button className="btn btn-hint" onClick={getHint}>Get Hint💡</button>
                        <select id="number-select" value={hints} onChange={(e) => setHints(Number(e.target.value))}>How many hints?
                            <option value="1" data-hint="1">Hints: 1</option>
                            <option value="2" data-hint="2">Hints: 2</option>
                            <option value="3" data-hint="3">Hints: 3</option>
                            <option value="4" data-hint="4">Hints: 4</option>
                            <option value="5" data-hint="5">Hints: 5</option>
                        </select>
                    </div>

                    {/* Center - the board */}
                    <SudokuBoard board={board ?? emptyBoard} clues={clues} hintCells={hintCells} onCellChange={updateCell} />

                    {/* Right - tips & tricks */}
                    <div className="wrd recommendations-board">
                        <h2><u>Tips & Tricks</u>🫡</h2>
                        <div className="divider" />
                        <p>Start with rows, columns, or boxes that have the most clues.</p>
                        <p>If a number can only go in one cell in a row, it must go there.</p>
                        <p>Eliminate candidates by scanning each row, column, and 3×3 box.</p>
                    </div>
                </div>

                {/* Generate, Ask Solve, Manual Solution, Auto Solve */}
                <div className="board-actions">
                    <div className="side-panel side-left">
                        {/* Generate New Puzzles */}
                        <button className="btn btn-generate" onClick={generateSudoku}>Generate New Puzzle</button>
                        {/* Tests if board can be solved */}
                        <button className="btn btn-validate" onClick={isValid}>Can Be Solved?</button>
                    </div>
                    <div className="side-panel side-right">
                        {/* Tests if user input is correct */}
                        <button className="btn btn-manual" onClick={testBoardCorrect}>Test My Solution</button>
                        {/* Once solved, empty/wrong cells are filled in place */}
                        <button className="btn btn-automatic" onClick={solveSudoku}>Solve For Me</button>
                    </div>
                </div>
                <div className="status-row">
                    <h2 className="status-badge">
                    <StatusBadge 
                    result1={canBeSolved}
                    result2={correctSolution}
                    onResult1Expire={() => setCanBeSolved(null)}
                    onResult2Expire={() => setCorrectSolution(null)}
                    />
                    </h2>
                </div>
            </div>
        </>
    )
}

export default App