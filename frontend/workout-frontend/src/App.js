import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:5000/api/workouts';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState({
    exercise_name: '',
    sets: '',
    reps: '',
    duration_minutes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Fetch all workouts
  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(API_BASE);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  // Add new workout
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_BASE, formData);
      }
      setFormData({ exercise_name: '', sets: '', reps: '', duration_minutes: '' });
      fetchWorkouts();
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  // Edit workout
  const handleEdit = (workout) => {
    setEditingId(workout._id);
    setEditData(workout);
    setFormData({
      exercise_name: workout.exercise_name,
      sets: workout.sets,
      reps: workout.reps,
      duration_minutes: workout.duration_minutes
    });
  };

  // Delete workout
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏋️ Workout Tracker</h1>
      </header>

      <div className="container">
        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="workout-form">
          <h2>{editingId ? 'Edit Workout' : 'Add New Workout'}</h2>
          
          <input
            type="text"
            placeholder="Exercise Name"
            value={formData.exercise_name}
            onChange={(e) => setFormData({...formData, exercise_name: e.target.value})}
            required
          />
          
          <div className="form-row">
            <input
              type="number"
              placeholder="Sets"
              value={formData.sets}
              onChange={(e) => setFormData({...formData, sets: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Reps"
              value={formData.reps}
              onChange={(e) => setFormData({...formData, reps: e.target.value})}
              required
            />
          </div>
          
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
            required
          />
          
          <button type="submit">
            {editingId ? 'Update Workout' : 'Add Workout'}
          </button>
        </form>

        {/* Workouts List */}
        <div className="workouts-list">
          <h2>Your Workouts ({workouts.length})</h2>
          {workouts.length === 0 ? (
            <p>No workouts yet. Add one above!</p>
          ) : (
            workouts.map((workout) => (
              <div key={workout._id} className="workout-card">
                <div className="workout-details">
                  <h3>{workout.exercise_name}</h3>
                  <p>Sets: {workout.sets} | Reps: {workout.reps} | Duration: {workout.duration_minutes}min</p>
                  <small>{new Date(workout.createdAt).toLocaleDateString()}</small>
                </div>
                <div className="workout-actions">
                  <button onClick={() => handleEdit(workout)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(workout._id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
