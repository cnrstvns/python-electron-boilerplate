import zmq
import signal
from time import sleep
from queue import Queue
from random import choice
from threading import Thread
from json import loads, dumps

statusQueue = Queue()

statusMessages = [
    {"type": "general", "message": "testing"},
    {"type": "taskStatus", "message": "task 1 started"},
    {"type": "taskStatus", "message": "task 2 stopped"}
]

def mainSocket():
    context = zmq.Context()
    socket = context.socket(zmq.PULL)
    socket.bind("tcp://*:7777")

    while True:
        message = loads(socket.recv())
        print(message)

def dataSocket():
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:7778")

    while True:
        message = loads(socket.recv())
        print(message)
        socket.send(dumps({"dataReceived": message}).encode())

def statusSocket():
    context = zmq.Context()
    socket = context.socket(zmq.PUSH)
    socket.bind("tcp://*:7779")

    while True:
        status = statusQueue.get()
        socket.send_json(status)

if __name__ == "__main__":

    signal.signal(signal.SIGINT, signal.SIG_DFL)

    Thread(target = mainSocket).start()
    Thread(target = dataSocket).start()
    Thread(target = statusSocket).start()

    while True:
        statusQueue.put(choice(statusMessages))
        sleep(5)