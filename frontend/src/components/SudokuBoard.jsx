function SudokuBoard({ board, clues, hintCells, onCellChange }) {

    if (!board) return null

    return (
        <div className="sudoku-board">
            {board.map((row, rowIndex) => (
                row.map((cell, colIndex) => {
                    const boxRow = Math.floor(rowIndex / 3)
                    const boxCol = Math.floor(colIndex / 3)
                    const isOrange = (boxRow + boxCol) % 2 === 0
                    const isClue = clues?.[rowIndex]?.[colIndex] ?? false
                    const isHint = hintCells?.[rowIndex]?.[colIndex] ?? false

                    return (
                        <input
                            key={`${rowIndex}-${colIndex}`}
                            className={`sudoku-cell
                                ${isOrange ? 'cell-orange' : 'cell-white'}
                                ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-right' : ''}
                                ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-bottom' : ''}
                                ${isClue ? 'cell-clue' : ''}
                                ${isHint ? 'cell-hint' : ''}
                            `}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={cell === '.' ? '' : cell}
                            readOnly={isClue || isHint}
                            onChange={(e) => {
                                const val = e.target.value

                                // Only allow 1-9 or empty
                                if (val === '' || /^[1-9]$/.test(val)) {
                                    onCellChange(rowIndex, colIndex, val === '' ? '.' : val)
                                }
                            }}
                        />
                    )
                })
            ))}
        </div>
    )
}

export default SudokuBoard