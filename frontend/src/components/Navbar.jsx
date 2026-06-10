import { useState, useRef } from "react";

const Navbar = () => {
    return (
        <nav>
            <div className="Navbar-links-container">
                <a href="/" className="home-btn">Home</a>
                <a href="/How" className="how-btn">How</a>
                <a href="https://github.com/Marqed4/Sudoku" className="made-btn">Made</a>
            </div>
        </nav>
    )
}

export default Navbar