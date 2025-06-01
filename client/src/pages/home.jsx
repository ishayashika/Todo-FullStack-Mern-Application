/**
 * Home Page Component
 * 
 * Main landing page after user authentication.
 * Features:
 * - Displays user's task list
 * - Provides task management functionality (create, view, edit, delete)
 * - Shows user profile information
 * - Protected route that requires authentication
 */

import React from 'react'
import Layout from "../components/Layout/Layout.jsx"
import Navbar from '../components/Navbar/Navbar.jsx'
import TaskList from '../components/TaskList/TaskList.jsx'

const home = () => {
  return (
    <Layout>
     <Navbar/>
     <TaskList/>
    </Layout>
  )
}

export default home 