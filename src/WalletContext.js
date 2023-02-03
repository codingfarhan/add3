import React, { createContext, useContext, useState } from 'react'

const walletConnectedContext = createContext(window.ethereum ? true : false)

export const WalletConnectedProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false)

  return (
    <walletConnectedContext.Provider
      value={{
        walletConnected,
        toggleWalletConnection: () => {
          setWalletConnected(walletConnected === false ? true : false)
        },
      }}
    >
      {children}
    </walletConnectedContext.Provider>
  )
}

export const useWalletContext = () => useContext(walletConnectedContext)
