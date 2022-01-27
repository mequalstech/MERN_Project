import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import UserReducer from "./UserReducer";
import LayoutReducer from "./LayoutReducer";
import MasterReducer from "./MasterReducer";
import CatalogReducer from "./CatalogReducer";
import OfferReducer from './OfferReducer';
import CustomerReducer from "./CustomerReducer";
import OrderReducer from "./OrderReducer";
import InvetoryReducer from "./InventoryReducer";
import ReportReducer from "./ReportReducer";
import SettingsReducer from "./SettingsReducer";


const RootReducer = combineReducers({
    login: LoginReducer,
    user: UserReducer,
    layout: LayoutReducer,
    master: MasterReducer,
    customer: CustomerReducer,
    catalog: CatalogReducer,
    offer: OfferReducer,
    order: OrderReducer,
    inventory: InvetoryReducer,
    report: ReportReducer,
    settings: SettingsReducer
});

export default RootReducer;