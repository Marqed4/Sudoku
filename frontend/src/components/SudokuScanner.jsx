import { useRef } from 'react'

function SudokuScanner({ setBoard }) {

    const fileInputRef = useRef(null)
    const cameraInputRef = useRef(null)

    const getArrayFromImage = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch('http://localhost:2000/api/get_array_from_image', {
            method: 'POST',
            body: formData
        })

        const data = await response.json()
        
        // Show what the backend is returning.
        console.log("data:", data)
        console.log("array:", data.array)
        
        setBoard(data.array)
    }

    return (
        <div className="scanner-buttons">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={getArrayFromImage}
                style={{ display: 'none' }}
            />
            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraInputRef}
                onChange={getArrayFromImage}
                style={{ display: 'none' }}
            />
            <button className="btn btn-sys-upload" onClick={() => fileInputRef.current.click()}>Upload Puzzle Image</button>
            <button className="btn btn-camera-upload" onClick={() => cameraInputRef.current.click()}>Take Photo of Puzzle</button>
        </div>
    )
}

export default SudokuScanner