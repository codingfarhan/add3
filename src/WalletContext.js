import React, { createContext, useContext, useState } from 'react'

const walletConnectedContext = createContext(window.ethereum ? true : false)

export const WalletConnectedProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(
    localStorage?.getItem('walletConnected') === 'true',
  )

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
