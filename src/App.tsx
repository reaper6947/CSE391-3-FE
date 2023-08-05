import "./App.css";
import { CustomNavBar } from "./components/navbar";
import { Container } from "react-bootstrap";
import { RegisterForm } from "./components/registerForm";
import { AppointmentList } from "./components/appointmentList";
import { useState } from "react";

function App() {
  const [isAdmin, setAdmin] = useState(false);

  const callback = (payload: boolean) => {
    setAdmin(payload);
  };
  return (
    <>
      <CustomNavBar callback={callback}></CustomNavBar>
      <Container>
        <RegisterForm></RegisterForm>
        {isAdmin && <AppointmentList isAdmin={isAdmin}></AppointmentList>}
      </Container>
    </>
  );
}

export default App;
