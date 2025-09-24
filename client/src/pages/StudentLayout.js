// In client/src/pages/StudentLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';

function StudentLayout() {
  return (
    <div className="student-layout">
      <StudentNavbar />
      <main className="student-content">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;