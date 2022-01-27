import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'

const Customer = lazy(() => import("./ManageCustomer"));
const CustomerShop = lazy(() => import("./CustomerShop"));


const customerRoutes = [
    {
        path: rootPath + "customer/manage-customer",
        component: Customer,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "customer/customer-shop",
        component: CustomerShop,
        auth: authRoles.admin,
    },
];

export default customerRoutes;