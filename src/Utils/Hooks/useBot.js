'use client'
import { useContext } from 'react'
import BotContext from '../Contexts/botContext'

const useBot = () => useContext(BotContext)

export default useBot
