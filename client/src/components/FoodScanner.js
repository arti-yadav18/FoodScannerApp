import React, { useState, useEffect } from "react";
import axios from "axios";

const FoodScanner = () => {
  const [food, setFood] = useState({ name: "", category: "", calories: "" });
  const [foodList, setFoodList] = useState([]);

  const fetchFoods = async () => {
    try {
      const response = await axios.get("/api/foods");
      setFoodList(response.data);
    } catch (error) {
      console.error("Error fetching food list", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood({ ...food, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/scan", food);
      setFood({ name: "", category: "", calories: "" });
      fetchFoods();
    } catch (error) {
      console.error("Error scanning food", error);
    }
  };

  return (
    <div>
      <h2>Scan New Food</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={food.name}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={food.category}
          onChange={handleChange}
          required
        />
        <input
          name="calories"
          placeholder="Calories"
          type="number"
          value={food.calories}
          onChange={handleChange}
          required
        />
        <button type="submit">Scan</button>
      </form>

      <h2>Scanned Food Items</h2>
      <ul>
        {foodList.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - {item.category} - {item.calories} cal
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodScanner;
