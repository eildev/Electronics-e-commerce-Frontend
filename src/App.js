import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import HomePageOne from "./pages/HomePageOne";
import HomePageTwo from "./pages/HomePageTwo";
import HomePageThree from "./pages/HomePageThree";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPageOne from "./pages/ProductDetailsPageOne";
import ProductDetailsPageTwo from "./pages/ProductDetailsPageTwo";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import ContactPage from "./pages/ContactPage";
import PhosphorIconInit from "./helper/PhosphorIconInit";
import VendorPage from "./pages/VendorPage";
import VendorDetailsPage from "./pages/VendorDetailsPage";
import VendorTwoPage from "./pages/VendorTwoPage";
import VendorTwoDetailsPage from "./pages/VendorTwoDetailsPage";
import BecomeSellerPage from "./pages/BecomeSellerPage";
import WishlistPage from "./pages/WishlistPage";
import ProtectedCartRoute from "./Route/ProtectedCartRoute";
import ComparePage from "./pages/ComparePage";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import UserTabs from "./components/UserDashboard/UserTabs";
import UserDetailsPage from "./pages/UserDetailsPage";
function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <PhosphorIconInit />

      <Routes>
        {/* <Route exact path='/' element={<HomePageOne />} /> */}
        {/* <Route exact path='/index-two' element={<HomePageTwo />} /> */}
        <Route exact path='/' element={<HomePageTwo />} />
        <Route exact path='/index-three' element={<HomePageThree />} />
        <Route exact path='/shop' element={<ShopPage />} />
        <Route
          exact
          path='/product-details'
          element={<ProductDetailsPageOne />}
        />
        <Route
          exact
          path="/product-details-two/:id"
          element={<ProductDetailsPageTwo />}
        />
        <Route exact path='/cart' element={<ProtectedCartRoute element={<CartPage />}></ProtectedCartRoute>} />
        <Route exact path='/checkout' element={<ProtectedCartRoute element={<CheckoutPage />}></ProtectedCartRoute>} />
        <Route exact path='/become-seller' element={<BecomeSellerPage />} />
        <Route exact path='/wishlist' element={<WishlistPage />} />
        <Route exact path='/account' element={<AccountPage />} />
        <Route exact path='/blog' element={<BlogPage />} />
        <Route exact path='/blog-details' element={<BlogDetailsPage />} />
        <Route exact path='/contact' element={<ContactPage />} />
        <Route exact path='/vendor' element={<VendorPage />} />
        <Route exact path='/vendor-details' element={<VendorDetailsPage />} />
        <Route exact path='/vendor-two' element={<VendorTwoPage />} />
        <Route exact path='/compare' element={<ComparePage />} />
        <Route exact path='/user-details' element={<UserDetailsPage></UserDetailsPage>} />
        <Route exact path='/user-dashboard' element={<UserDashboard></UserDashboard>} />
        <Route
          exact
          path='/vendor-two-details'
          element={<VendorTwoDetailsPage />}
        />
        <Route path="/user-tabs/:tabId" element={<UserTabs/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
