from django.shortcuts import render
from django.http import HttpResponse

from utils.chess_engine import Engine


def get_move(request, depth, fen):
    print(depth)
    print("Calculating...")
    # Assuming `Engine` is imported and available
    engine = Engine(fen)
    move = engine.iterative_deepening(depth - 1)
    print("Move found!", move)
    print()
    return HttpResponse(move)


def test_get(request, tester):
    return HttpResponse(tester)