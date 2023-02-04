import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useWalletContext } from '../../WalletContext'

import { CRow, CCol, CWidgetStatsA, CInputGroup, CFormInput, CButton, CAlert } from '@coreui/react'

// smart contract ABI.

const contractABI = require('../../contract/contractABI.json')

const WidgetsDropdown = () => {
  // function to Mint tokens using smart contract.

  const mintTokens = async (userAddress, contract) => {
    setAlertState({
      state: 'active',
      message: `Minting 100 ${tokenSymbol} tokens to address ${userAddress}... please wait...`,
      color: 'info',
    })
    await contract
      .mint(userAddress, 100)
      .then(() => {
        setAlertState({
          state: 'active',
          message: `Minting complete! 100 ${tokenName} tokens have been minted to address ${userAddress} !`,
          color: 'success',
        })
      })
      .then(() => {
        getTokenBalance()
      })
  }
  // function to get the Token related data.

  const getBlockchainData = async () => {
    await window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((res) => {
        console.log(res[0])
        // setAccountAddress(res[0])
        return res[0]
      })
      .then((address) => {
        getTokenData(address)
      })
  }

  const getTokenBalance = async (address, contract) => {
    await contract
      .balanceOf(address)
      .then((balance) => {
        console.log(balance.toString())
        setAccountBalance(balance.toString())
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getTokenNameAndSymbol = async (contract) => {
    setTokenName(await contract.name())
    setTokenSymbol(await contract.symbol())
  }

  const getTokenData = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // const provider = new ethers.providers.JsonRpcProvider(
    //   'https://goerli.etherscan.io/address/0x927dfb9e957526e4d40448d6d05a39ea39a2ee6b',
    //   5,
    // )

    // const provider = new ethers.providers.AlchemyProvider(
    //   (network = 'goerly'),
    //   'Mjit0Jq89qciTYJWQZLTvs9MCxyf_Mxd',
    // )
    console.log(typeof process.env.REACT_APP_WALLET_ADDRESS)
    const signer = new ethers.Wallet(process.env.REACT_APP_WALLET_ADDRESS, provider)
    const smartContractAddress = process.env.REACT_APP_SMART_CONTRACT_ADDRESS
    console.log(typeof smartContractAddress)
    setContractAddress(new ethers.Contract(smartContractAddress, contractABI, signer))
    console.log(contractAddress)

    // getting token balance
    await getTokenBalance(address, contractAddress)

    // getting token name and symbol.
    await getTokenNameAndSymbol(contractAddress)
  }

  // using wallet context here.
  const { walletConnected, toggleWalletConnection } = useWalletContext()

  // using states:

  const [accountBalance, setAccountBalance] = useState('Nil')
  const [tokenName, setTokenName] = useState('Nil')
  const [tokenSymbol, setTokenSymbol] = useState('')

  const [userAddress, setUserAddress] = useState('')
  const [contractAddress, setContractAddress] = useState('')

  const [alertState, setAlertState] = useState({ state: 'inactive', message: '', color: '' })

  // set the account address
  if (walletConnected) {
    getBlockchainData()
  }

  return (
    <>
      <CRow className="justify-content-center">
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={walletConnected ? <>Balance: {accountBalance}</> : <>Balance: Nil</>}
            // title={'Token: ' + tokenName + (tokenSymbol !== '' ? '(' + tokenSymbol + ')' : '')}
            title={walletConnected ? `Token: ${tokenName} (${tokenSymbol})` : 'Token: Nil'}
            style={{ paddingBottom: '15px' }}
          />
        </CCol>
        <CCol sm={6} lg={4} className="align-self-center">
          <CInputGroup>
            <CFormInput
              placeholder="Enter User Address here"
              onChange={(e) => {
                setUserAddress(e.target.value)
              }}
            ></CFormInput>
            <CButton
              onClick={() => {
                mintTokens(userAddress, contractAddress)
              }}
            >
              Mint
            </CButton>
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow>
        {walletConnected ? (
          alertState.state === 'active' ? (
            <CAlert color={alertState.color}>{alertState.message}</CAlert>
          ) : (
            ''
          )
        ) : (
          ''
        )}
      </CRow>
    </>
  )
}
export default WidgetsDropdown
