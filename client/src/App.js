import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BarcodeScanner from './components/BarcodeScanner';

function App() {
  const [currentTab, setCurrentTab] = useState('scan');
  const [foodItems, setFoodItems] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [calories, setCalories] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [matchedItem, setMatchedItem] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/fooditems');
      setFoodItems(response.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

 const handleSubmit = async (e) => {
   e.preventDefault(); // Prevent page reload
   console.log("Submitting form");

   try {
     const response = await axios.post('http://localhost:8080/api/fooditems', {
       name,
       category,
       calories: parseInt(calories),
       barcode,
       imageUrl
     });

     console.log("Item added:", response.data);
     setName('');
     setCategory('');
     setCalories('');
     setBarcode('');
     setImageUrl('');
     fetchItems(); // Refresh item list

   } catch (error) {
     console.error("Error adding item:", error.response?.data || error.message);
   }
 };

  const handleScan = useCallback((scannedCode) => {
    const found = foodItems.find(item => item.barcode === scannedCode);
    if (found) {
      setMatchedItem(found);
    } else {
      setMatchedItem({ notFound: true, barcode: scannedCode });
    }
  }, [foodItems]);

  useEffect(() => {
    if (matchedItem) {
      const timer = setTimeout(() => setMatchedItem(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [matchedItem]);

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyle = {
    padding: '0.8rem',
    marginBottom: '1rem',
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    padding: '0.8rem',
    width: '100%',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '1rem'
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>📱 Food Scanner App</h2>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        margin: '1rem 0'
      }}>
        <button onClick={() => setCurrentTab('scan')} style={{ flex: 1, padding: '0.5rem' }}>📷 Scan</button>
        <button onClick={() => setCurrentTab('add')} style={{ flex: 1, padding: '0.5rem' }}>➕ Add</button>
        <button onClick={() => setCurrentTab('search')} style={{ flex: 1, padding: '0.5rem' }}>🔍 Search</button>
      </div>

      {/* Scan Tab */}
      {currentTab === 'scan' && (

        <div>
          <BarcodeScanner onScan={handleScan} />


          {matchedItem && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: matchedItem.notFound ? '#ffe0e0' : '#e0ffe0',
              boxShadow: '0 0 5px rgba(0,0,0,0.1)',
            }}>
              {matchedItem.notFound ? (
                <p><strong>Item not found for barcode:</strong><br />{matchedItem.barcode}</p>
              ) : (
                <>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{matchedItem.name}</h3>
                  <p><strong>Category:</strong> {matchedItem.category}</p>
                  <p><strong>Calories:</strong> {matchedItem.calories}</p>
                  {matchedItem.imageUrl && (
                    <img
                      src={matchedItem.imageUrl}
                      alt={matchedItem.name}
                      style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Tab */}
      {currentTab === 'add' && (
        <form onSubmit={handleSubmit}>
          <input style={inputStyle} type="text" placeholder="Food Name" value={name} onChange={e => setName(e.target.value)} required />
          <input style={inputStyle} type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
          <input style={inputStyle} type="number" placeholder="Calories" value={calories} onChange={e => setCalories(e.target.value)} required />
          <input style={inputStyle} type="text" placeholder="Barcode" value={barcode} onChange={e => setBarcode(e.target.value)} required />
          <input style={inputStyle} type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          <button style={buttonStyle} type="submit">Add Food Item</button>
        </form>
      )}

      {/* Search Tab */}
      {currentTab === 'search' && (
        <div>
          <input
            style={inputStyle}
            type="text"
            placeholder="Search food"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Calories</th>
                  <th>Barcode</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, i) => (
                  <tr key={i} style={{ textAlign: 'center' }}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.calories}</td>
                    <td>{item.barcode}</td>
                    <td>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '40px', objectFit: 'cover' }} />
                      ) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
