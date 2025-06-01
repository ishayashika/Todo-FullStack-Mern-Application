/**
 * TaskItem Component
 * 
 * Individual task item component that displays and manages a single task.
 * Features:
 * - Displays task title, description, and status
 * - Provides controls for editing and deleting tasks
 * - Allows marking tasks as complete/incomplete
 * - Handles task status updates
 * - Shows creation/update timestamps
 * - Visual indicators for task priority and status
 */

import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import classes from "./TaskItem.module.css";
import moment from 'moment';
import Modal from './Modal.jsx';
import { FaEdit, FaTrashAlt, FaClock } from 'react-icons/fa';

const TaskItem = ({ task, deleteTask }) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status || (task.completed ? 'completed' : 'pending'));

  const handleCheckboxClick = async() => {
    try {
      setIsLoading(true);
      const newCompleted = !isCompleted;
      const newStatus = newCompleted ? 'completed' : 'pending';
      
      await axios.put(`/api/task/${task._id}`, {
        completed: newCompleted,
        status: newStatus
      });
      
      setIsCompleted(newCompleted);
      setStatus(newStatus);
      toast.success("Task Updated Successfully");  
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task status");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      
      const updatedCompleted = status === 'completed';
      
      await axios.put(`/api/task/${task._id}`, {
        title: editedTitle,
        completed: updatedCompleted,
        status: status
      });
      
      setIsCompleted(updatedCompleted);
      task.title = editedTitle;
      task.status = status;
      
      toast.success("Task updated successfully");
      closeModal();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch(status) {
      case 'pending':
        return '#f6c23e';
      case 'in-progress':
        return '#36b9cc';
      case 'completed':
        return '#1cc88a';
      default:
        return '#6c757d';
    }
  };

  const getRowClassName = () => {
    let baseClass = classes.task_item;
    
    switch(status) {
      case 'pending':
        return `${baseClass} ${classes.task_pending}`;
      case 'in-progress':
        return `${baseClass} ${classes.task_inprogress}`;
      case 'completed':
        return `${baseClass} ${classes.task_completed}`;
      default:
        return baseClass;
    }
  };

  return (
    <>
      <tr className={getRowClassName()}>
        <td className={classes.task_name}>
          <div
            className={classes.checkbox}
            role='checkbox'
            aria-checked
            onChange={handleCheckboxClick}
            disabled={isLoading}
          >
            <input
              type='checkbox'
              checked={isCompleted}
              readOnly
              tabIndex={-1}
              disabled={isLoading}
            />
          </div>
          <p>{task.title}</p>
        </td>
        <td>
          <span 
            className={classes.status_badge} 
            style={{ backgroundColor: getStatusColor() }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </td>
        <td className={classes.date_cell}>
          <FaClock style={{ marginRight: '5px' }} />
          {moment(task.createdAt).format('MMM DD, YYYY')}
        </td>
        <td>
          <button
            type='button'
            className={classes.editBtn}
            onClick={openModal}
          >
            <FaEdit style={{ marginRight: '5px' }} />
            Edit
          </button>
          <button
            type='button'
            className={classes.deleteBtn}
            onClick={() => deleteTask(task._id)}
          >
            <FaTrashAlt style={{ marginRight: '5px' }} />
            Delete
          </button>
        </td>
      </tr>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Task">
        <div className="edit-form">
          <div className="form-group">
            <label htmlFor="taskTitle">Task Title</label>
            <input
              type="text"
              id="taskTitle"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <div className="status-options">
              <div 
                className={`status-option pending ${status === 'pending' ? 'active' : ''}`}
                onClick={() => handleStatusChange('pending')}
              >
                Pending
              </div>
              <div 
                className={`status-option in-progress ${status === 'in-progress' ? 'active' : ''}`}
                onClick={() => handleStatusChange('in-progress')}
              >
                In Progress
              </div>
              <div 
                className={`status-option completed ${status === 'completed' ? 'active' : ''}`}
                onClick={() => handleStatusChange('completed')}
              >
                Completed
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            <button className="save-btn" onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaskItem; 