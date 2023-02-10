import React, { createContext, useContext, useState } from 'react'

const walletConnectedContext = createContext(window.ethereum ? true : false)

export const WalletConnectedProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(window.ethereum._state.accounts.length > 0)

  if (walletConnected && localStorage?.getItem('walletConnected') === 'false') {
    localStorage.setItem('walletConnected', 'true')
  } else if (!walletConnected && localStorage?.getItem('walletConnected') === 'true') {
    localStorage.setItem('walletConnected', 'false')
  }

  return (
    <walletConnectedContext.Provider
      value={{
        walletConnected,
        toggleWalletConnection: () => {
          setWalletConnected(!walletConnected)
        },
      }}
    >
      {children}
    </walletConnectedContext.Provider>
  )
}

export const useWalletContext = () => useContext(walletConnectedContext)
