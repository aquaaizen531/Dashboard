import ResponsiveModal from "@/features/custom/components/Modal";
import AddUserForm from "../components/add-user-form";
import { useUserStateStore } from "../hooks/use-add-user-modal";

const UserAddEditModal = () => {
  const { userModalOpen, setUserModalOpen } = useUserStateStore();

  return (
    <ResponsiveModal open={userModalOpen} onOpenChange={setUserModalOpen}>
      <AddUserForm />
    </ResponsiveModal>
  );
};

export default UserAddEditModal;
