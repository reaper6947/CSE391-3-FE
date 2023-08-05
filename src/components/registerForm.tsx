import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export function RegisterForm() {
  const [getSlot, setSlot] = useState([]);
  const [validated, setValidated] = useState(true);
  const [getForm, setForm] = useState({
    slot: "1",
    name: "",
    email: "",
    sid: "",
  });

  const [getFormErr, setFormErr] = useState({
    email: "",
    name: "",
    sid: "",
    slot: "",
  });

  const baseURl = "http://localhost:5000";

  const fetchSlot = async () => {
    const resp = await fetch(baseURl + "/appointment/slot");
    const data = await resp.json();
    const arr = data.data;
    const mappedArr = arr.map((item) => {
      return {
        id: item.id,
        remainingSeats: item.remainingSeats,
        startTime: item.startTime,
        endTime: item.endTime,
        day: new Intl.DateTimeFormat("en-US", {
          weekday: "long",
        }).format(new Date(item.appointmentDate)),
      };
    });
    console.log(mappedArr);
    setSlot(mappedArr);
  };

  const fetchList = async () => {
    const resp = await fetch(baseURl + "/appointment/list");
    const data = await resp.json();
    const arr = data.data;
    return arr;
  };

  useEffect(() => {
    fetchSlot();
  }, [validated]);

  const postSlot = async () => {
    const resp = await fetch(baseURl + "/appointment/post", {
      method: "POST",
      body: JSON.stringify({
        ...getForm,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await resp.json();
    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(false);
      event.stopPropagation();
    }

    const list = await fetchList();

    const isSidExists = list.some((item) => item.sid == getForm.sid);

    if (isSidExists) {
      setFormErr({
        ...getFormErr,
        sid: "sid already registered",
      });
    }
    const isEmailExists = list.some((item) => item.email == getForm.email);

    if (isEmailExists) {
      setFormErr({
        ...getFormErr,
        email: "email already registered",
      });
    }

    let seatsTaken: number = 0;

    list.map((item) => {
      if (item.slot == parseInt(getForm.slot)) {
        seatsTaken += 1;
      }
    });

    if (seatsTaken == 8) {
      setFormErr({
        ...getFormErr,
        slot: "no more slot availabe for that day",
      });
    }

    if (!isEmailExists && !isSidExists && seatsTaken < 8) {
      const resp = await postSlot();
      setValidated(true);
      window.location.reload();
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...getForm, [e.target.name]: e.target.value });
  };

  return (
    <Form className="my-5" validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          onChange={onChange}
          name="email"
          required
          type="email"
          placeholder="Enter email"
        />
        <Form.Text className="text-muted">{getFormErr.email}</Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          onChange={onChange}
          name="name"
          required
          type="text"
          placeholder="enter Full Name"
        />
        <Form.Text className="text-muted">{getFormErr.name}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicSID">
        <Form.Label>SID</Form.Label>
        <Form.Control
          onChange={onChange}
          name="sid"
          required
          type="text"
          placeholder="enter SID"
        />
        <Form.Text className="text-muted">{getFormErr.sid}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicSlot">
        <Form.Label>Select time slot</Form.Label>
        <Form.Select
          onChange={(e) => {
            setForm({ ...getForm, slot: e.currentTarget.value });
          }}
          name="slot"
          aria-label="Default select example"
        >
          {getSlot.map((item) => (
            <option value={item["id"]} key={item["id"]}>
              {item["day"]} {item["startTime"]}-{item["endTime"]}{" "}
              {item["remainingSeats"]} seats remaining
            </option>
          ))}
        </Form.Select>
        <Form.Text className="text-muted">{getFormErr.slot}</Form.Text>
      </Form.Group>

      <Button variant="primary" type="submit">
        Register
      </Button>
    </Form>
  );
}
