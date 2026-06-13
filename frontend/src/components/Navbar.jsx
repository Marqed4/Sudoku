import { useState, useRef } from "react";

const Navbar = () => {
    return (
        <nav>
            <div className="Navbar-links-container">
                <a href="/How" className="btn2 how-btn">How To Play</a>
                <a href="https://github.com/Marqed4/Sudoku" className="btn2 made-btn">How It's Made</a>
            </div>
        </nav>
    )
}

export default Navbar