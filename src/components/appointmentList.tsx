import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

export function AppointmentList({ isAdmin }) {
  const baseURl = "http://localhost:5000";

  const [getList, setList] = useState([]);

  const fetchList = async () => {
    const resp = await fetch(baseURl + "/appointment/list");
    const data = await resp.json();
    const arr = data.data;
    setList(arr);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchList();
    }
  }, [isAdmin]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>slot</th>
          <th>Full Name</th>
          <th>SID</th>
          <th>Email</th>
          <th>Time Slot</th>
        </tr>
      </thead>
      <tbody>
        {getList.length > 0 &&
          getList.map((user, index) => (
            <tr key={index}>
              <td key={index + 1}>{index + 1}</td>
              <td key={index + 2}>{user["name"]}</td>
              <td key={index + 3}>{user["sid"]}</td>
              <td key={index + 4}>{user["email"]}</td>
              <td key={index + 5}>{user["slot"]}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
