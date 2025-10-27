import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { Footer, Header } from "./components/common/HeaderFooter";
import { AuthProvider } from "./context/useAuth";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Header />
      <AppRouter />
       <Toaster
  position="top-center"
  reverseOrder={false}
/>
      <Footer />
    </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
