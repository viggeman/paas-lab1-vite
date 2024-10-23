// frontend (React)

import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cities, setCities] = useState([]);
  const [newCityName, setNewCityName] = useState('');
  const [newCityPopulation, setNewCityPopulation] = useState(''); // Updated to use population

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleCreateCity = async () => {
    try {
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCityName, population: parseInt(newCityPopulation, 10) }), // Updated to use population
      });
      const newCity = await response.json();
      setCities([...cities, newCity]);
      setNewCityName('');
      setNewCityPopulation(''); // Updated to use population
    } catch (error) {
      console.error('Error creating city:', error);
    }
  };

  const handleUpdateCity = async (id, updatedName, updatedPopulation) => { // Updated to use population
    try {
      await fetch(`/api/cities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updatedName, population: parseInt(updatedPopulation, 10) }), // Updated to use population
      });
      setCities(cities.map(city =>
        city.id === id ? { ...city, name: updatedName, population: updatedPopulation } : city // Updated to use population
      ));
    } catch (error) {
      console.error('Error updating city:', error);
    }
  };

  const handleDeleteCity = async (id) => {
    try {
      await fetch(`/api/cities/${id}`, { method: 'DELETE' });
      setCities(cities.filter(city => city.id !== id));
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };

  return (
    <div>
      <h1>Cities</h1>
      <ul>
        {cities.map(city => (
          <li key={city.id}>
            {city.name}, {city.population} {/* Updated to use population */}
            <button onClick={() => {
              const updatedName = prompt('Enter new name:', city.name);
              const updatedPopulation = prompt('Enter new population:', city.population); // Updated to use population
              if (updatedName && updatedPopulation) {
                handleUpdateCity(city.id, updatedName, updatedPopulation);
              }
            }}>
              Update
            </button>
            <button onClick={() => handleDeleteCity(city.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Add New City</h2>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newCityName}
          onChange={e => setNewCityName(e.target.value)}
        />
        <input
          type="number" // Changed to type "number" for population
          placeholder="Population"
          value={newCityPopulation} // Updated to use population
          onChange={e => setNewCityPopulation(e.target.value)} // Updated to use population
        />
        <button onClick={handleCreateCity}>Create</button>
      </div>
    </div>
  );
}

export default App;
