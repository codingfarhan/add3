import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useWalletContext } from '../../WalletContext'
import { useAccountAddressContext } from '../../accountAddressContext'

import { CRow, CCol, CWidgetStatsA, CInputGroup, CFormInput, CButton, CAlert } from '@coreui/react'

// smart contract ABI.

const contractABI = require('../../contract/contractABI.json')

const WidgetsDropdown = () => {
  // console.log(process.env.REACT_APP_API_KEY)
  // change network to Goerli network..

  const changeNetwork = async () => {
    const goerliNetwork = {
      chainId: `0x${Number(5).toString(16)}`,
      chainName: 'Goerli Test Network',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [`https://eth-goerli.g.alchemy.com/v2/${process.env.REACT_APP_API_KEY}`],
      blockExplorerUrls: ['https://goerli.etherscan.io/'],
    }

    await window.ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [goerliNetwork],
      })
      .catch((err) => {
        console.log('An error occured while enforcing MetaMask to use the Goerli network..', err)
      })
  }

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
          message: `Minting complete! 100 ${tokenName} tokens have been minted to address "${userAddress}" !`,
          color: 'success',
        })
      })
      .catch((err) => {
        setAlertState({
          state: 'active',
          message: `An error occured while minting tokens for account "${userAddress}". Are you sure the Account Address is correct?`,
          color: 'danger',
        })
      })
  }
  // functions to get the Token related data.

  const getTokenBalance = async (address, contract) => {
    // console.log(address)
    await contract
      .balanceOf(address)
      .then((balance) => {
        // console.log(balance.toString())
        setAccountBalance(balance.toString())
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getTokenNameAndSymbol = async (contract) => {
    const contractName = await contract.name()
    setTokenName((tokenName) => {
      if (tokenName !== contractName && typeof contractName !== undefined) {
        return contractName
      } else {
        return tokenName
      }
    })

    const contractSymbol = await contract.symbol()
    setTokenSymbol((tokenSymbol) => {
      if (tokenSymbol !== contractSymbol && typeof contractSymbol !== undefined) {
        return contractSymbol
      } else {
        return tokenSymbol
      }
    })
  }

  const getBlockchainData = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = new ethers.Wallet(process.env.REACT_APP_WALLET_ADDRESS, provider)
    const smartContractAddress = process.env.REACT_APP_SMART_CONTRACT_ADDRESS
    // console.log(typeof smartContractAddress)
    setContractAddress(new ethers.Contract(smartContractAddress, contractABI, signer))
    // console.log(contractAddress)

    // getting token balance
    await getTokenBalance(address, contractAddress)

    // getting token name and symbol.
    await getTokenNameAndSymbol(contractAddress)
  }

  // using wallet context here.
  const { walletConnected, toggleWalletConnection } = useWalletContext()
  const { accountAddress, updateAccountAddress } = useAccountAddressContext()

  // using states:

  const [accountBalance, setAccountBalance] = useState('Nil')
  const [tokenName, setTokenName] = useState('Nil')
  const [tokenSymbol, setTokenSymbol] = useState('')

  const [userAddress, setUserAddress] = useState('')
  const [contractAddress, setContractAddress] = useState('')

  const [alertState, setAlertState] = useState({ state: 'inactive', message: '', color: '' })

  // set the account address
  if (
    localStorage.getItem('walletConnected') === 'true' &&
    window.ethereum._state.accounts.length > 0 &&
    accountAddress !== ''
  ) {
    changeNetwork()
    setInterval(() => getBlockchainData(accountAddress), 3000)
  }

  return (
    <>
      <CRow className="justify-content-center">
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={walletConnected ? <>Balance: {accountBalance}</> : <>Balance: Nil</>}
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
                if (ethers.utils.isAddress(userAddress)) {
                  mintTokens(userAddress, contractAddress)
                } else {
                  setAlertState({
                    state: 'active',
                    message: 'Please make sure the Account Address is valid!',
                    color: 'danger',
                  })
                }
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
