import React from 'react'
import Navbar from '../components/Navbar'
import NavbarPos from '../components/NavbarPos'
import SidebarPos from '../components/SidebarPos'

const LayoutPos = ({children, uuidTransaction}) => {
  return (
    <React.Fragment>
    <NavbarPos/>
    <div className="columns mt-6" style={{ minHeight: "90vh" }}>
        <div className="column is-4"><SidebarPos uuidTransaction = {uuidTransaction} /></div>
        <div className="column has-background-light">
            <main>{children}</main>
        </div>
    </div>
</React.Fragment>
  )
}

export default LayoutPos
