import React, { useState, useEffect } from 'react'
import { useWalletContext } from '../WalletContext'
import { useAccountAddressContext } from '../accountAddressContext'
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
import { connect } from 'react-redux'

const AppHeader = () => {
  const liveUpdateWalletState = () => {
    window.ethereum.on(
      'accountsChanged',
      () => {
        // window.alert('You changed something in metamask extension UI.')
        if (window.ethereum._state.accounts.length > 0) {
          localStorage.setItem('walletConnected', 'true')

          console.log('Walletconnected status before connecting to metaMask: ', walletConnected)

          connectWallet()

          return
        } else if (
          window.ethereum._state.accounts.length === 0 ||
          typeof window.ethereum._state.accounts.length === undefined
        ) {
          localStorage.setItem('walletConnected', 'false')

          console.log('walletconnected status before toggleWalletConnection() :', walletConnected)

          if (walletConnected) {
            connectWallet()

            return
            // window.location.reload()
          }
        }
      },
      100,
    )
  }

  liveUpdateWalletState()

  // defining states.

  const { walletConnected, toggleWalletConnection } = useWalletContext()
  const { accountAddress, updateAccountAddress } = useAccountAddressContext()

  if (walletConnected && accountAddress === '') {
    updateAccountAddress(window.ethereum._state.accounts[0])
  }
  // useEffect hook for walletConnected context:

  // useEffect(() => {
  //   walletConnected
  //     ? window.alert('walletConnected is true')
  //     : window.alert('waleetConnected state is false')
  // }, [walletConnected])

  // function to connect DApp to MetaMask wallet.
  const connectWallet = () => {
    console.log('Top right button working..')
    console.log('wallet connected- ', walletConnected)

    if (!walletConnected) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((account) => {
          toggleWalletConnection()
          localStorage.setItem('walletConnected', 'true')
          updateAccountAddress(account[0])

          // window.alert('MetaMask connected..')
          console.log('Walletconnected status after connecting to metaMask: ', walletConnected)

          console.log('MetaMask connected!')

          return
        })
        .catch((err) => {
          console.log('An error occured while connecting to MetaMask..', err.message)
        })
    } else {
      toggleWalletConnection()
      localStorage.setItem('walletConnected', 'false')

      // window.alert('MetaMask Disconnected...')

      console.log('MetaMask Disconnected!')

      return
    }
  }

  // setting wallection state on loading the page:

  useEffect(() => {
    console.log(walletConnected)
    // if (walletConnected) {
    //   window.ethereum
    //     .request({ method: 'eth_requestAccounts' })
    //     .then((account) => {
    //       updateAccountAddress(account[0])
    //       console.log(account)
    //       console.log('MetaMask connected!')
    //     })
    //     .catch((err) => {
    //       console.log('An error occured while connecting to MetaMask..', err)
    //     })
    // }

    // liveUpdateWalletState()
  }, [])

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
                User Account - {accountAddress}
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
