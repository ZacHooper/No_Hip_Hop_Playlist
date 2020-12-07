import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Card from "../components/card"

export default function Home() {
  const router = useRouter()

  const [token, setToken] = useState(undefined)
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState({})
  const [playlistID, setPlaylistID] = useState('')

  const [card1Loading, setCard1Loading] = useState(false)
  const [card3Loading, setCard3Loading] = useState(false)
  const [card4Loading, setCard4Loading] = useState(false)

  // Set token from 'code' param URL
  useEffect(() => {
    setToken(router.query.code),
    typeof token === 'undefined' ? setLoggedIn(false) : setLoggedIn(true)
  })

  const checkToken = () => {
    console.log(token);
  }

  const getUser = async () => {
    setCard1Loading(true)
    const res_user = await fetch(`http://localhost:5000/user/get?token=${token}`)
    if (res_user) {
      setCard1Loading(false)
    }
    const user = await res_user.json()
    setUser(user)
    console.log(user);
        /*
      First check if the user has the playlist yet
    */
    const res_userPlaylists = await fetch(`http://localhost:5000/user/playlist/list?token=${token}`)
    const userPlaylists = await res_userPlaylists.json()

    for (var i = 0; i < userPlaylists.items.length - 1; i++) {
      let playlist = userPlaylists.items[i]
      if (playlist.name === 'Triple J (no hip hop) Hitlist') {
        setPlaylistID(playlist)
        break;
      }
    }
  }

  /**
   * This will remove all the songs currently stored in the playlist.
   */
  const handleCleanPlaylist = async () => {
    setCard4Loading(true)
    const cleanPlaylist = await fetch(`http://localhost:5000/playlist/clean?token=${token}&playlist_id=1ahh5eiX08eeiKxxXqZlPp`)
    if (cleanPlaylist) {
      setCard4Loading(false)
    }
    console.log(cleanPlaylist);
  }

  /**
   * This will create the No Hip Hop Playlist. 
   * It will check if the user currently has the playlist and if not create the playlist.
   * It will then hit the endpoint to generate the playlist without the hip hop tracks in it.
   * Finally it will then hit the endpoint to add the tracks to the playlist.
   * 
   */
  const handleCreatePlaylist = async () => {
    setCard3Loading(true) // set the loading symbol
    // Init the data payload
    let data =  {
      "token": token,
      "playlist_id": '',
      "tracklist": []
    }

    /*
      First check if the user has the playlist yet
    */
    const res_userPlaylists = await fetch(`http://localhost:5000/user/playlist/list?token=${token}`)
    const userPlaylists = await res_userPlaylists.json()

    for (var i = 0; i < userPlaylists.items.length - 1; i++) {
      let playlist = userPlaylists.items[i]
      if (playlist.name === 'Triple J (no hip hop) Hitlist') {
        setPlaylistID(playlist)
        data.playlist_id = playlist.id
        break;
      }
    }

    // If no playlist found create one 
    if (data.playlist_id === '') {
      console.log("need to create the playlist");
      const res_playlist = await fetch(`http://localhost:5000/playlist/create?token=${token}`)
      const new_playlist = await res_playlist.json()
      setPlaylistID(new_playlist) // set the ID for future calls
      data.playlist_id = new_playlist.id // update the payload with the id
    }
  
    /*
      Generate the ok list of songs
    */
    const playlist = await fetch(`http://localhost:5000/playlist/remove/no_hip_hop?token=${token}`)
    const playlist_list = await playlist.json();

    data.tracklist = playlist_list //update the payload with the list of ok tracks

    /* 
      Update the playlist with the ok list
    */
    const noHipHopHitlist = await fetch(`http://localhost:5000/playlist/replace`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    // Stop the loading symbol
    if (noHipHopHitlist) {
      setCard3Loading(false)
    }
    console.log(await noHipHopHitlist.json());
  }

  /**
   * Handle the login logic. 
   * Will redirect the user to the API's login endpoint. 
   * This will take them through the Spotify OAuth process before returning them
   * here with the token in the URL. 
   */
  const handleLogin = () => {
    router.push("http://localhost:5000/login")
  }

  /**
   * Remove the access token from state and redirect them to index to remove
   * the token from the URL as well. 
   */
  const handleLogout = () => {
    setToken(undefined)
    router.push("/")
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>No Hip Hop Hitlist</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {user.display_name ? user.display_name + '\'s' : null} <span onClick={checkToken}>No</span> Hip-Hop <a href={playlistID ? playlistID.external_urls.spotify : 'https://open.spotify.com/playlist/6pA8CEkNjjSz22kMNvm8wK'} target="_blank">Hitlist</a>
        </h1>

        <p className={styles.description}>
          Re-create the Triple J Hitlist on Spotify but without all the Hip Hop songs in it. 
        </p>

        <div className={styles.grid}>
          {
            !loggedIn 
            ? <Card 
            header="Login &rarr;"
            onClick={handleLogin}
            isActive={true} />
            : null
          }
          
          {
            loggedIn 
            ? 
            <>
              <Card 
                header="Logout &rarr;"
                text="Logout and remove your access token" 
                onClick={handleLogout}
                isActive={loggedIn} />


              <Card 
                header="Get User &rarr;" 
                text="Print the user's details to the console" 
                onClick={getUser} 
                isActive={loggedIn}
                loading={card1Loading}/> 

              <Card 
                header="Create Playlist &rarr;"
                text="Generate and create the No Hip Hop Playlist"
                onClick={handleCreatePlaylist}
                isActive={loggedIn}
                loading={card3Loading}/>

              <Card 
                header="Clean Playlist &rarr;"
                text="Remove all songs currently in the No Hip Hop Playlist"
                onClick={handleCleanPlaylist}
                loading={card4Loading}
                isActive={playlistID} />
            </>
            : null
          }
          

        </div>
      </main>

      <footer className={styles.footer}>
        Created by Zac Hooper
      </footer>
    </div>
  )
}
