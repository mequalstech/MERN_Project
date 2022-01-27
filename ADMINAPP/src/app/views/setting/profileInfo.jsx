import React from 'react';
import { Breadcrumb } from "@gull";
import { rootPath } from 'app/config';

const ProfileInfo = () => {
    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Settings", path: rootPath + 'setting/profileInfo' },
                    { name: "Profile Info" }
                ]}
            />
        </>
    )
}

export default ProfileInfo;