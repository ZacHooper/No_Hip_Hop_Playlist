from flask import Flask
from flask import request
import spotipy as sp
from spotipy.oauth2 import SpotifyClientCredentials

from .Config import config
from .noHipHop import hitlist_id, generate_playlist

test_tracklist = [
    'spotify:track:1hcIauR39vnreHqv9scwM2',
    'spotify:track:0d6bZwEAi1XblGRhnzPfgC',
    'spotify:track:6zrKKIQkJbjK5mWRCImFIs'
]

app = Flask(__name__)

@app.route('/')
def home():
  username = '1260769471'
  scope = 'playlist-modify-public'
  token = sp.util.prompt_for_user_token(username, scope)
  
  birdy_uri = 'spotify:artist:2WX2uTcsvV5OnS0inACecP'
  spotify = sp.Spotify(client_credentials_manager=SpotifyClientCredentials(), auth=token)

  results = spotify.artist_albums(birdy_uri, album_type='album')
  albums = results['items']
  while results['next']:
      results = spotify.next(results)
      albums.extend(results['items'])

  print(token)

  return results

@app.route('/user/get')
def get_user():
    token = request.args.get('token')
    spotify = sp.Spotify(client_credentials_manager=SpotifyClientCredentials(), auth=token)
    user = spotify.current_user()
    return user
    

@app.route('/playlist/clean/')
def clean_playlist():
    token = request.args.get('token')
    playlist_id = request.args.get('playlist_id')

    spotify = sp.Spotify(client_credentials_manager=SpotifyClientCredentials(), auth=token)

    user = spotify.current_user()
    
    current_playlist = spotify.playlist_tracks(playlist_id)
    current_songs = [item['track']['id'] for item in current_playlist['items']]
    result = spotify.user_playlist_remove_all_occurrences_of_tracks(user['uri'], playlist_id, current_songs)
    return {'token': token, 'playlist_id': playlist_id, 'result': result}

@app.route('/playlist/replace/')
def update_playlist():
    token = request.args.get('token')
    playlist_id = request.args.get('playlist_id')
    
    spotify = sp.Spotify(client_credentials_manager=SpotifyClientCredentials(), auth=token)
    user = spotify.current_user()

    result = spotify.user_playlist_replace_tracks(user['uri'], playlist_id, test_tracklist)
    return result

@app.route('/playlist/remove/no_hip_hop')
def create_no_hip_hop_playlist():
    token = request.args.get('token')
    spotify = sp.Spotify(client_credentials_manager=SpotifyClientCredentials(), auth=token)
    
    hitlistID = hitlist_id()
    hitlist = spotify.playlist_tracks(hitlistID)
    
    ok_list = generate_playlist(spotify, hitlist)

    return ok_list