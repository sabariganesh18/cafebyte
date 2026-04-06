import { createBrowserRouter } from "react-router";
import { UserApp } from "./components/UserApp";
import { AdminApp } from "./components/AdminApp";
import { Home } from "./components/user/Home";
import { Menu } from "./components/user/Menu";
import { Cart } from "./components/user/Cart";
import { Orders } from "./components/user/Orders";
import { Profile } from "./components/user/Profile";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminMenu } from "./components/admin/AdminMenu";
import { AdminOrders } from "./components/admin/AdminOrders";
import { AdminUsers } from "./components/admin/AdminUsers";
import { AdminCoupons } from "./components/admin/AdminCoupons";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: UserApp,
    children: [
      { index: true, Component: Home },
      { path: "menu", Component: Menu },
      { path: "cart", Component: Cart },
      { path: "orders", Component: Orders },
      { path: "profile", Component: Profile },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/admin",
    Component: AdminApp,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "menu", Component: AdminMenu },
      { path: "orders", Component: AdminOrders },
      { path: "users", Component: AdminUsers },
      { path: "coupons", Component: AdminCoupons },
    ],
  },
]);
