import { createContext, useContext, useState } from "react";
import { errorToast, successToast } from "../constants/toastAlerts";
import { ModalsContexts } from "./ModalsContexts";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { decrypt } from "../services/_crypto";
import { BASE_URL, baseName } from "../constants/base";
import axios from "axios";

export const ServicesContext = createContext({});

export const ServicesContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [clientCardsLoading, setClientCardsLoading] = useState([]);

  const [client, setClient] = useState({});
  const [detailedClient, setDetailedClient] = useState({});

  const [clients, setClients] = useState([]);
  const [clientCards, setClientCards] = useState([]);
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  const applicationJsonHeaders = {
    "Content-Type": "application/json",
    "X-Frame-Options": "DENY",
    "frame-ancestors": "self",
    Authorization: `Bearer ${
      window.sessionStorage.getItem("user")
        ? JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
        : ""
    }`,
  };

  const {
    setLoadingAddSubscription,
    setLoadingEditSubscription,
    setLoadingDeleteSubscription,
  } = useContext(ModalsContexts);

  // SUBSCRIPTIONS
  const getGetClientsKYC = async (initial, search) => {
    if (!search) {
      return errorToast("Search parameter is required");
    }

    if (initial) {
      setLoading(true);
    }

    try {
      const response = await axios(`${BASE_URL}/ecocash/clients/${search}`, {
        method: "GET",
        headers: applicationJsonHeaders,
      });

      setLoading(false);
      setClients(response?.data);
    } catch (e) {
      setLoading(false);
      handleError(e);
    }
  };

  const getDetailedClient = async (initial, pan) => {
    if (!pan) {
      return errorToast("Client is required!");
    }

    if (initial) {
      setLoading(true);
    }

    try {
      const response = await axios(
        `${BASE_URL}/ecocash/clients/client/${pan}`,
        {
          method: "GET",
          headers: applicationJsonHeaders,
        }
      );

      setLoading(false);
      setDetailedClient(response?.data);
    } catch (e) {
      setLoading(false);
      handleError(e);
    }
  };

  const getGetLinkedAccounts = async (initial, search) => {
    if (!search) {
      return errorToast("Search parameter is required");
    }

    if (initial) {
      setLinkedAccounts([]);
      setLoading(true);
    }

    try {
      const response = await axios(
        `${BASE_URL}/ecocash/subscribers/${search}`,
        {
          method: "GET",
          headers: applicationJsonHeaders,
        }
      );

      setLoading(false);
      setLinkedAccounts(response?.data);
    } catch (e) {
      setLoading(false);
      handleError(e);
    }
  };

  const addSubscription = async (
    selectedCard,
    msisdn,
    national_id,
    handleClose
  ) => {
    if (!selectedCard?.pan) {
      return errorToast("Select a card to link with the MSISDN!");
    }

    setLoadingAddSubscription(true);

    try {
      const response = await axios(
        `${BASE_URL}/ecocash/subscriber/link/create`,
        {
          method: "POST",
          headers: applicationJsonHeaders,
          data: JSON.stringify({
            msisdn,
            pan: selectedCard?.pan_encrypted,
            expiry_date: selectedCard?.expiry_date,
            national_id,
          }),
        }
      );

      handleClose();
      setLoadingAddSubscription(false);
      getGetLinkedAccounts(true, msisdn);
      successToast(response?.data?.info);
    } catch (e) {
      setLoadingAddSubscription(false);
      handleError(e);
    }
  };

  const editSubscription = async (
    msisdn,
    date_added,
    pan,
    expiry_date,
    national_id,
    linked_account,
    handleClose
  ) => {
    if (!pan || !msisdn || !expiry_date || !national_id || !linked_account) {
      return errorToast("Marked fields are required!");
    }

    setLoadingEditSubscription(true);

    try {
      const response = await axios(
        `${BASE_URL}/ecocash/subscriber/link/update`,
        {
          method: "PUT",
          headers: applicationJsonHeaders,
          data: JSON.stringify({
            msisdn,
            date_added,
            pan,
            expiry_date,
            national_id,
            linked_account,
          }),
        }
      );

      handleClose();
      setLoadingAddSubscription(false);
      getGetLinkedAccounts(true, msisdn);
      successToast(response?.data?.info);
    } catch (e) {
      setLoadingAddSubscription(false);
      handleError(e);
    }
  };

  const deleteSubscription = async (subscription, handleClose) => {
    if (!subscription?.pan) {
      return errorToast("Subscription to cancel required!");
    }

    setLoadingDeleteSubscription(true);

    try {
      const response = await axios(
        `${BASE_URL}/ecocash/subscriber/link/delete`,
        {
          method: "DELETE",
          headers: applicationJsonHeaders,
          data: JSON.stringify(subscription),
        }
      );

      handleClose();
      setLinkedAccounts([]);
      successToast(response?.data?.info);
    } catch (e) {
      setLoadingAddSubscription(false);
      handleError(e);
    }
  };

  const getClientCards = async (search) => {
    if (!search) {
      return errorToast("CIF or Wallet Account fields required!");
    }
    setClientCards([]);
    setClientCardsLoading(true);
    try {
      const response = await axios(
        `${BASE_URL}/ecocash/accounts/client/${search}`,
        {
          method: "GET",
          headers: applicationJsonHeaders,
        }
      );

      setClientCardsLoading(false);
      if (response?.data?.length === 0) {
        errorToast("Linkable Cards Not Found");
      } else {
        successToast("Select the card to link");
      }
      setClientCards(response?.data);
    } catch (e) {
      setClientCardsLoading(false);
      handleError(e);
    }
  };

  // Handle Error
  const handleError = (e) => {
    console.log(e);

    if (
      e.response?.status?.toString()?.startsWith(401) ||
      e.response?.status?.toString()?.startsWith(403)
    ) {
      navigate(baseName + "/login");
      return errorToast("This session is invalid");
    }
    if (e.response?.status?.toString()?.startsWith(406)) {
      navigate(baseName + "/login");
      return errorToast(e?.response?.data?.error);
    }
    if (e.response?.status?.toString()?.startsWith(4)) {
      return errorToast(
        e?.response?.data?.info ||
          Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString() ||
          e?.response?.statusText
      );
    }
    errorToast("Network or server challenge");
  };

  const value = {
    client,
    clients,
    loading,
    clientCards,
    detailedClient,
    linkedAccounts,
    clientCardsLoading,
    navigate,
    setClient,
    setClients,
    setLoading,
    getClientCards,
    setClientCards,
    addSubscription,
    editSubscription,
    getGetClientsKYC,
    setDetailedClient,
    getDetailedClient,
    setLinkedAccounts,
    deleteSubscription,
    getGetLinkedAccounts,
    setClientCardsLoading,
  };

  return (
    <div>
      <ServicesContext.Provider value={value}>
        {children}
      </ServicesContext.Provider>
    </div>
  );
};
