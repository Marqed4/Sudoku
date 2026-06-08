from google.genai import types
from dotenv import load_dotenv
from typing import List
from google import genai
from pathlib import Path
from PIL import Image
import json
import os

class ImageToArray:
    # puzzle_img is a Image object, that is sent to Gemini with a text prompt.
    # A JSON array is returned in .text format.
    def get_array_from_image(puzzle_img: Image) -> List[List[int]]:
        
        # Environment variable pathway.
        env_path = Path(__file__) / ".env"
        load_dotenv(dotenv_path = env_path)
        
        api_key = os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key = api_key)

        image = puzzle_img
        
        # Directions TL;DR Scan sudoku puzzle, return 9x9 JSON array.
        prompt = ("Scan this sudoku puzzle and return ONLY a 9x9 JSON array."
        "Use '.' for empty cells. No explanation,"
        "no markdown, just the raw JSON array.")
        
        response = client.models.generate_content(
            # Supports: png, jpeg, webp, heic, heif
            # Preferably using gemini 1.5, anything that
            # uses the least amount of tokens.
            
            # For some reason 2.0 never works, use gemini-2.5-flash-
            model    = "gemini-2.5-flash",
            contents = [prompt, image],
            config   = types.GenerateContentConfig(
                response_modalities = ["TEXT"]
            )
        )
        
        # Print Gemini's response.
        raw = response.text
        print("RAW RESPONSE:", repr(raw))
        
        array = json.loads(raw)
        return array