import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './store/userStore';
import { useSocialStore } from './store/socialStore';
import { useEventStore } from './store/eventStore';
import { useJobStore } from './store/jobStore';
import { useProjectStore } from './store/projectStore';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { PdfRoom } from './pages/PdfRoom';
import { PaperEditor } from './pages/PaperEditor';
import { CalendarPage } from './pages/CalendarPage';
import { IdeaBoard } from './pages/IdeaBoard';
import { Feed } from './pages/Feed';
import { Profile } from './pages/Profile';
import { Vault } from './pages/Vault';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { EventCreate } from './pages/EventCreate';
import { MeetingRoom } from './pages/MeetingRoom';
import { JobsBoard } from './pages/JobsBoard';
import { JobDetail } from './pages/JobDetail';
import { JobPost } from './pages/JobPost';
import { MyApplications } from './pages/MyApplications';
import { ProjectTimelines } from './pages/ProjectTimelines';
import { Whiteboards } from './pages/Whiteboards';

function App() {
  const { user, isLoading, initialize } = useUserStore();
  const { initialize: initializeSocial } = useSocialStore();
  const { initialize: initializeEvents } = useEventStore();
  const { initialize: initializeJobs } = useJobStore();
  const { initialize: initializeProjects } = useProjectStore();

  useEffect(() => {
    initialize();
    initializeSocial();
    initializeEvents();
    initializeJobs();
    initializeProjects();
  }, [initialize, initializeSocial, initializeEvents, initializeJobs, initializeProjects]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Protected Routes */}
        <Route
          path="/workspace"
          element={user ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/pdf/:id"
          element={user ? <PdfRoom /> : <Navigate to="/" replace />}
        />
        <Route
          path="/editor/:id?"
          element={user ? <PaperEditor /> : <Navigate to="/" replace />}
        />
        <Route
          path="/calendar"
          element={user ? <CalendarPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/ideas"
          element={user ? <IdeaBoard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/feed"
          element={user ? <Feed /> : <Navigate to="/" replace />}
        />
        <Route
          path="/u/:id"
          element={user ? <Profile /> : <Navigate to="/" replace />}
        />
        <Route
          path="/vault"
          element={user ? <Vault /> : <Navigate to="/" replace />}
        />
        <Route
          path="/events"
          element={user ? <Events /> : <Navigate to="/" replace />}
        />
        <Route
          path="/events/new"
          element={user ? <EventCreate /> : <Navigate to="/" replace />}
        />
        <Route
          path="/events/:id"
          element={user ? <EventDetail /> : <Navigate to="/" replace />}
        />
        <Route
          path="/room/:id"
          element={user ? <MeetingRoom /> : <Navigate to="/" replace />}
        />
        
        {/* Jobs Routes */}
        <Route path="/jobs" element={<JobsBoard />} />
        <Route
          path="/jobs/new"
          element={user ? <JobPost /> : <Navigate to="/" replace />}
        />
        <Route
          path="/jobs/my"
          element={user ? <MyApplications /> : <Navigate to="/" replace />}
        />
        <Route path="/jobs/:id" element={<JobDetail />} />
        
        {/* Project Routes */}
        <Route
          path="/projects"
          element={user ? <ProjectTimelines /> : <Navigate to="/" replace />}
        />
        
        {/* Whiteboard Routes */}
        <Route
          path="/whiteboards"
          element={user ? <Whiteboards /> : <Navigate to="/" replace />}
        />
        <Route
          path="/whiteboards/:id"
          element={user ? <Whiteboards /> : <Navigate to="/" replace />}
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;