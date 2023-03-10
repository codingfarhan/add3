import React from 'react'
import { AppContent, AppHeader } from '../components/index'

import { WalletConnectedProvider } from '../WalletContext'

import { AccountAddressContextProvider } from '../accountAddressContext'

const DefaultLayout = () => {
  return (
    <div>
      {/* <AppSidebar /> */}
      <WalletConnectedProvider>
        <AccountAddressContextProvider>
          <div className="wrapper d-flex flex-column min-vh-100 bg-light">
            <AppHeader />
            <div className="body flex-grow-1 px-3">
              {' '}
              <AppContent />
            </div>
            {/* <AppFooter /> */}
          </div>
        </AccountAddressContextProvider>
      </WalletConnectedProvider>
    </div>
  )
}

export default DefaultLayout
