import { useState } from 'react';
import './App.css';

function App() {
  const [cuisine, setCuisine] = useState('ghanaian');
  const [mealTime, setMealTime] = useState('breakfast');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cuisine, meal_time: mealTime })
      });
      setResult(await response.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🇬🇭🇳🇬 West African AI Menu Planner</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Cuisine:</label>
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="ghanaian">Ghanaian</option>
            <option value="nigerian">Nigerian</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Meal Time:</label>
          <select value={mealTime} onChange={(e) => setMealTime(e.target.value)}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Get Recommendation'}
        </button>
      </form>

      {result && (
        <div className="result">
          <h2>{result.meal}</h2>
          <p>{result.instructions}</p>
        </div>
      )}
    </div>
  );
}

export default App;