import os

os.environ["SPOTIPY_CLIENT_ID"] = "9fb9fff1e07a473fb8b44cd9a2f83820"
os.environ["SPOTIPY_CLIENT_SECRET"] = "c73368468cf04deea9dc3f25bb82d08e"
os.environ["SPOTIPY_REDIRECT_URI"] = "http://localhost:5000/login"

def config():
  return {
    "SPOTIPY_CLIENT_ID": '9fb9fff1e07a473fb8b44cd9a2f83820',
    'SPOTIPY_CLIENT_SECRET': 'c73368468cf04deea9dc3f25bb82d08e',
    'SPOTIPY_REDIRECT_URI': 'http://localhost:5000/login'
  }