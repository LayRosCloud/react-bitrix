import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {router} from "./rooter/router";
import Header from "./components/Header/Header";
import './styles/app.css'
import Footer from "./components/Footer/Footer";

function App() {

    return (
      <div>
          <BrowserRouter>
          <Header/>
          <main>
                  <Routes>
                      {router.map(route =>
                        <Route key={route.path} path={route.path} Component={route.component} exact/>
                      )}
                      <Route path='*' element={<Navigate to='/' replace/>}/>
                  </Routes>
          </main>
          <Footer/>
          </BrowserRouter>
      </div>
  );
}

export default App;
