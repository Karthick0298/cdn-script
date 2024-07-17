'use client'
import { createContext, useCallback, useEffect, useState } from 'react'

const BotContext = createContext()

export function BotProvider({ children }) {
	const [count, setCount] = useState(0)
	return (
		<>
			<BotContext.Provider
				value={{
					count,
					setCount,
				}}
			>
				{' '}
				{children}
			</BotContext.Provider>
		</>
	)
}

export default BotContext
