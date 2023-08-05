import { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

export function CustomNavBar({ callback }) {
  const handleCallback = (payload: boolean) => {
    callback(payload);
  };

  const baseURl = "http://localhost:5000";
  const [getFormData, setFormData] = useState({ email: "", password: "" });
  const [getFormErr, setFormErr] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...getFormData,

      [e.target.name]: e.target.value.trim(),
    });
  };

  const fetchUserData = async () => {
    const response = await fetch(baseURl + "/user/login", {
      method: "POST",
      body: JSON.stringify({
        ...getFormData,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const data = await response.json();

    return data;
  };

  const handleSubmit = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();

    const data = await fetchUserData();

    if (data.status == 400) {
      setFormErr({ ...getFormData, email: "wrong email or password" });
    } else {
      setFormErr({ ...getFormData, email: "" });
      handleCallback(true);
      console.log(getFormData);
    }
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
      <Container className="">
        <Form>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="admin email"
                className=" mr-sm-2"
                onChange={handleChange}
                value={getFormData.email}
                name="email"
              />
              <Form.Text className="text-muted">{getFormErr.email}</Form.Text>
            </Col>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="admin password"
                className=" mr-sm-2"
                onChange={handleChange}
                value={getFormData.password}
                name="password"
              />
              <Form.Text className="text-muted"></Form.Text>
            </Col>
            <Col xs="auto">
              <Button onClick={handleSubmit} type="submit">
                login
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </Navbar>
  );
}
