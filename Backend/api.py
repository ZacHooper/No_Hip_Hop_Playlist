from flask import Flask, redirect
from flask import request
import requests
from flask_cors import CORS, cross_origin
import spotipy as sp
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
import urllib

from .Config import config
from .noHipHop import hitlist_id, generate_playlist

test_tracklist = [
    'spotify:track:1hcIauR39vnreHqv9scwM2',
    'spotify:track:0d6bZwEAi1XblGRhnzPfgC',
    'spotify:track:6zrKKIQkJbjK5mWRCImFIs'
]

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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

@app.route('/login')
@cross_origin()
def login():
    print(request)
    cred = config.config()
    scope = 'playlist-modify-public user-read-private user-read-email'

    code = request.args.get('code')

    print(code)

    payload = {
        'response_type': 'code',
        'client_id': cred['SPOTIPY_CLIENT_ID'],
        'scope': scope,
        'redirect_uri': cred['SPOTIPY_REDIRECT_URI']
    }

    urlEncodedPayload = urllib.parse.urlencode(payload)    

    
    if code is None:
        print("redirecting")
        return redirect("https://accounts.spotify.com/authorize?" + urlEncodedPayload)
        
    payload2 = {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': cred['SPOTIPY_CLIENT_ID'],
        'client_secret': cred['SPOTIPY_CLIENT_SECRET'],
        'redirect_uri': cred['SPOTIPY_REDIRECT_URI']
    }
    urlEncodedPayload2 = urllib.parse.urlencode(payload2)
    print("redirecting again")
    print(urlEncodedPayload2)
    test = requests.post("https://accounts.spotify.com/api/token", data=payload2)
    if test.ok:
        json = test.json()
        # return {'access_token': json['access_token']}
        return redirect("http://localhost:3000/?code=" + json['access_token'])
        
    return test

    #return redirect("http://localhost:3000/?code=" + code)

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

@app.route('/playlist/replace', methods=['POST'])
@cross_origin()
def update_playlist():
    # token = request.args.get('token')
    # playlist_id = request.args.get('playlist_id')

    data = request.get_json()
    
    spotify = sp.Spotify(client_credentials_manager=SpotifyClientCredentials(), auth=data['token'])
    user = spotify.current_user()

    result = spotify.user_playlist_replace_tracks(user['uri'], data['playlist_id'], data['tracklist']['ok_list'])
    return result

@app.route('/playlist/remove/no_hip_hop')
def create_no_hip_hop_playlist():
    token = request.args.get('token')
    spotify = sp.Spotify(client_credentials_manager=SpotifyClientCredentials(), auth=token)
    
    hitlistID = hitlist_id()
    hitlist = spotify.playlist_tracks(hitlistID)
    
    ok_list = generate_playlist(spotify, hitlist)

    return ok_list