import React, { createContext, useContext, useState } from 'react'
import { useWalletContext } from './WalletContext'

const accountAddressContext = createContext('')
const { walletConnected, toggleWalletConnection } = useWalletContext

export const AccountAddressContextProvider = ({ children }) => {
  const [accountAddress, setAccountAddress] = useState(
    walletConnected
      ? window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then((account) => {
            return account[0]
          })
          .catch((err) => {
            console.log('Error while initializing context state accountAddress..', err)
          })
      : '',
  )

  return (
    <accountAddressContext.Provider
      value={{
        accountAddress,
        updateAccountAddress: (value) => {
          setAccountAddress(value)
        },
      }}
    >
      {children}
    </accountAddressContext.Provider>
  )
}

export const useAccountAddressContext = () => useContext(accountAddressContext)
