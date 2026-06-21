import copy
# Importing copy because SudokuSolution.solve_board() 
# is altering the board object in the heap and comparisons will never work.
import random
from typing import List
from SudokuSolutions import SudokuSolutions

class Hints:
    
    '''
    NOTE:
    Preferably the function in main will check if the 
    board is valid before this function is called.
    
    TODO:
    Return the board with alterations/hints in red on the frontend.
    
    Easy: Solve the board, note all the changes in the 
    board and return n changes to the original board.
    
    @Refactor maybe.
    Hard: Somehow choose n = how_many_hints coordinates on the sudoku board. 
    Return the correct hints for those values.
    But how do you do that without solving the entire board?
    '''
     
    @staticmethod
    # Currently easy implementation.
    def get_hint(board: List[List[str]], how_many_hints: int) -> List:
        # Deep copy gives aux_board it's own object on the heap.
        aux_board = copy.deepcopy(board)
        difference = []
        hint_locations = []
        
        '''
        High coupling because get_hint depends on solve_sudoku.
        CISC 3171: Low coupling, high cohesion.
        '''
        solved_board = SudokuSolutions.solve_sudoku(aux_board)
        
        for v in range(len(board)):
            for k in range(len(board[0])):
                if solved_board[v][k] != board[v][k]:
                    # Append a differenced tuple to the list.
                    difference.append((v, k, solved_board[v][k]))
        
        # We can can't try to give more hints than we have.
        how_many_hints = min(how_many_hints, len(difference))
        
        # Randomly select x unique hints from 
        # difference between solved and unsolved boards.
        hints_to_apply = random.sample(difference, how_many_hints)
        
        # Apply the hints to the unsolved board 
        # using valid 2D list syntax
        for row, col, correct_value in hints_to_apply:
            board[row][col] = correct_value
            hint_locations.append((row, col))
        
        # See the hints and the locations.
        '''
        1. Hints unapplied
        2. Hints updated in board
        3. Locations of hints that were applied.
        '''
        # For debugging
        print("What:",hints_to_apply)
        print("Shape:",board)
        print("Where:",hint_locations)
        
        # Return the board with the hints applied, and the locations of the hints.
        return board, hint_locations
    
    