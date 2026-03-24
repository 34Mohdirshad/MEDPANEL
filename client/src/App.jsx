import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ManageCategories from './pages/admin/ManageCategories';
import ManageFiles from './pages/admin/ManageFiles';
import UploadFile from './pages/admin/UploadFile';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="files" element={<ManageFiles />} />
        <Route path="files/upload" element={<UploadFile />} />
      </Route>
    </Routes>
  );
}

export default App;
