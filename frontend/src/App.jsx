import React from "react";
import { createContext, useState } from "react";
import NewNavbar from "./Components/NewNavbar";
import Footer from "./Components/Footer";
import { useNavigate } from "react-router-dom";
import { isAuthTokenPresent ,getUserDetails} from "./helpers/axios_helper";
import Views from "./Views";
export const UserContext = createContext();

function App() {
  
  const navigate = useNavigate();
  const [user, setUser] = useState({ loggedIn: isAuthTokenPresent(), details: getUserDetails()});
  const [visible,setvisible] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");
  return (
    <>
     <UserContext.Provider
    value={{ user, setUser, visible, setvisible, redirectPath, setRedirectPath }}
  >
    <Views/>
    </UserContext.Provider>
    </>
  );
}

export default App;
