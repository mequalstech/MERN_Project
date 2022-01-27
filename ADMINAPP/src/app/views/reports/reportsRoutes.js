import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'


const ProductList = lazy(() =>
    import ("./productlist"));
const CustomerList = lazy(() =>
    import ("./customerlist"));
const StockDetails = lazy(() =>
    import ("./stockdetail"));
const StockLedgerDetails = lazy(() =>
    import ("./stockledger"));
const VendorList = lazy(() =>
    import ("./vendorlist"));
const OrderRegister = lazy(() =>
    import ("./orderregister"));
const InwardRegister = lazy(() =>
    import ("./inwardregister"));
const EnquiryRegister = lazy(() =>
    import ("./enquiryregister"));
// const Reports = lazy(() =>
//     import ("./Reports"));

const reportRoutes = [{
        path: rootPath + "report/product-list",
        component: ProductList,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "report/customer-list",
        component: CustomerList,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "report/stock-details",
        component: StockDetails,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "report/stock-ledgerDetails",
        component: StockLedgerDetails,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "report/vendor-list",
        component: VendorList,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "report/order-register",
        component: OrderRegister,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "report/inward-register",
        component: InwardRegister,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "report/enquiry-register",
        component: EnquiryRegister,
        auth: authRoles.admin,
    },
    // {
    //     path: rootPath + "report",
    //     component: Reports,
    //     auth: authRoles.admin,
    // }
];

export default reportRoutes;