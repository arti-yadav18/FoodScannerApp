import React, { useState } from "react";
import axios from "axios";

function App() {
  const [food, setFood] = useState({ name: "", category: "", calories: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/scan", food);
      setMessage(`Food item '${res.data.name}' saved!`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save food.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Food Scanner</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} /><br />
        <input name="category" placeholder="Category" onChange={handleChange} /><br />
        <input name="calories" placeholder="Calories" type="number" onChange={handleChange} /><br />
        <button type="submit">Scan Food</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
