import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import CreateWork from "./pages/CreateWork";
import SelectRole from "./components/SelectRole";
import { useFireBase } from "./context/FireBase";
import Workspace from "./pages/WorkSpace";
import Error from "./pages/Error";
import Room from "./pages/Room";

function App() {
  const { handleRoleSelection, user, isLoading, userRole } = useFireBase();

  const ProtectRoute = ({ children, roles }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <Navigate to="/" />;
    }
    if (roles && !roles.includes(userRole)) {
      return <Navigate to="/unauthorized" />; // Redirect if role is not authorized
    }

    return children;
  };
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path = 'room/1620f057-d788-4140-94fb-6ccc28ddaf5c' element = {<Room/>}/>
        {/* protection me hai e routes */}
        {/* <Route
          path="/createworkspace"
          element={
            <ProtectRoute roles={["admin"]}>
              <CreateWork />
            </ProtectRoute>
          }
        /> */}
        <Route path="/createworkspace" element={<CreateWork />} />
        <Route path ="/error" element={<Error/>} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route
          path="/workspace" // Or whatever path you want
          element={
            <ProtectRoute>
              {/* No specific roles required */}
              <Workspace /> {/* Replace with your Workspace component */}
            </ProtectRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
