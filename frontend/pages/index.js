import Head from 'next/head'
import styles from '../styles/Home.module.css'
import spotifyCred from '../config/config'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const scope = 'playlist-modify-public'

  const [token, setToken] = useState('')

  // Set token from 'code' param URL
  useEffect(() => {
    setToken(router.query.code)
  })

  const checkToken = () => {
    console.log(token);
  }

  const getUser = async () => {
    const user = await fetch(`http://localhost:5000/user/get?token=${token}`)
    console.log(user);
  }

  const handleLoginUser = async () => {
    const access_token = await fetch("http://localhost:5000/login")
    console.log(access_token);
  }

  const handleCleanPlaylist = async () => {
    const cleanPlaylist = await fetch(`http://localhost:5000/playlist/clean?token=${token}&playlist_id=1ahh5eiX08eeiKxxXqZlPp`)
    console.log(cleanPlaylist);
  }

  const handleCreatePlaylist = async () => {
    
    const playlist = await fetch(`http://localhost:5000/playlist/remove/no_hip_hop?token=${token}`)
    const playlist_list = await playlist.json();
    const data = await {
      "token": token,
      "playlist_id": "1ahh5eiX08eeiKxxXqZlPp",
      "tracklist": playlist_list
    }
    const noHipHopHitlist = await fetch(`http://localhost:5000/playlist/replace`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    console.log(await noHipHopHitlist.json());
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>No Hip Hop Hitlist</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <span onClick={checkToken}>No</span> Hip-Hop <a href="https://open.spotify.com/playlist/1ahh5eiX08eeiKxxXqZlPp?si=AL_fqVM9S2ib4sDJ8QqFpA" target="_blank">Hitlist</a>
        </h1>

        <p className={styles.description}>
          Re-create the Triple J Hitlist on Spotify but without all the Hip Hop songs in it. 
        </p>

        <div className={styles.grid}>
          <div className={styles.card} onClick={getUser}>
            <h3>Get User &rarr;</h3>
            <p>Print the user's details to the console</p>
          </div>

          <a className={styles.card} href="http://localhost:5000/login">
            <h3>Login &rarr;</h3>
            <p>Get an access token for a user by logging in</p>
          </a>

          <div
            onClick={handleCreatePlaylist}
            className={styles.card}
          >
            <h3>Create Playlist &rarr;</h3>
            <p>Generate and create the No Hip Hop Playlist</p>
          </div>

          <div
            onClick={handleCleanPlaylist}
            className={styles.card}
          >
            <h3>Clean Playlist &rarr;</h3>
            <p>Remove all songs currently in the No Hip Hop Playlist</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}
