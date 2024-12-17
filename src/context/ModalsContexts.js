import { createContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

export const ModalsContexts = createContext({});

export const ModalsContextsProvider = ({ children }) => {
  const [loadingAddSubscription, setLoadingAddSubscription] = useState(false);
  const [showAddSubscriptionModal, setShowAddSubscriptionModal] =
    useState(false);
  const handleOpenAddSubscriptionModal = () =>
    setShowAddSubscriptionModal(true);
  const handleCloseAddSubscriptionModal = () =>
    setShowAddSubscriptionModal(false);

  const [loadingEditSubscription, setLoadingEditSubscription] = useState(false);
  const [showEditSubscriptionModal, setShowEditSubscriptionModal] =
    useState(false);
  const handleOpenEditSubscriptionModal = () =>
    setShowEditSubscriptionModal(true);
  const handleCloseEditSubscriptionModal = () =>
    setShowEditSubscriptionModal(false);

  const [loadingDeleteSubscription, setLoadingDeleteSubscription] =
    useState(false);
  const [showDeleteSubscriptionModal, setShowDeleteSubscriptionModal] =
    useState(false);
  const handleOpenDeleteSubscriptionModal = () =>
    setShowDeleteSubscriptionModal(true);
  const handleCloseDeleteSubscriptionModal = () =>
    setShowDeleteSubscriptionModal(false);

  const value = {
    loadingDeleteSubscription,
    setLoadingDeleteSubscription,
    showDeleteSubscriptionModal,
    handleOpenDeleteSubscriptionModal,
    handleCloseDeleteSubscriptionModal,
    loadingAddSubscription,
    setLoadingAddSubscription,
    showAddSubscriptionModal,
    handleOpenAddSubscriptionModal,
    handleCloseAddSubscriptionModal,
    loadingEditSubscription,
    setLoadingEditSubscription,
    showEditSubscriptionModal,
    handleOpenEditSubscriptionModal,
    handleCloseEditSubscriptionModal,
  };

  return (
    <div>
      <ModalsContexts.Provider value={value}>
        {children}
      </ModalsContexts.Provider>
    </div>
  );
};
