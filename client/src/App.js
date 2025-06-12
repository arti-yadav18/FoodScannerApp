function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🍎 Food Scanner</h1>
      <p>Enter a food name to get nutritional information:</p>

      <input
        type="text"
        placeholder="e.g. Banana"
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button style={{ padding: "10px 20px" }}>Scan</button>
    </div>
  );
}

export default App;

