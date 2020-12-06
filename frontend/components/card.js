import React, { useEffect } from "react"
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import Loading from "./Loading"

const Card = (props) => {
  const [loading, setLoading] = useState(false)
  const [style, setStyle] = useState(styles.card)
  

  useEffect(() => {
    setLoading(props.loading), 
    setStyle(props.isActive ? styles.card : styles['card-inactive'])
  })

  return (
    <div className={style} onClick={props.isActive ? props.onClick : null}>
      <h3>{props.header}</h3>
      { loading ? <Loading loading={loading} /> : <p>{props.text}</p> }
    </div>
  )
}

export default Card