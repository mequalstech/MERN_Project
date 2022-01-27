import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'

// const Settings = lazy(() =>
//     import ("./Settings"));
const ChangePassword = lazy(() =>
    import ("./changepwd"));
const ProfileInfo = lazy(() =>
    import ("./profileInfo"));


const settingRoutes = [{
        path: rootPath + "setting/changePassword",
        component: ChangePassword,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "setting/profileInfo",
        component: ProfileInfo,
        auth: authRoles.admin,
    },
    // {
    //     path: rootPath + "setting",
    //     component: Settings,
    //     auth: authRoles.admin,
    // },
];

export default settingRoutes;