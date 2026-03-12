const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  exercise_name: {
    type: String,
    required: true,
    trim: true
  },
  sets: {
    type: Number,
    required: true,
    min: 1
  },
  reps: {
    type: Number,
    required: true,
    min: 1
  },
  duration_minutes: {
    type: Number,
    required: true,
    min: 0
  },
  workout_date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
