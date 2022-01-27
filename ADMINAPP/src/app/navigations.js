import { rootPath } from 'app/config';
export const navigations = [{
        name: "Dashboard",
        description: "",
        type: "dashboard",
        icon: "nav-icon i-Bar-Chart",
        path: rootPath + 'dashboard'
    },
    {
        name: "Master",
        description: "",
        type: "dropDown",
        icon: "nav-icon i-Book",
        sub: [{
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Banner",
                path: rootPath + "master/banner",
                type: "link"
            },
            // {
            //     icon: "nav-icon i-Split-Horizontal-2-Window",
            //     name: "Price List",
            //     path: rootPath + "master/price-list",
            //     type: "link"
            // },
            {
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Discounts & Offers",
                path: rootPath + "master/discounts-offer",
                type: "link"
            },
            // {
            //     icon: "nav-icon i-Split-Horizontal-2-Window",
            //     name: "Manage Partner",
            //     path: rootPath + "master/manage-partner",
            //     type: "link"
            // },
            // {
            //     icon: "nav-icon i-Split-Horizontal-2-Window",
            //     name: "Manage Vendor",
            //     path: rootPath + "master/manage-vendor",
            //     type: "link"
            // }
        ]
    },
    {
        name: "Catalog Management",
        description: "",
        type: "dropDown",
        icon: "ion-md-cart",
        sub: [{
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Category",
                path: rootPath + "catalogue/categories",
                type: "link"
            },
            {
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Sub Category",
                path: rootPath + "catalogue/subcategories",
                type: "link"
            },
            {
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Manage Product",
                path: rootPath + "catalogue/manage-product",
                type: "link"
            }
        ]
    },
    {
        name: "Customer Management",
        description: "",
        type: "dropDown",
        icon: "nav-icon i-Business-Mens",
        sub: [{
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Manage Customer",
                path: rootPath + "customer/manage-customer",
                type: "link"
            },
            {
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Customer Shop",
                path: rootPath + "customer/customer-shop",
                type: "link"
            },
            // {
            //     icon: "nav-icon i-Split-Horizontal-2-Window",
            //     name: "Approval Customer",
            //     path: rootPath + "catalogue/categories",
            //     type: "link"
            // },
            // {
            //     icon: "nav-icon i-Split-Horizontal-2-Window",
            //     name: "Block Customer",
            //     path: rootPath + "catalogue/subcategories",
            //     type: "link"
            // }
        ]
    },
    {
        name: "Manage Order",
        description: "",
        type: "dropDown",
        icon: "nav-icon ion-ios-basket",
        sub: [{
                icon: "nav-icon i-Arrow-Down-in-Circle",
                name: "View Enquiry List",
                path: rootPath + "order/view-enquiry-list",
                type: "link"
            },
            {
                icon: "nav-icon i-Arrow-Down-in-Circle",
                name: "View Order List",
                path: rootPath + "order/view-order",
                type: "link"
            },
            // {
            //     icon: "nav-icon i-Crop-2",
            //     name: "Payment Details",
            //     path: rootPath + "partner/new-partner",
            //     type: "link"
            // },
            // {
            //     icon: "nav-icon i-Arrow-Down-in-Circle",
            //     name: "Shopping Integration",
            //     path: rootPath + "partner/manage-partner",
            //     type: "link"
            // },
            // {
            //     icon: "nav-icon i-Crop-2",
            //     name: "Cancel Order",
            //     path: rootPath + "partner/new-partner",
            //     type: "link"
            // }
        ]
    },
    {
        name: "Inventory",
        description: "",
        type: "dropDown",
        icon: "nav-icon ion-ios-albums",
        sub: [{
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Manage Vendor",
                path: rootPath + "inventory/manage-vendor",
                type: "link"
            },
            {
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Manage Inward",
                path: rootPath + "inventory/manage-inward",
                type: "link"
            }
        ]
    },
    {
        name: "Settings",
        description: "",
        type: "link",
        icon: "nav-icon i-Gear",
        sub: [{
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Profile Info",
                path: rootPath + 'setting/profileInfo',
                type: "link"
            },
            {
                icon: "nav-icon i-Split-Horizontal-2-Window",
                name: "Change Password",
                path: rootPath + 'setting/changePassword',
                type: "link"
            }
        ]
    },
    // {
    //     name: "Settings",
    //     description: "",
    //     type: "link",
    //     icon: "nav-icon i-Gear",
    //     path: rootPath + 'setting'
    // },
    {
        name: "Reports",
        description: "",
        type: "link",
        icon: "nav-icon i-File-Chart",
        sub: [{
                name: "Inventory",
                description: "",
                type: "dropdown",
                icon: "nav-icon i-File-Chart",
                sub: [{
                        icon: "nav-icon i-Split-Horizontal-2-Window",
                        name: "Product List",
                        path: rootPath + 'report/product-list',
                        type: "link"
                    },
                    {
                        icon: "nav-icon i-Split-Horizontal-2-Window",
                        name: "Stock Detail Report",
                        path: rootPath + 'report/stock-details',
                        type: "link"
                    },
                    {
                        icon: "nav-icon i-Split-Horizontal-2-Window",
                        name: "Stock Ledger Report",
                        path: rootPath + 'report/stock-ledgerDetails',
                        type: "link"
                    }
                ],
            },
            {
                name: "Register",
                description: "",
                type: "dropdown",
                icon: "nav-icon i-File-Chart",
                sub: [{
                    icon: "nav-icon i-Split-Horizontal-2-Window",
                    name: "Customer List",
                    path: rootPath + 'report/customer-list',
                    type: "link"
                }, 
                // {
                //     icon: "nav-icon i-Split-Horizontal-2-Window",
                //     name: "Vendor List",
                //     path: rootPath + 'report/vendor-list',
                //     type: "link"
                // }, 
                {
                    icon: "nav-icon i-Split-Horizontal-2-Window",
                    name: "Order Register",
                    path: rootPath + 'report/order-register',
                    type: "link"
                },
                {
                    icon: "nav-icon i-Split-Horizontal-2-Window",
                    name: "Inward Register",
                    path: rootPath + 'report/inward-register',
                    type: "link"
                }, 
                // {
                //     icon: "nav-icon i-Split-Horizontal-2-Window",
                //     name: "Enquiry Register",
                //     path: rootPath + 'report/enquiry-register',
                //     type: "link"
                // }
            ]
            }
        ]
    },
];
