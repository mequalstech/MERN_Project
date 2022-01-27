import React, { useState } from 'react'
import Vendor from './Vendor';
import ListVendor from './ListVendor';
import { NotificationContainer, NotificationManager } from "react-notifications";

const ManageVendor = () => {
    const [showVendor, setShowVendor] = useState(false)
    const [vendorId, setvendorId] = useState('')

    const vendorEdit = (id) => {
        setShowVendor(!showVendor)
        console.log(id)
        setvendorId(id)
    }

    const vendorAdd = () => {
        setShowVendor(!showVendor)
        setvendorId('')
    }

    const vendorManage = (data) => {
        console.log(data)
        setShowVendor(!showVendor)
    }

    const showList=()=>{
        console.log('Show list',"id",vendorId,"S",showVendor)
        setShowVendor(false)
    }
    return (
        <>
            {
                showVendor ?
                    <Vendor
                        isNewVendor={vendorId}
                        vendorEdit={vendorEdit}
                        vendorAdd={vendorAdd}
                        vendorManage={vendorManage}
                    />
                    :
                    <ListVendor
                        vendorEdit={vendorEdit}
                        vendorAdd={vendorAdd}
                        showList={showList}
                    />
            }
        </>
    )
}

export default ManageVendor;