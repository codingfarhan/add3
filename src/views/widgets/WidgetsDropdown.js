import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useWalletContext } from '../../WalletContext'

import { CRow, CCol, CWidgetStatsA, CInputGroup, CFormInput, CButton, CAlert } from '@coreui/react'

// Smart Contract ABI.

const contractABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const WidgetsDropdown = () => {
  // function to Mint tokens using smart contract.

  const mintTokens = async (userAddress, contract) => {
    setAlertState({
      state: 'active',
      message: `Minting 100 ${tokenSymbol} tokens to address ${userAddress}... please wait..`,
      color: 'info',
    })
    await contract.mint(userAddress, 100).then(() => {
      setAlertState({
        state: 'active',
        message: `Minting complete! 100 ${tokenName} tokens have been minted to address ${userAddress} !`,
        color: 'success',
      })
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
    const signer = new ethers.Wallet(
      '4337f69247d759dd1f2247d57864fdbf6bb73d056a2301f1f8d37a2591b21dae',
      provider,
    )
    const smartContractAddress = '0x927DFb9e957526e4D40448d6D05A39ea39a2ee6B'
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

  // const [accountAddress, setAccountAddress] = useState('')
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
            value={
              walletConnected ? (
                <>
                  Balance: {accountBalance}
                  {/* <span className="fs-6 fw-normal">
                  (-12.4% <CIcon icon={cilArrowBottom} />)
                </span> */}
                </>
              ) : (
                <>
                  Balance: Nil
                  {/* <span className="fs-6 fw-normal">
                  (-12.4% <CIcon icon={cilArrowBottom} />)
                </span> */}
                </>
              )
            }
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
