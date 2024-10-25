import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cities, setCities] = useState([]);
  const [newCityName, setNewCityName] = useState('');
  const [newCityPopulation, setNewCityPopulation] = useState('');

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
        body: JSON.stringify({ name: newCityName, population: parseInt(newCityPopulation, 10) }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }
      const newCity = await response.json();
      setCities([...cities, newCity]);
      setNewCityName('');
      setNewCityPopulation('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCity = async (id, updatedName, updatedPopulation) => {
    try {
      const response = await fetch(`/api/cities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updatedName, population: parseInt(updatedPopulation, 10) }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }
      const updatedCity = await response.json();
      console.log(updatedCity);
      setCities(cities.map(city =>
        city.id === id ? { ...city, name: updatedName, population: updatedPopulation } : city
      ));
    } catch (error) {
      console.error('Error updating city:', error);
    }
  };

  const handleDeleteCity = async (id) => {
    try {
      const response = await fetch(`/api/cities/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete city');
      }
      const returnResponse = await response.json();
      console.log(returnResponse);
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
            {city.name}, {city.population}
            <button onClick={() => {
              const updatedName = prompt('Enter new name:', city.name);
              const updatedPopulation = prompt('Enter new population:', city.population);
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
          type="number"
          placeholder="Population"
          value={newCityPopulation}
          onChange={e => setNewCityPopulation(e.target.value)}
        />
        <button onClick={handleCreateCity}>Create</button>
      </div>
    </div>
  );
}

export default App;
