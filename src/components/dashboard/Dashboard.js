import React from 'react'

import { CCard } from '@coreui/react'

import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  return (
    <>
      <WidgetsDropdown />
      <CCard className="mb-4"></CCard>
    </>
  )
}

export default Dashboard
