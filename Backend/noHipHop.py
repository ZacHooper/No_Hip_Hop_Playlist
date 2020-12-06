import fnmatch
import csv

def hitlist_id():
  return '7vFQNWXoblEJXpbnTuyz76'

def check_genre(artist_genres):
    banned_genres = ['hip hop', 'rap', 'trap']
    count = 0 #Counts how many matches there has been

    if artist_genres == []:
        return -1

    for genre in banned_genres:
        filtered = fnmatch.filter(artist_genres, '* ' + genre + '*')
        count += len(filtered)

    if len(artist_genres) != count & count <= 1:
        return True
    else:
        return False

def get_artist_genres(spotify, artist_id):
    artist = spotify.artist(artist_id)
    return artist['genres']

def generate_playlist(spotify, hitlist):
  with open('hitlist.csv', 'w') as csvfile:
        spamwriter = csv.writer(csvfile, delimiter=',',
                                        quotechar='|', quoting=csv.QUOTE_MINIMAL)
        spamwriter.writerow(['Track', 'Artist', 'Genre', 'Genre Status'])
        
        ok_list = []

        for item in hitlist['items']:
            track_name = item['track']['name']
            track_id = item['track']['id']
            artist_name = item['track']['artists'][0]['name']
            artist_id = item['track']['artists'][0]['id']
            artist_genres = get_artist_genres(spotify, artist_id)
            genre_status = check_genre(artist_genres)

            if not genre_status:
                print("REMOVED____Track: {} -- Artist: {} -- Genre: {} -- Genre Status: {}".format(track_name, artist_name, artist_genres, genre_status))
                spamwriter.writerow([track_name, artist_name, artist_genres, genre_status])
                continue

            ok_list.append(track_id)
  return {'ok_list': ok_list}