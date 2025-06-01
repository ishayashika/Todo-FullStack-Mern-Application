import React, { useState, useEffect } from "react";
import classes from "./TaskList.module.css";
import TaskItem from "./TaskItem.jsx";
import toast from "react-hot-toast";
import axios from "axios";
import { FaPlus, FaTasks } from "react-icons/fa";

//Purpose: The TaskList component is responsible for managing
//  and displaying a list of tasks.

// Main Responsibilities:

// Fetching Tasks: It fetches the list of tasks from the 
// server when the component mounts and stores them in the 
// state (taskList).

const TaskList = () => {
  const [taskList, setTaskList] = useState([]);
  const [isAddingNew, setisAddingNew] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getTasks = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/task/mytask');
      setTaskList(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } 
    catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
      toast.error("Failed to load tasks: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  },[]);

  const addNewBtn = () => {
    setisAddingNew(!isAddingNew);
  }

  const addNewTask = async (e) => {
    e.preventDefault();
    if(newTask.length <= 0){
      toast.error("Task is empty");
      return;
    }
    try {
      const { data } = await axios.post("/api/task", {
        title: newTask,
        status: 'pending'
      });
      
      toast.success("New task created");
      setisAddingNew(false);
      setNewTask('');
      setTaskList([{...data}, ...taskList]);
      
      // Also refresh the task list from server to ensure we have the latest data
      getTasks();
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      toast.error("Failed to create task: " + (error.response?.data?.message || error.message));
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/task/${id}`);
      toast.success("Task successfully deleted");
      setTaskList(taskList.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete task");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className={classes.emptyState}>Loading tasks...</div>;
    }
    
    if (taskList.length === 0) {
      return (
        <div className={classes.emptyState}>
          <FaTasks style={{ fontSize: '3rem', marginBottom: '1rem', color: '#4e73df' }} />
          <p>No tasks found. Create a new task to get started!</p>
        </div>
      );
    }
    
    return (
      <table className={classes.taskList_table}>
        <thead>
          <tr>
            <th style={{textAlign: 'left', padding: '0 1rem 1rem', color: '#5a5c69', fontSize: '1.2rem'}}>Task</th>
            <th style={{textAlign: 'left', padding: '0 1rem 1rem', color: '#5a5c69', fontSize: '1.2rem'}}>Status</th>
            <th style={{textAlign: 'left', padding: '0 1rem 1rem', color: '#5a5c69', fontSize: '1.2rem'}}>Created</th>
            <th style={{textAlign: 'left', padding: '0 1rem 1rem', color: '#5a5c69', fontSize: '1.2rem'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taskList.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              deleteTask={deleteTask}
            />
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <div className={classes.topBar}>
        <h2 style={{ fontSize: '1.8rem', color: '#5a5c69', fontWeight: '600', margin: 0 }}>
          My Tasks
        </h2>
        <button type='button' onClick={addNewBtn} className={classes.addNew}>
          <FaPlus style={{ marginRight: '5px' }} />
          Add Task
        </button>
      </div>
      
      {isAddingNew && (
        <form className={classes.addNewForm} onSubmit={addNewTask}>
          <input 
            type='text'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button type="submit">Add</button>
        </form>
      )}

      {renderContent()}
    </div>
  );
};

export default TaskList; 