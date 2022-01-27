import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'

const ManageVendor = lazy(() =>
    import ("./ManageVendor"));
const AddVendor = lazy(() =>
    import ("./AddVendor"));
const ManageInward = lazy(() =>
    import ("./ManageInward"));

const InventoryRoutes = [{
        path: rootPath + "inventory/manage-vendor",
        component: ManageVendor,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "inventory/add-vendor",
        component: AddVendor,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "inventory/manage-inward",
        component: ManageInward,
        auth: authRoles.admin,
    }
];

export default InventoryRoutes;