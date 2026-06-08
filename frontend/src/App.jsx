import Navbar from './components/Navbar'
import './components/Navbar.css'

import SudokuScanner from './components/SudokuScanner'

import SudokuBoard from './components/SudokuBoard'
import './components/SudokuBoard.css'

import { useState } from 'react'

import './App.css'

const emptyBoard = Array(9).fill(null).map(() => Array(9).fill('.'))

function StatusBadge({ result }) {
    if (result === null) return null
    return (
        <div className={`status-badge ${result ? 'solvable' : 'unsolvable'}`}>
            {result ? 'Solvable' : 'Unsolvable'}
        </div>
    )
}

function App() {
    const [board, setBoard] = useState(() => {
    const saved = localStorage.getItem('sudoku-board')
    return saved ? JSON.parse(saved) : null
    })
    const [clues, setClues] = useState(() => {
    const saved = localStorage.getItem('sudoku-clues')
    return saved ? JSON.parse(saved) : null
    })
    const [canBeSolved, setCanBeSolved] = useState(null)
    

    const isValid = async () => {
        if (!board) return alert("Please upload or generate a puzzle first")
        const response = await fetch('http://localhost:2000/api/is_valid_sudoku', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ board })
        })
        const data = await response.json()
        setCanBeSolved(data.is_valid)
    }

    const solveSudoku = async () => {
        if (!board) return alert("Please upload or generate a puzzle first")
        const response = await fetch('http://localhost:2000/api/solve_sudoku', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ board })
        })
        const data = await response.json()
        updateBoard(data.solved_board)
    }

    const generateSudoku = async () => {
        const response = await fetch('http://localhost:2000/api/generate_random_sudoku_puzzle', {
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

    // Wrap updateBoard to also update clues
    const loadPuzzle = (newBoard) => {
        updateBoard(newBoard)
        setClues(newBoard.map(row => row.map(cell => cell !== '.')))
        localStorage.setItem('sudoku-clues', JSON.stringify(
            newBoard.map(row => row.map(cell => cell !== '.'))
        ))
        setCanBeSolved(null)
    }

    // TODO:
    // http://localhost:2000/api/give_test_puzzle
    // http://localhost:2000/api/give_solves_test_puzzle

    return (
    <>
        <Navbar/>
        <div className="app-container">
            <p className="app-eyebrow">Puzzle Solver</p>
            <h1 className="app-title">SUDOKU</h1>

            <div className="board-layout">
                {/* Upload / camera buttons on the left */}
                <div className="side-panel side-left">
                    <SudokuScanner setBoard={loadPuzzle} />
                </div>

                <SudokuBoard board={board ?? emptyBoard} clues={clues} onCellChange={updateCell} />

                {/* Validate, solve, generate on the right */}
                <div className="side-panel side-right">
                    <button className="btn btn-ghost" onClick={generateSudoku}>Generate</button>
                    <button className="btn" onClick={isValid}>Validate</button>
                    {/* Once solved, empty/wrong cells are filled in place */}
                    <button className="btn btn-primary" onClick={solveSudoku}>Solve</button>
                    <StatusBadge result={canBeSolved} />
                </div>
            </div>
        </div>
    </>
    )
}

export default App