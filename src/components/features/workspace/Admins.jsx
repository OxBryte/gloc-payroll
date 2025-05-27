import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleWorkspace } from "../../hooks/useWorkspace";
import { useInviteAdmin } from "../../hooks/useAcceptAdmin";
import InviteAdminModal from "../../ui/InviteAdminModal";
import { useUser } from "../../hooks/useUser";

export default function Admins() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { slug } = useParams();
  const { singleWorkspace } = useGetSingleWorkspace(slug);
  const { user } = useUser();

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
        <h1 className="text-xl font-bold text-gray-800">Admins</h1>
        {user?._id === singleWorkspace?.userId?._id && (
          <button
            className="bg-c-color text-white px-6 py-2.5 rounded-lg cursor-pointer"
            onClick={() => setShowInviteModal(true)}
            disabled={isInvitingAdmin}
          >
            Add admin
          </button>
        )}
      </div>

      <div className="w-full">
        {singleWorkspace?.admins?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {singleWorkspace?.admins.map((admin) => (
              <div
                key={admin?.id}
                className="border border-black/10 w-full p-4 rounded-lg flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={admin?.avatar || "/default-avatar.png"}
                    alt={admin?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-sm md:text-lg font-semibold">
                      {admin.name}
                    </h2>
                    <p className="text-gray-600 text-xs mdtext-md">
                      {admin.email}
                    </p>
                  </div>
                </div>
                {user?._id === admin?.userId?._id && (
                  <span className="justify-self-right text-xs bg-c-color px-2.5 py-1 rounded-lg text-white/70">
                    You
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-[320px] bg-white rounded-lg flex flex-col items-center justify-center gap-4 p-6">
            <img src="/empty.svg" alt="No admins" className="w-20" />
            <p className="text-gray-500">No admins found.</p>
          </div>
        )}
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
