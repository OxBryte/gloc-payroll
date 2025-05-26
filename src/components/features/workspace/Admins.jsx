import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleWorkspace } from "../../hooks/useWorkspace";
import { useInviteAdmin } from "../../hooks/useAcceptAdmin";
import InviteAdminModal from "../../ui/InviteAdminModal";

export default function Admins() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { slug } = useParams();
  const { singleWorkspace } = useGetSingleWorkspace(slug);
  console.log("singleWorkspace", singleWorkspace.id);

  const { inviteFn, isPending: isInvitingAdmin } = useInviteAdmin();

  const handleInviteAdmin = async (email) => {
    try {
      const id = singleWorkspace?.id;

      await inviteFn({ body: { email }, id });
      setShowInviteModal(false);
    } catch (error) {
      console.error("Error inviting admin:", error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between w-full gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Admins</h1>
        <button
          className="bg-c-color text-white px-6 py-2.5 rounded-lg"
          onClick={() => setShowInviteModal(true)}
          disabled={isInvitingAdmin}
        >
          Add admin
        </button>
      </div>
      {showInviteModal && (
        <InviteAdminModal
          setIsOpen={setShowInviteModal}
          handleInviteAdmin={handleInviteAdmin}
          isInvitingAdmin={isInvitingAdmin}
        />
      )}
    </div>
  );
}
