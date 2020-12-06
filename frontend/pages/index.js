import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Card from "../components/card"

export default function Home() {
  const router = useRouter()

  const [token, setToken] = useState(undefined)

  const [card1Loading, setCard1Loading] = useState(false)
  const [card3Loading, setCard3Loading] = useState(false)
  const [card4Loading, setCard4Loading] = useState(false)

  // Set token from 'code' param URL
  useEffect(() => {
    setToken(router.query.code)
  })

  const checkToken = () => {
    console.log(token);
  }

  const getUser = async () => {
    setCard1Loading(true)
    const user = await fetch(`http://localhost:5000/user/get?token=${token}`)
    if (user) {
      setCard1Loading(false)
    }
    console.log(await user.json());
  }

  const handleCleanPlaylist = async () => {
    setCard4Loading(true)
    const cleanPlaylist = await fetch(`http://localhost:5000/playlist/clean?token=${token}&playlist_id=1ahh5eiX08eeiKxxXqZlPp`)
    if (cleanPlaylist) {
      setCard4Loading(false)
    }
    console.log(cleanPlaylist);
  }

  const handleCreatePlaylist = async () => {
    setCard3Loading(true)
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
    if (noHipHopHitlist) {
      setCard3Loading(false)
    }
    console.log(await noHipHopHitlist.json());
  }

  const handleLogin = () => {
    router.push("http://localhost:5000/login")
  }

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
          <span onClick={checkToken}>No</span> Hip-Hop <a href="https://open.spotify.com/playlist/1ahh5eiX08eeiKxxXqZlPp?si=AL_fqVM9S2ib4sDJ8QqFpA" target="_blank">Hitlist</a>
        </h1>

        <p className={styles.description}>
          Re-create he Triple J Hitlist on Spotify but without all the Hip Hop songs in it. 
        </p>

        <div className={styles.grid}>
          <Card 
            header="Login &rarr;"
            text="Get an access token for a user by logging in" 
            onClick={handleLogin}
            isActive={true} />

          <Card 
            header="Logout &rarr;"
            text="Get an access token for a user by logging in" 
            onClick={handleLogout}
            isActive={typeof token === 'undefined' ? false : true} />


          <Card 
            header="Get User &rarr;" 
            text="Print the user's details to the console" 
            onClick={getUser} 
            isActive={typeof token === 'undefined' ? false : true}
            loading={card1Loading}/> 

          <Card 
            header="Create Playlist &rarr;"
            text="Generate and create the No Hip Hop Playlist"
            onClick={handleCreatePlaylist}
            isActive={typeof token === 'undefined' ? false : true}
            loading={card3Loading}/>

          <Card 
            header="Clean Playlist &rarr;"
            text="Remove all songs currently in the No Hip Hop Playlist"
            onClick={handleCleanPlaylist}
            loading={card4Loading}
            isActive={typeof token === 'undefined' ? false : true} />

        </div>
      </main>

      <footer className={styles.footer}>
        Created by Zac Hooper
      </footer>
    </div>
  )
}
