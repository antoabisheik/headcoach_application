import React, { useState, useEffect } from 'react';
import { Search, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';

const WorkoutSchedulePlanner = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [workoutPlan, setWorkoutPlan] = useState({});
  const [draggedExercise, setDraggedExercise] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [trainerId] = useState(5);
  const [userId] = useState(12);
  const [planId, setPlanId] = useState(null);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const API_BASE_URL = 'http://localhost:5000';

  const muscleGroups = [
    { id: 1, name: 'Chest', color: 'bg-blue-100 border-blue-300', image: 'chest.png' },
    { id: 2, name: 'Back', color: 'bg-green-100 border-green-300', image: 'back.png' },
    { id: 3, name: 'Shoulders', color: 'bg-yellow-100 border-yellow-300', image: 'shoulder.png' },
    { id: 4, name: 'Biceps', color: 'bg-purple-100 border-purple-300', image: 'biceps.png' },
    { id: 5, name: 'Triceps', color: 'bg-pink-100 border-pink-300', image: 'triceps.png' },
    { id: 6, name: 'Legs', color: 'bg-red-100 border-red-300', image: 'leg.png' },
    { id: 7, name: 'Core', color: 'bg-orange-100 border-orange-300', image: 'core.png' },
  ];

  const exerciseLibrary = [
    { id: 1, name: 'Bench Press', muscleId: 1, muscle: 'Chest', image: 'benchpress.png' },
    { id: 2, name: 'Dumbbell Fly', muscleId: 1, muscle: 'Chest', image: 'dbflys.png' },
    { id: 3, name: 'Push-ups', muscleId: 1, muscle: 'Chest', image: 'pushups.png' },
    { id: 4, name: 'Incline Press', muscleId: 1, muscle: 'Chest', image: '' },
    { id: 5, name: 'Pull-Ups', muscleId: 2, muscle: 'Back', image: 'pullups.png' },
    { id: 6, name: 'Barbell Rows', muscleId: 2, muscle: 'Back', image: '' },
    { id: 7, name: 'Lat Pulldown', muscleId: 2, muscle: 'Back', image: 'latpulldown.png' },
    { id: 8, name: 'Deadlift', muscleId: 2, muscle: 'Back', image: 'deadlift.png' },
    { id: 9, name: 'Overhead Press', muscleId: 3, muscle: 'Shoulders', image: 'overheadpress.png' },
    { id: 10, name: 'Lateral Raises', muscleId: 3, muscle: 'Shoulders', image: 'lateralraise.png' },
    { id: 11, name: 'Front Raises', muscleId: 3, muscle: 'Shoulders', image: 'frontraise.png' },
    { id: 12, name: 'Barbell Curl', muscleId: 4, muscle: 'Biceps', image: 'barbellcurl.png' },
    { id: 13, name: 'Hammer Curl', muscleId: 4, muscle: 'Biceps', image: 'hammercurl.png' },
    { id: 14, name: 'Preacher Curl', muscleId: 4, muscle: 'Biceps', image: 'preacher.png' },
    { id: 15, name: 'Tricep Pushdown', muscleId: 5, muscle: 'Triceps', image: 'triceppushdown.png' },
    { id: 16, name: 'Overhead Extension', muscleId: 5, muscle: 'Triceps', image: 'overheadext.png' },
    { id: 17, name: 'Dips', muscleId: 5, muscle: 'Triceps', image: 'dips.png' },
    { id: 18, name: 'Squats', muscleId: 6, muscle: 'Legs', image: 'squats.png' },
    { id: 19, name: 'Lunges', muscleId: 6, muscle: 'Legs', image: 'lunges.png' },
    { id: 20, name: 'Leg Press', muscleId: 6, muscle: 'Legs', image: 'legpress.png' },
    { id: 21, name: 'Romanian Deadlift', muscleId: 6, muscle: 'Legs', image: 'romaniandeadlift.png' },
    { id: 22, name: 'Plank', muscleId: 7, muscle: 'Core', image: 'plank.png' },
    { id: 23, name: 'Crunches', muscleId: 7, muscle: 'Core', image: 'crunches.png' },
    { id: 24, name: 'Russian Twists', muscleId: 7, muscle: 'Core', image: 'russiantwist.png' },
  ];

  useEffect(() => {
    fetchWorkoutPlan();
  }, [trainerId, userId]);

  const fetchWorkoutPlan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workouts/${trainerId}/${userId}`);
      const data = await response.json();
      
      setPlanId(data.planId);
      
      const plan = {};
      daysOfWeek.forEach(day => {
        plan[day] = {};
        muscleGroups.forEach(muscle => {
          plan[day][muscle.id] = [];
        });
      });

      data.workouts?.forEach(workout => {
        if (workout.exercise_id) {
          const exercise = exerciseLibrary.find(ex => ex.id === workout.exercise_id);
          if (exercise && plan[workout.day_name]) {
            if (!plan[workout.day_name][workout.muscle_id]) {
              plan[workout.day_name][workout.muscle_id] = [];
            }
            plan[workout.day_name][workout.muscle_id].push(exercise);
          }
        }
      });

      setWorkoutPlan(plan);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      initializeEmptyPlan();
      setLoading(false);
    }
  };

  const initializeEmptyPlan = () => {
    const initialPlan = {};
    daysOfWeek.forEach(day => {
      initialPlan[day] = {};
      muscleGroups.forEach(muscle => {
        initialPlan[day][muscle.id] = [];
      });
    });
    setWorkoutPlan(initialPlan);
  };

  const filteredExercises = exerciseLibrary.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle === 'all' || exercise.muscleId === parseInt(selectedMuscle);
    return matchesSearch && matchesMuscle;
  });

  const handleDragStart = (e, exercise) => {
    setDraggedExercise(exercise);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = async (e, day, muscleId) => {
    e.preventDefault();
    if (!draggedExercise) return;

    const alreadyExists = workoutPlan[day][muscleId].some(
      ex => ex.id === draggedExercise.id
    );

    if (alreadyExists) {
      showSaveStatus('Exercise already in this slot', 'warning');
      setDraggedExercise(null);
      return;
    }

    const updatedPlan = { ...workoutPlan };
    updatedPlan[day][muscleId] = [...updatedPlan[day][muscleId], draggedExercise];
    setWorkoutPlan(updatedPlan);
    
    await autoSave(day, muscleId, draggedExercise.id);
    setDraggedExercise(null);
  };

  const autoSave = async (day, muscleId, exerciseId) => {
    setSaveStatus('saving');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/workouts/auto-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          dayName: day,
          muscleId,
          exerciseId,
          position: 0
        })
      });

      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const removeExercise = async (day, muscleId, exerciseId) => {
    try {
      await fetch(
        `${API_BASE_URL}/api/workouts/${planId}/${day}/${muscleId}/${exerciseId}`,
        { method: 'DELETE' }
      );

      const updatedPlan = { ...workoutPlan };
      updatedPlan[day][muscleId] = updatedPlan[day][muscleId].filter(
        ex => ex.id !== exerciseId
      );
      setWorkoutPlan(updatedPlan);
      showSaveStatus('Exercise removed', 'success');
    } catch (error) {
      console.error('Error removing exercise:', error);
      showSaveStatus('Failed to remove', 'error');
    }
  };

  const showSaveStatus = (message, type) => {
    setSaveStatus(type);
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const getMuscleColor = (muscleId) => {
    return muscleGroups.find(m => m.id === muscleId)?.color || 'bg-gray-100';
  };

  const getTotalExercisesForDay = (day) => {
    return Object.values(workoutPlan[day] || {}).reduce(
      (sum, exercises) => sum + exercises.length, 0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading workout planner...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout Schedule Planner</h1>
          <p className="text-gray-600">
            Trainer #{trainerId} - Creating plan for User #{userId}
          </p>
        </div>

        {saveStatus && (
          <div className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 ${
            saveStatus === 'saved' ? 'bg-green-500 text-white' : 
            saveStatus === 'saving' ? 'bg-blue-500 text-white' : 
            saveStatus === 'error' ? 'bg-red-500 text-white' :
            'bg-yellow-500 text-white'
          }`}>
            {saveStatus === 'saved' ? 'Saved successfully' : 
             saveStatus === 'saving' ? 'Saving...' : 
             saveStatus === 'error' ? 'Save failed' :
             'Exercise already exists'}
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 bg-white rounded-lg shadow-sm p-4 h-fit sticky top-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Exercise Library</h2>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Muscle Groups</option>
                {muscleGroups.map(muscle => (
                  <option key={muscle.id} value={muscle.id}>{muscle.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredExercises.map(exercise => (
                <div
                  key={exercise.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, exercise)}
                  className="bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100 hover:border-gray-300 transition-colors overflow-hidden"
                >
                  <img 
                    src={exercise.image} 
                    alt={exercise.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900">{exercise.name}</div>
                        <div className="text-xs text-gray-500">{exercise.muscle}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-9 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Weekly Schedule</h2>
            
            <div className="space-y-4">
              {daysOfWeek.map(day => (
                <div key={day} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-900">{day}</h3>
                    <span className="text-sm text-gray-500">
                      {getTotalExercisesForDay(day)} exercises
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {muscleGroups.map(muscle => (
                      <div key={muscle.id}>
                        <div className="text-xs font-medium text-gray-700 mb-2 text-center flex flex-col items-center gap-1">
                          <img 
                            src={muscle.image} 
                            alt={muscle.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span>{muscle.name}</span>
                        </div>
                        <div
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, day, muscle.id)}
                          className={`min-h-24 p-2 rounded-lg border-2 border-dashed ${
                            workoutPlan[day]?.[muscle.id]?.length > 0
                              ? `${getMuscleColor(muscle.id)} border-solid`
                              : 'bg-gray-50 border-gray-300'
                          } transition-colors`}
                        >
                          <div className="space-y-1">
                            {workoutPlan[day]?.[muscle.id]?.map(exercise => (
                              <div
                                key={exercise.id}
                                className="bg-white rounded shadow-sm text-xs group relative overflow-hidden"
                              >
                                <img 
                                  src={exercise.image} 
                                  alt={exercise.name}
                                  className="w-full h-16 object-cover"
                                />
                                <div className="p-1.5">
                                  <div className="pr-5 font-medium text-gray-800">
                                    {exercise.name}
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeExercise(day, muscle.id, exercise.id)}
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 shadow-md"
                                >
                                  <Trash2 className="h-3 w-3 text-red-500 hover:text-red-700" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSchedulePlanner;