from django.shortcuts import render
from django.http import HttpResponse
import os
from django.http import JsonResponse
from django.conf import settings

import chess.engine

from utils.chess_engine import Engine

STOCKFISH_PATH = os.path.join(settings.BASE_DIR, "stockfish-windows-x86-64-avx2.exe")


def get_move(request, depth, fen):
    # print(depth)
    print("Calculating...")
    engine = Engine(fen)
    move = engine.iterative_deepening(depth - 1)
    # print("Move found!", move)
    # print()
    return HttpResponse(move)


def test_get(request, tester):
    return HttpResponse(tester)


def evaluate_position(request, depth, fen):
    try:        
        # Initialize the Stockfish engine
        with chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH) as engine:
            # Create a board from the given FEN string
            board = chess.Board(fen)

            # Perform the analysis
            result = engine.play(board, chess.engine.Limit(depth=int(depth)))
            evaluation = engine.analyse(board, chess.engine.Limit(depth=int(depth)))

            # Extract the best move and evaluation score
            best_move = result.move.uci()
            score = evaluation["score"].relative.score(mate_score=10000)  # Score centipawns or mate

            return JsonResponse({
                "best_move": best_move,
                "evaluation": score 
            })

    except Exception as e:
        print(f"the erros is {e}")
        return JsonResponse({"error": str(e)}, status=500)
    

    
