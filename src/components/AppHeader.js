import React, { useState } from 'react'
import { useWalletContext } from '../WalletContext'
import { NavLink } from 'react-router-dom'
import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CNavLink,
  CNavItem,
  CButton,
} from '@coreui/react'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  // defining states.

  const { walletConnected, toggleWalletConnection } = useWalletContext()
  const [accountNumber, setAccountNumber] = useState('')

  // function to connect DApp to MetaMask wallet.
  const connectWallet = async () => {
    await window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((account) => {
        walletConnected
          ? console.log('Disconnected from MetaMask!!')
          : console.log('Connected to MetaMask!!')
        toggleWalletConnection()
        setAccountNumber(account[0])
      })
      .catch((err) => {
        console.log('An error occured while connecting to MetaMask..', err)
      })
  }

  // returning the component.
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            {walletConnected ? (
              <CButton color="primary" style={{ marginRight: '20px' }} onClick={connectWallet}>
                User Account - {accountNumber}
              </CButton>
            ) : (
              <CButton color="success" style={{ marginRight: '0px' }} onClick={connectWallet}>
                Connect to MetaMask
              </CButton>
            )}
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
