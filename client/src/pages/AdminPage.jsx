import MainLayout from '../components/Layout/MainLayout';
import AdminControls from '../components/Admin/AdminControls';
import UserManagement from '../components/Admin/UserManagement';
import { useSocket } from '../hooks/useSocket';

const AdminPage = () => {
  useSocket();
  
  return (
    <MainLayout title="Admin Panel">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <AdminControls />
        </div>
        <div>
          <UserManagement />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
