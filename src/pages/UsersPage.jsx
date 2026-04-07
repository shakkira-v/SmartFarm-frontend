import { useState } from "react";
import Layout from "../components/Layout";
import UserManagementTable from "../components/UserManagementTable";
import { UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";


const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);


  return (
    <Layout 
      title="User Management" 
      subtitle="Manage system operators, field managers and their permissions"
    >
      <div className="flex justify-end mb-6">
        <button
  onClick={() => setShowCreateModal(true)}
  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-bold shadow-lg shadow-blue-200 active:scale-95"
>
  <UserPlus size={18} /> Add New User
</button>
      </div>
      
      <UserManagementTable 
  currentUser={currentUser}
  showCreateModal={showCreateModal}
  setShowCreateModal={setShowCreateModal}
/>
    </Layout>
  );
};

export default UsersPage;
