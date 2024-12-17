import { createContext, useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { errorToast, successToast } from "../constants/toastAlerts";
import { BASE_URL } from "../constants/base";
import axios from "axios";
import { ModalsContexts } from "./ModalsContexts";
import { decrypt } from "../services/_crypto";
import { useNavigate } from "react-router-dom";
import { capitalize } from "../services/capitalize";

export const AdminContext = createContext({});

export const AdminContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [uploadingKycFile, setUploadingKycFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingManualUsers, setLoadingManualUsers] = useState(false);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [loadingLoanStatus, setLoadingLoanStaus] = useState(false);
  const [allUsersKYCFiles, setAllUsersKYCFiles] = useState([]);
  const [allLoanStatus, setAllLoanStatus] = useState([]);
  const [allLoanBook, setAllLoanBook] = useState([]);
  const [allLoansRate, setAllLoansRate] = useState([]);
  const [manualTransactions, setManualTransactions] = useState([]);
  const [loanStatus, setLoanStatus] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [inputTypes, setInputTypes] = useState([]);
  const [loanSeasons, setLoanSeasons] = useState([]);
  const [kycEntries, setKycEntries] = useState([]);
  const [kycManualUsers, setKycManualUsers] = useState([]);
  const [kycEditEntries, setKycEditEntries] = useState([]);
  const [entriesForAdjustment, setEntriesForAdjustment] = useState([]);
  const [paymentEntriesForAdjustment, setPaymentEntriesForAdjustment] =
    useState([]);
  const [groupedAuthorizations, setGroupedAuthorizations] = useState([]);
  const [cropTypes, setCropTypes] = useState([]);
  const [detailsKyc, setDetailsKyc] = useState({});
  const [farmerReport, setFarmerReport] = useState(null);
  const [loanReport, setLoanReport] = useState(null);
  const [farmerDto, setFarmerDto] = useState({});
  const [clientDetails, setClientDetails] = useState({});
  const [selectedDetails, setSelectedDetails] = useState({});
  const [selected, setSelected] = useState("Rates");
  const [uploadingDepotTransactionsFile, setUploadingDepotTransactionsFile] =
    useState(false);
  const [allUsersDepotTransactionsFiles, setAllUsersDepotTransactionsFiles] =
    useState([]);
  const [detailsDepotTransactions, setDetailsDepotTransactions] = useState({});
  const [uploadingLoanPaymentFile, setUploadingLoanPaymentFile] =
    useState(false);
  const [allUsersLoanPaymentFiles, setAllUsersLoanPaymentFiles] = useState([]);
  const [detailsLoanPayment, setDetailsLoanPayment] = useState({});
  const [fundsTransferSearch, setFundsTransferSearch] = useState([]);

  const {
    setLoadingNewSeason,
    setLoadingManagePoliticallyExposed,
    setLoadingReprocessTransactionsFile,
    setLoadingAuthorizeKYCEdit,
    setLoadingNewRate,
    setLoadingNewSpecialRate,
    setLoadingManageHighRisk,
    setLoadingEditKYC,
    setLoadingSubmitKYCFile,
    setLoadingNewDepotTran,
    setLoadingDeleteDepotTran,
    setLoadingSubmitDepotTranFile,
    setLoadingAuthorizeDepotTranFile,
    setLoadingAdjustPayment,
    setLoadingAdjustTransaction,
    setLoadingDeleteDepotTranFile,
    setLoadingNewLoanPayment,
    setLoadingNewFundsTransfer,
    setLoadingDeleteLoanPayment,
    setLoadingSubmitLoanPaymentFile,
    setLoadingAuthorizeLoanPaymentFile,
    setLoadingDeleteLoanPaymentFile,
    setLoadingDeleteKYCFile,
    setLoadingAuthorizeRequest,
    setLoadingActivateRate,
    setLoadingActivateSpecialRate,
    setLoadingFundsTransfer,
    setLoadingAuthorizeRate,
    setLoadingAuthorizeSpecialRate,
    setLoadingAuthorizeSeason,
    setLoadingAuthorizeKYCFile,
    setLoadingFundsTransferSearch,
  } = useContext(ModalsContexts);

  const submitKYCFile = async (ref) => {
    setUploadingKycFile(true);
    var file = ref?.current["files"]?.[0];

    if (!file) {
      setUploadingKycFile(false);
      return errorToast("Upload file is required");
    }

    const formdata = new FormData();
    formdata.append("file", file, file.name);
    try {
      const response = await axios(`${BASE_URL}/kyc/upload/kyc-file`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: formdata,
      });

      setUploadingKycFile(false);
      successToast(response?.data?.info);
      getKYCFiles("all", false);
    } catch (e) {
      setUploadingKycFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getKYCFiles = async (authRange, initial) => {
    if (initial) {
      setLoading(true);
      setAllUsersKYCFiles([]);
    }
    try {
      const response = await axios(
        `${BASE_URL}/kyc/get-kyc-files/${authRange}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setAllUsersKYCFiles(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerStatement = async (
    initial,
    season,
    cropType,
    facilityId,
    periodDate
  ) => {
    if (!periodDate) {
      return errorToast("Period date is required");
    }

    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 0,
          season,
          cropType,
          facilityId,
          periodDate,
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerRedemptions = async (
    initial,
    season,
    cropType,
    facilityId,
    periodDate,
    startDate,
    endDate
  ) => {
    if (!periodDate && (!startDate || !endDate)) {
      return errorToast("Period or date range is required");
    }

    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate + "-01";
      endDate = periodDate + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 2,
          season,
          cropType,
          facilityId,
          startDate,
          endDate,
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerAnalysis = async (
    initial,
    season,
    cropType,
    facilityId,
    periodDate,
    startDate,
    endDate
  ) => {
    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate + "-01";
      endDate = periodDate + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 6,
          season,
          cropType,
          facilityId,
          startDate,
          endDate,
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerSettlements = async (
    initial,
    season,
    cropType,
    facilityId,
    periodDate,
    startDate,
    endDate
  ) => {
    if (!periodDate && (!startDate || !endDate)) {
      return errorToast("Period or date range is required");
    }

    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate + "-01";
      endDate = periodDate + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 1,
          season,
          cropType,
          facilityId,
          startDate,
          endDate,
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };
  
  const getZWLFarmerStatement = async (
    initial,
    season,
    cropType,
    facilityId,
    periodDate,
    startDate,
    endDate
  ) => {
    if (!periodDate && (!startDate || !endDate)) {
      return errorToast("Period or date range is required");
    }

    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate?.substring(0, 7) + "-01";
      endDate = periodDate?.substring(0, 7) + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report-zwl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 0,
          season,
          cropType,
          facilityId,
          startDate,
          endDate,
          periodDate
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerLiquidations = async (
    initial,
    season,
    cropType,
    facilityId,
    periodDate,
    startDate,
    endDate
  ) => {
    if (!periodDate && (!startDate || !endDate)) {
      return errorToast("Period or date range is required");
    }

    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate + "-01";
      endDate = periodDate + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 3,
          season,
          cropType,
          facilityId,
          startDate,
          endDate,
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

   const getFarmerTransactionsMaster = async (
    initial,
    season,
    cropType,
    facilityId,
    periodDate,
    startDate,
    endDate
  ) => {
    if (!periodDate && (!startDate || !endDate)) {
      return errorToast("Period or date range is required");
    }

    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate + "-01";
      endDate = periodDate + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 4,
          season,
          cropType,
          facilityId,
          startDate,
          endDate,
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerPaymentsAdjustments = async (
    initial,
    season,
    cropType,
    facilityId
  ) => {
    
    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 10,
          season,
          cropType,
          facilityId,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerPaymentsReversals = async (
    initial,
    season,
    cropType,
    facilityId
  ) => {

    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 11,
          season,
          cropType,
          facilityId,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerPaymentsBackdated = async (
    initial,
    season,
    cropType,
    facilityId
  ) => {

    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 12,
          season,
          cropType,
          facilityId,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };
  
  const getFarmerTransactionsAdjustments = async (
    initial,
    season,
    cropType,
    facilityId
  ) => {
    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 7,
          season,
          cropType,
          facilityId,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerTransactionsReversals = async (
    initial,
    season,
    cropType,
    facilityId
  ) => {
    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 8,
          season,
          cropType,
          facilityId,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerTransactionsBackdated = async (
    initial,
    season,
    cropType,
    facilityId
  ) => {
    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 9,
          season,
          cropType,
          facilityId,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

   const getPaymentsAdjustments = async (
    initial,
    season,
    cropType
  ) => {
    
    if (initial) {
      setLoading(true);
      setLoanReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/loans-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 10,
          season,
          cropType,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setLoanReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getPaymentsReversals = async (
    initial,
    season,
    cropType
  ) => {

    if (initial) {
      setLoading(true);
      setLoanReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/loans-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 11,
          season,
          cropType,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setLoanReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getPaymentsBackdated = async (
    initial,
    season,
    cropType
  ) => {

    if (initial) {
      setLoading(true);
      setLoanReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/loans-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 12,
          season,
          cropType,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setLoanReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };
  
  const getTransactionsAdjustments = async (
    initial,
    season,
    cropType
  ) => {
    if (initial) {
      setLoading(true);
      setLoanReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/loans-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 7,
          season,
          cropType,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setLoanReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getTransactionsReversals = async (
    initial,
    season,
    cropType
  ) => {
    if (initial) {
      setLoading(true);
      setLoanReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/loans-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 8,
          season,
          cropType,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setLoanReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getTransactionsBackdated = async (
    initial,
    season,
    cropType
  ) => {
    if (initial) {
      setLoading(true);
      setLoanReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/loans-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 9,
          season,
          cropType,
          startDate: '2000-12-01',
          endDate: '2000-12-31',
        }),
      });

      setLoading(false);
      setLoanReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerLoanStatus = async (
    initial,
    season,
    cropType,
    facilityId,
    periodDate,
    startDate,
    endDate
  ) => {
    if (!periodDate && (!startDate || !endDate)) {
      return errorToast("Period or date range is required");
    }

    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate + "-01";
      endDate = periodDate + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setFarmerReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/client-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 5,
          season,
          cropType,
          facilityId,
          startDate,
          endDate,
        }),
      });

      setLoading(false);
      setFarmerReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoanRedemptions = async (
    initial,
    season,
    cropType,
    periodDate,
    startDate,
    endDate
  ) => {
    if (!periodDate && (!startDate || !endDate)) {
      return errorToast("Period or date range is required");
    }

    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate + "-01";
      endDate = periodDate + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setLoanReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/loans-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 2,
          season,
          cropType,
          startDate,
          endDate,
        }),
      });

      setLoading(false);
      setLoanReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoanSettlements = async (
    initial,
    season,
    cropType,
    periodDate,
    startDate,
    endDate
  ) => {
    if (!periodDate && (!startDate || !endDate)) {
      return errorToast("Period or date range is required");
    }

    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate + "-01";
      endDate = periodDate + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setLoanReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/loans-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 1,
          season,
          cropType,
          startDate,
          endDate,
        }),
      });

      setLoading(false);
      setLoanReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoanLiquidations = async (
    initial,
    season,
    cropType,
    periodDate,
    startDate,
    endDate
  ) => {
    if (!periodDate && (!startDate || !endDate)) {
      return errorToast("Period or date range is required");
    }

    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate + "-01";
      endDate = periodDate + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setLoanReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/loans-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 3,
          season,
          cropType,
          startDate,
          endDate,
        }),
      });

      setLoading(false);
      setLoanReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoanTransactionsMaster = async (
    initial,
    season,
    cropType,
    periodDate,
    startDate,
    endDate
  ) => {
    if (!periodDate && (!startDate || !endDate)) {
      return errorToast("Period or date range is required");
    }

    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate + "-01";
      endDate = periodDate + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setLoanReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/loans-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 4,
          season,
          cropType,
          startDate,
          endDate,
        }),
      });

      setLoading(false);
      setLoanReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoanLoanStatus = async (
    initial,
    season,
    cropType,
    periodDate,
    startDate,
    endDate
  ) => {
    if (!periodDate && (!startDate || !endDate)) {
      return errorToast("Period or date range is required");
    }

    if (periodDate) {
      const [year, month] = periodDate?.split("-");
      const lastDay = new Date(year, month, 0).getDate();
      startDate = periodDate + "-01";
      endDate = periodDate + "-" + lastDay;
    }

    if (initial) {
      setLoading(true);
      setLoanReport(null);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/loans-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          type: 5,
          season,
          cropType,
          startDate,
          endDate,
        }),
      });

      setLoading(false);
      setLoanReport(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getFarmerDto = async (initial, nationalId) => {
    if (initial) {
      setLoading(true);
      setFarmerDto([]);
    }

    if (!nationalId) {
      setLoading(false);
      return errorToast("National ID is required");
    }

    try {
      const response = await axios(
        `${BASE_URL}/kyc/get-kyc-statement-facilities/${nationalId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setFarmerDto(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getInputTypes = async () => {
    setInputTypes([]);
    try {
      const response = await axios(`${BASE_URL}/transactions/get-input-types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
      });
      setInputTypes(response?.data);
    } catch (e) {
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getUnitTypes = async () => {
    setUnitTypes([]);
    try {
      const response = await axios(`${BASE_URL}/transactions/get-unit-types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
      });
      setUnitTypes(response?.data);
    } catch (e) {
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getProductTypes = async () => {
    setProductTypes([]);
    try {
      const response = await axios(
        `${BASE_URL}/transactions/get-product-types`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );
      setProductTypes(response?.data);
    } catch (e) {
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getCropTypes = async () => {
    setCropTypes([]);
    try {
      const response = await axios(`${BASE_URL}/loan-seasons/crop-types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
      });
      setCropTypes(response?.data);
    } catch (e) {
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getKYCFileDetailed = async (fileId, initial) => {
    if (initial) {
      setLoading(true);
      setDetailsKyc({});
    }
    try {
      const response = await axios(
        `${BASE_URL}/kyc/get-kyc-and-entries/${fileId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setDetailsKyc(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getKYCManualUsers = async (initial, authRange, search) => {
    if (initial) {
      setLoadingManualUsers(true);
      setKycManualUsers([]);
    }

    if (!search) {
      setLoadingManualUsers(false);
      return errorToast("Search parameter is required");
    }

    try {
      const response = await axios(
        `${BASE_URL}/kyc/get-kyc-entries/${+authRange}/${search}/${"manual"}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoadingManualUsers(false);
      setKycManualUsers(response?.data);
    } catch (e) {
      setLoadingManualUsers(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getKYCEntries = async (initial, authRange, search) => {
    if (initial) {
      setLoading(true);
      setKycEntries([]);
    }

    if (!search) {
      setLoading(false);
      return errorToast("Search parameter is required");
    }

    try {
      const response = await axios(
        `${BASE_URL}/kyc/get-kyc-entries/${+authRange}/${search}/${"default"}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setKycEntries(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getKYCStatementEntries = async (initial, authRange, search) => {
    if (initial) {
      setLoading(true);
      setKycEntries([]);
    }

    if (!search) {
      setLoading(false);
      return errorToast("Search parameter is required");
    }

    try {
      const response = await axios(
        `${BASE_URL}/kyc/get-kyc-statement-entries/${+authRange}/${search}/${"default"}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setKycEntries(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getKYCEdits = async (initial) => {
    if (initial) {
      setLoading(true);
      setKycEditEntries([]);
    }
    try {
      const response = await axios(`${BASE_URL}/kyc/edits`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
      });

      setLoading(false);
      setKycEditEntries(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoanStatus = async (initial) => {
    if (initial) {
      setLoading(true);
      setAllLoanStatus([]);
    }
    try {
      const response = await axios(
        `${BASE_URL}/loan-status/get-loan-statuses`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setAllLoanStatus(response?.data);
    } catch (e) {
      setLoading(false);
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getGroupedAuthorizations = async (initial, category) => {
    if (initial) {
      setLoading(true);
      setGroupedAuthorizations([]);
    }
    try {
      const response = await axios(`${BASE_URL}/authorizations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({ category }),
      });

      setLoading(false);
      setGroupedAuthorizations(response?.data);
    } catch (e) {
      setLoading(false);
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitFundsTransferSearch = async (
    refno,
    season,
    croptype,
    start_date,
    end_date,
    handleClose
  ) => {
    if (!season && !croptype && !refno) {
      return errorToast("At least one field is required");
    }

    setLoadingFundsTransferSearch(true);
    setGroupedAuthorizations([]);
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/get-settlement-account-balances`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: JSON.stringify({
            season: !season ? null : season,
            croptype: !croptype ? null : croptype,
            refno: !refno ? null : refno,
            startDate: start_date,
            endDate: end_date,
          }),
        }
      );

      setLoadingFundsTransferSearch(false);
      setFundsTransferSearch(response?.data);
      handleClose();
    } catch (e) {
      setLoadingFundsTransferSearch(false);
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoansRate = async (initial) => {
    if (initial) {
      setLoading(true);
      setAllLoansRate([]);
    }
    try {
      const response = await axios(`${BASE_URL}/loan-rates/get-loan-rates`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
      });

      setLoading(false);
      setAllLoansRate(response?.data);
    } catch (e) {
      setLoading(false);
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoansSpecialRate = async (initial) => {
    if (initial) {
      setLoading(true);
      setAllLoansRate([]);
    }
    try {
      const response = await axios(
        `${BASE_URL}/loan-rates/get-special-loan-rates`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setAllLoansRate(response?.data);
    } catch (e) {
      setLoading(false);
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getDepotTransactionsFileDetailed = async (fileId, initial) => {
    if (initial) {
      setLoading(true);
      setDetailsDepotTransactions({});
    }
    try {
      const response = await axios(
        `${BASE_URL}/transactions/get-file-depot-transactions/${fileId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setDetailsDepotTransactions(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitDepotTransactionsFile = async (ref) => {
    setUploadingDepotTransactionsFile(true);
    var file = ref?.current["files"]?.[0];

    if (!file) {
      setUploadingDepotTransactionsFile(false);
      return errorToast("Upload file is required");
    }

    const formdata = new FormData();
    formdata.append("file", file, file.name);
    try {
      const response = await axios(
        `${BASE_URL}/transactions/upload/depot-transactions-file`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: formdata,
        }
      );

      setUploadingDepotTransactionsFile(false);
      successToast(response?.data?.info);
      getDepotTransactionsFiles("all", false);
    } catch (e) {
      setUploadingDepotTransactionsFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getDepotTransactionsFiles = async (authRange, initial) => {
    if (initial) {
      setLoading(true);
      setAllUsersDepotTransactionsFiles([]);
    }
    try {
      const response = await axios(
        `${BASE_URL}/transactions/get-depot-transaction-files/${authRange}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setAllUsersDepotTransactionsFiles(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getManualDepotTransactionsFile = async (initial) => {
    if (initial) {
      setLoading(true);
      setManualTransactions([]);
    }
    try {
      const response = await axios(
        `${BASE_URL}/transactions/manual-depot-transactions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setManualTransactions(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const deleteDepotTranFile = async (file, closeModal) => {
    if (file === null || file === undefined) {
      return errorToast("All fields are required");
    }

    setLoadingDeleteDepotTranFile(true);
    try {
      const response = await axios(
        `${BASE_URL}/transactions/delete-depot-transactions-file/${file?.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      setLoadingDeleteDepotTranFile(false);
      successToast(response?.data?.info);
      navigate("/depot-transaction-files");
    } catch (e) {
      setLoadingDeleteDepotTranFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const deleteDepotTran = async (transaction, closeModal) => {
    if (transaction === null || transaction === undefined) {
      return errorToast("All fields are required");
    }

    setLoadingDeleteDepotTran(true);
    try {
      const response = await axios(
        `${BASE_URL}/transactions/manual-depot-transactions/${transaction?.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      setLoadingDeleteDepotTran(false);
      getManualLoanPaymentFile(false);
      successToast(response?.data?.info);
    } catch (e) {
      setLoadingDeleteDepotTran(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitNewDepotTran = async (
    farmer,
    farmerId,
    transactionID,
    season,
    cropType,
    accountId,
    dMobile,
    fMobile,
    pType,
    notes,
    cost,
    units,
    input,
    tranDate,
    accCardNumber,
    inputType,
    depot,
    latitude = 0,
    longitude = 0,
    closeModal
  ) => {
    if (
      !farmer ||
      !farmerId ||
      !transactionID ||
      !season ||
      !cropType ||
      !accountId ||
      !dMobile ||
      !fMobile ||
      !pType ||
      !notes ||
      !cost ||
      !units ||
      !input ||
      !tranDate ||
      !accCardNumber ||
      !inputType ||
      !depot
    ) {
      return errorToast("Markerd fields are required");
    }
    setLoadingNewDepotTran(true);

    try {
      const response = await axios(
        `${BASE_URL}/transactions/upload/depot-transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: JSON.stringify({
            farmer,
            farmerId,
            transactionID,
            season,
            cropType,
            accountId,
            dMobile,
            fMobile,
            pType,
            notes:
              pType +
              " of " +
              capitalize(input) +
              " " +
              inputType +
              " priced at USD " +
              notes +
              " per " +
              units,
            cost,
            units,
            input: input?.toUpperCase(),
            tranDate,
            accCardNumber,
            inputType,
            depot,
            latitude,
            longitude,
          }),
        }
      );

      closeModal();
      setLoadingNewDepotTran(false);
      successToast(response?.data?.info);
      getManualDepotTransactionsFile(true);
    } catch (e) {
      setLoadingNewDepotTran(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitAdjustPayment = async (
    payment,
    tranAmount,
    rate,
    tranDate,
    multiplyRate,
    tranType,
    closeModal
  ) => {
    if (
      payment === null ||
      payment === undefined ||
      !tranAmount ||
      !multiplyRate ||
      !rate ||
      !tranType
    ) {
      return errorToast("All details are required");
    }
    setLoadingAdjustPayment(true);
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/stage-adjustment/${tranType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: JSON.stringify({
            ...payment,
            tranAmount: +tranAmount,
            multiplyRate: multiplyRate === "true" ? true : false,
            rate: +rate,
            tranDate,
            latitude: payment?.latitude === "NULL" ? null : payment?.latitude,
            longitude:
              payment?.longitude === "NULL" ? null : payment?.longitude,
          }),
        }
      );

      setLoadingAdjustPayment(false);
      successToast(response?.data?.info);
      getEntriesForAdjustment(
        true,
        payment?.refno,
        payment?.season,
        payment?.cropType
      );
      closeModal();
    } catch (e) {
      setLoadingAdjustPayment(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitAdjustTransaction = async (
    transaction,
    unitPrice,
    quantity,
    tranDate,
    tranType,
    closeModal
  ) => {
    if (
      transaction === null ||
      transaction === undefined ||
      !unitPrice ||
      !quantity ||
      !tranType
    ) {
      return errorToast("All details are required");
    }
    setLoadingAdjustTransaction(true);
    try {
      const response = await axios(
        `${BASE_URL}/transactions/stage-adjustment/${tranType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: JSON.stringify({
            ...transaction,
            notes: transaction?.notes?.replace(
              transaction?.notes?.split("USD ")?.[1]?.split(" per")?.[0],
              unitPrice
            ),
            cost: quantity,
            tranDate: tranDate,
            latitude:
              transaction?.latitude === "NULL" ? null : transaction?.latitude,
            longitude:
              transaction?.longitude === "NULL" ? null : transaction?.longitude,
          }),
        }
      );

      setLoadingAdjustTransaction(false);
      successToast(response?.data?.info);
      getEntriesForAdjustment(
        true,
        transaction?.farmerId,
        transaction?.season,
        transaction?.cropType
      );
      closeModal();
    } catch (e) {
      setLoadingAdjustTransaction(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitAuthorizeDepotTranFile = async (file, decision, closeModal) => {
    if (file === null || file === undefined || !decision) {
      return errorToast("Decision is required");
    }
    setLoadingAuthorizeDepotTranFile(true);
    try {
      const response = await axios(
        `${BASE_URL}/transactions/authorize-depot-transactions/${file?.id}/${
          decision === "true" ? true : false
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoadingAuthorizeDepotTranFile(false);
      successToast(response?.data?.info);
      closeModal();
      getDepotTransactionsFileDetailed(file?.id, false);
    } catch (e) {
      setLoadingAuthorizeDepotTranFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitReprocessTransactionsFile = async (
    file,
    decision,
    closeModal
  ) => {
    if (file === null || file === undefined || !decision) {
      return errorToast("Decision is required");
    }
    setLoadingReprocessTransactionsFile(true);
    try {
      const response = await axios(
        `${BASE_URL}/transactions/reprocess-depot-transactions/${file?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoadingReprocessTransactionsFile(false);
      successToast(response?.data?.info);
      closeModal();
      getDepotTransactionsFileDetailed(file?.id, false);
    } catch (e) {
      setLoadingReprocessTransactionsFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitDepotTranFileForAuth = async (file, closeModal) => {
    if (file === null || file === undefined) {
      return errorToast("All fields are required");
    }

    setLoadingSubmitDepotTranFile(true);
    try {
      const response = await axios(
        `${BASE_URL}/transactions/submit-for-auth-depot-transactions/${file?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      setLoadingSubmitDepotTranFile(false);
      successToast(response?.data?.info);
      getDepotTransactionsFileDetailed(file?.id, false);
    } catch (e) {
      setLoadingSubmitDepotTranFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getPaymentEntriesForAdjustment = async (
    initial,
    refno,
    season,
    croptype
  ) => {
    if (initial) {
      setLoading(true);
      setPaymentEntriesForAdjustment([]);
    }

    if (!season || !croptype) {
      setLoading(false);
      return errorToast("All fields are required");
    }

    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/get-entries-for-adjustment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: JSON.stringify({
            refno,
            season,
            croptype,
          }),
        }
      );

      setLoading(false);
      setPaymentEntriesForAdjustment(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getEntriesForAdjustment = async (initial, refno, season, croptype) => {
    if (initial) {
      setLoading(true);
      setEntriesForAdjustment([]);
    }

    if (!season || !croptype) {
      setLoading(false);
      return errorToast("All fields are required");
    }

    try {
      const response = await axios(
        `${BASE_URL}/transactions/get-entries-for-adjustment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: JSON.stringify({
            refno,
            season,
            croptype,
          }),
        }
      );

      setLoading(false);
      setEntriesForAdjustment(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoanBookData = async (initial, season, croptype, xperiod) => {
    if (initial) {
      setLoading(true);
      setAllLoanBook([]);
    }

    if (!season || !croptype || !xperiod) {
      setLoading(false);
      return errorToast("All fields are required");
    }

    try {
      const response = await axios(`${BASE_URL}/loan/generate-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          season,
          croptype,
          xperiod,
        }),
      });

      setLoading(false);
      setAllLoanBook(response?.data?.result);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitAuthorizeRequest = async (
    request,
    decision,
    reason,
    closeModal
  ) => {
    if (request === null || request === undefined || !decision || !reason) {
      return errorToast("All fields are required");
    }

    setLoadingAuthorizeRequest(true);
    try {
      const response = await axios(`${BASE_URL}/authorizations/authorization`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          reason,
          authId: request?.id,
          decision: decision === "true" ? true : false,
        }),
      });

      closeModal();
      setLoadingAuthorizeRequest(false);
      successToast(response?.data?.info);
      getGroupedAuthorizations(true, null);
    } catch (e) {
      setLoadingAuthorizeRequest(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitAuthorizeKYCEdit = async (account, decision, closeModal) => {
    if (account === null || account === undefined || !decision) {
      return errorToast("All fields are required");
    }

    setLoadingAuthorizeKYCEdit(true);
    try {
      const response = await axios(
        `${BASE_URL}/kyc/authorize-kyc-edit/${account?.id}/${
          decision === "true" ? true : false
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      setLoadingAuthorizeKYCEdit(false);
      successToast(response?.data?.info);
      getKYCEdits(false);
    } catch (e) {
      setLoadingAuthorizeKYCEdit(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitEditKYC = async (
    id,
    facilityId,
    surname,
    firstname,
    cropType,
    phone,
    productType,
    hectarage,
    district,
    province,
    nationalId,
    gender,
    season,
    closeModal
  ) => {
    if (
      !facilityId ||
      !surname ||
      !firstname ||
      !cropType ||
      !phone ||
      !productType ||
      !hectarage ||
      !district ||
      !province ||
      !nationalId ||
      !season ||
      !gender
    ) {
      return errorToast("All fields are required");
    }

    setLoadingEditKYC(true);
    try {
      const response = await axios(`${BASE_URL}/kyc/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          targetId: id,
          facilityId,
          surname,
          firstname,
          cropType,
          phone,
          productType,
          hectarage,
          district,
          province,
          nationalId,
          gender,
          season,
        }),
      });

      closeModal();
      setLoadingEditKYC(false);
      successToast(response?.data?.info);
    } catch (e) {
      setLoadingEditKYC(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitKYCFileForAuth = async (file, closeModal) => {
    if (file === null || file === undefined) {
      return errorToast("All fields are required");
    }

    setLoadingSubmitKYCFile(true);
    try {
      const response = await axios(
        `${BASE_URL}/kyc/authorize-kyc/${file?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      setLoadingSubmitKYCFile(false);
      successToast(response?.data?.info);
      getKYCFileDetailed(file?.id, false);
    } catch (e) {
      setLoadingSubmitKYCFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const deleteKYCFile = async (file, closeModal) => {
    if (file === null || file === undefined) {
      return errorToast("All fields are required");
    }

    setLoadingDeleteKYCFile(true);
    try {
      const response = await axios(`${BASE_URL}/kyc/delete-kyc/${file?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
      });

      closeModal();
      setLoadingDeleteKYCFile(false);
      successToast(response?.data?.info);
      navigate("/client-upload-files");
    } catch (e) {
      setLoadingDeleteKYCFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitAuthorizeSeason = async (season, decision, closeModal) => {
    if (season === null || season === undefined) {
      return errorToast("Season is required");
    }

    if (!decision) {
      return errorToast("Decision is required");
    }

    setLoadingAuthorizeSeason(true);

    try {
      const response = await axios(
        `${BASE_URL}/loan-seasons/season-authorization/${season?.id}/${
          decision === "true" ? true : false
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      successToast(response?.data?.info);
      getLoanSeasons(false, "all");
      setLoadingAuthorizeSeason(false);
    } catch (e) {
      setLoadingAuthorizeSeason(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitManageHighRisk = async (account, decision, closeModal) => {
    if (account === null || account === undefined) {
      return errorToast("Account is required");
    }

    if (!decision) {
      return errorToast("Decision is required");
    }

    setLoadingManageHighRisk(true);

    try {
      const response = await axios(
        `${BASE_URL}/kyc/mark-high-risk/${account?.id}/${
          decision === "true" ? true : false
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      successToast(response?.data?.info);
      setLoadingManageHighRisk(false);
    } catch (e) {
      setLoadingManageHighRisk(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitManagePoliticallyExposed = async (
    account,
    decision,
    closeModal
  ) => {
    if (account === null || account === undefined) {
      return errorToast("Account is required");
    }

    if (!decision) {
      return errorToast("Decision is required");
    }

    setLoadingManagePoliticallyExposed(true);

    try {
      const response = await axios(
        `${BASE_URL}/kyc/politically-expose/${account?.id}/${
          decision === "true" ? true : false
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      successToast(response?.data?.info);
      setLoadingManagePoliticallyExposed(false);
    } catch (e) {
      setLoadingManagePoliticallyExposed(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitAuthorizeKYCFile = async (file, decision, closeModal) => {
    if (file === null || file === undefined) {
      return errorToast("File is required");
    }

    if (!decision) {
      return errorToast("Decision is required");
    }

    setLoadingAuthorizeKYCFile(true);

    try {
      const response = await axios(
        `${BASE_URL}/kyc/authorize-kyc/${file?.id}/${
          decision === "true" ? true : false
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      setLoadingAuthorizeKYCFile(false);
      successToast(response?.data?.info);
      getKYCFileDetailed(file?.id, false);
    } catch (e) {
      setLoadingAuthorizeKYCFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitAuthorizeRate = async (rate, decision, active, closeModal) => {
    if (rate === null || rate === undefined) {
      return errorToast("Rate is required");
    }

    if (!decision) {
      return errorToast("Decision is required");
    }

    if (!active) {
      return errorToast("Rate status is required");
    }

    setLoadingAuthorizeRate(true);

    try {
      const response = await axios(`${BASE_URL}/loan-rates/authorize`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          id: rate?.id,
          decision: decision === "true" ? true : false,
          isActive: active === "true" ? true : false,
        }),
      });

      closeModal();
      successToast(response?.data?.info);
      getLoansRate(false);
      setLoadingAuthorizeRate(false);
    } catch (e) {
      setLoadingAuthorizeRate(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitAuthorizeSpecialRate = async (
    rate,
    decision,
    active,
    closeModal
  ) => {
    if (rate === null || rate === undefined) {
      return errorToast("Rate is required");
    }

    if (!decision) {
      return errorToast("Decision is required");
    }

    if (!active) {
      return errorToast("Rate status is required");
    }

    setLoadingAuthorizeSpecialRate(true);

    try {
      const response = await axios(`${BASE_URL}/loan-rates/authorize-farmer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          id: rate?.id,
          decision: decision === "true" ? true : false,
          isActive: active === "true" ? true : false,
        }),
      });

      closeModal();
      successToast(response?.data?.info);
      getLoansSpecialRate(false);
      setLoadingAuthorizeSpecialRate(false);
    } catch (e) {
      setLoadingAuthorizeSpecialRate(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitActivateRate = async (rate, active, closeModal) => {
    if (rate === null || rate === undefined) {
      return errorToast("Rate is required");
    }

    if (!active) {
      return errorToast("Rate status is required");
    }

    setLoadingActivateRate(true);

    try {
      const response = await axios(`${BASE_URL}/loan-rates/activate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          id: rate?.id,
          decision: true,
          isActive: active === "true" ? true : false,
        }),
      });

      closeModal();
      successToast(response?.data?.info);
      getLoansRate(false);
      setLoadingActivateRate(false);
    } catch (e) {
      setLoadingActivateRate(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitActivateSpecialRate = async (rate, active, closeModal) => {
    if (rate === null || rate === undefined) {
      return errorToast("Rate is required");
    }

    if (!active) {
      return errorToast("Rate status is required");
    }

    setLoadingActivateSpecialRate(true);

    try {
      const response = await axios(`${BASE_URL}/loan-rates/activate-farmer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          id: rate?.id,
          decision: true,
          isActive: active === "true" ? true : false,
        }),
      });

      closeModal();
      successToast(response?.data?.info);
      getLoansSpecialRate(false);
      setLoadingActivateSpecialRate(false);
    } catch (e) {
      setLoadingActivateSpecialRate(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitNewRate = async (
    season,
    croptype,
    distribution_fee,
    establishment_fee,
    insurance_fee,
    normal_interest,
    normal_interest_start_date,
    normal_interest_end_date,
    penalty_interest,
    penalty_interest_start_date,
    penalty_interest_end_date,
    rate_start_date,
    rate_end_date,
    daysInYear,
    closeModal
  ) => {
    if (
      !season ||
      !croptype ||
      !distribution_fee ||
      !establishment_fee ||
      !insurance_fee ||
      !normal_interest ||
      !normal_interest_start_date ||
      !normal_interest_end_date ||
      !penalty_interest ||
      !penalty_interest_start_date ||
      !penalty_interest_end_date ||
      !rate_start_date ||
      !rate_end_date ||
      !daysInYear
    ) {
      return errorToast("All fields are required");
    }

    setLoadingNewRate(true);

    try {
      const response = await axios(`${BASE_URL}/loan-rates/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({
          season,
          croptype,
          distribution_fee: +distribution_fee,
          establishment_fee: +establishment_fee,
          insurance_fee: +insurance_fee,
          normal_interest: +normal_interest,
          normal_interest_start_date,
          normal_interest_end_date,
          penalty_interest: +penalty_interest,
          penalty_interest_start_date,
          penalty_interest_end_date,
          isRateActive: false,
          rate_start_date,
          rate_end_date,
          daysInYear: +daysInYear,
        }),
      });

      closeModal();
      successToast(response?.data?.info);
      getLoansRate(false);
      setLoadingNewRate(false);
    } catch (e) {
      setLoadingNewRate(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitNewSpecialRate = async (
    refno,
    season,
    croptype,
    distribution_fee,
    establishment_fee,
    insurance_fee,
    normal_interest,
    normal_interest_start_date,
    normal_interest_end_date,
    penalty_interest,
    penalty_interest_start_date,
    penalty_interest_end_date,
    rate_start_date,
    rate_end_date,
    daysInYear,
    closeModal
  ) => {
    if (
      !season ||
      !croptype ||
      !distribution_fee ||
      !establishment_fee ||
      !insurance_fee ||
      !normal_interest ||
      !normal_interest_start_date ||
      !normal_interest_end_date ||
      !penalty_interest ||
      !penalty_interest_start_date ||
      !penalty_interest_end_date ||
      !rate_start_date ||
      !rate_end_date ||
      !daysInYear
    ) {
      return errorToast("All fields are required");
    }

    setLoadingNewSpecialRate(true);

    try {
      const response = await axios(
        `${BASE_URL}/loan-rates/create-farmer/${refno}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: JSON.stringify({
            season,
            croptype,
            distribution_fee: +distribution_fee,
            establishment_fee: +establishment_fee,
            insurance_fee: +insurance_fee,
            normal_interest: +normal_interest,
            normal_interest_start_date,
            normal_interest_end_date,
            penalty_interest: +penalty_interest,
            penalty_interest_start_date,
            penalty_interest_end_date,
            isRateActive: false,
            rate_start_date,
            rate_end_date,
            daysInYear: +daysInYear,
          }),
        }
      );

      closeModal();
      successToast(response?.data?.info);
      getLoansRate(false);
      setLoadingNewSpecialRate(false);
    } catch (e) {
      setLoadingNewSpecialRate(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitNewSeason = async (season, value, closeModal) => {
    if (!value) {
      return errorToast("Season is required");
    }
    setLoadingNewSeason(true);

    var url = "";
    var options = {};

    if (season === null || season === undefined) {
      url = `${BASE_URL}/loan-seasons/season`;
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({ season: value }),
      };
    } else {
      url = `${BASE_URL}/loan-seasons/edit-season/${season?.id}`;
      options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({ season: value }),
      };
    }
    try {
      const response = await axios(url, options);

      closeModal();
      setLoadingNewSeason(false);
      successToast(response?.data?.info);
      getLoanSeasons(false, "all");
    } catch (e) {
      setLoadingNewSeason(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoanSeasons = async (initial, authorized) => {
    if (initial) {
      setLoading(true);
      setLoanSeasons([]);
    }

    var url = "";
    var options = {};

    if (authorized === "all") {
      url = `${BASE_URL}/loan-seasons/all`;
      options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
      };
    } else {
      url = `${BASE_URL}/loan-seasons`;
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({ authorized }),
      };
    }

    try {
      const response = await axios(url, options);
      setLoading(false);
      setLoanSeasons(response?.data);
    } catch (e) {
      setLoading(false);
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoanState = async (initial, refno) => {
    if (initial) {
      setLoadingLoanStaus(true);
      setLoanStatus([]);
    }

    try {
      const response = await axios(
        `${BASE_URL}/loan-status/get-loan-statuses/${refno}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoadingLoanStaus(false);
      setLoanStatus(response?.data);
    } catch (e) {
      setLoadingLoanStaus(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getClientDetails = async (initial, userId) => {
    if (initial) {
      setLoading(true);
      setClientDetails({});
    }

    try {
      const response = await axios(`${BASE_URL}/kyc/get-kyc/${+userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
      });
      setLoading(false);
      setClientDetails(response?.data);
    } catch (e) {
      setLoading(false);
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getSelectedDetails = async (selected, userId) => {
    if (!selected?.id) {
      return errorToast("Details ID is missing");
    }

    setLoadingSelected(true);

    try {
      const response = await axios(
        `${BASE_URL}/authorizations/detailed/${selected?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );
      setLoadingSelected(false);
      setSelectedDetails(response?.data);
    } catch (e) {
      setLoadingSelected(false);
      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoanPaymentFileDetailed = async (fileId, initial) => {
    if (initial) {
      setLoading(true);
      setDetailsLoanPayment({});
    }
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/get-file-loan-payments/${fileId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setDetailsLoanPayment(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitLoanPaymentFile = async (ref) => {
    setUploadingLoanPaymentFile(true);
    var file = ref?.current["files"]?.[0];

    if (!file) {
      setUploadingLoanPaymentFile(false);
      return errorToast("Upload file is required");
    }

    const formdata = new FormData();
    formdata.append("file", file, file.name);
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/upload/loan-payments-file`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: formdata,
        }
      );

      setUploadingLoanPaymentFile(false);
      successToast(response?.data?.info);
      getLoanPaymentFiles("all", false);
    } catch (e) {
      setUploadingLoanPaymentFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getLoanPaymentFiles = async (authRange, initial) => {
    if (initial) {
      setLoading(true);
      setAllUsersLoanPaymentFiles([]);
    }
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/get-loan-payment-files/${authRange}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setAllUsersLoanPaymentFiles(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const getManualLoanPaymentFile = async (initial) => {
    if (initial) {
      setLoading(true);
      setManualTransactions([]);
    }
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/manual-loan-payments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoading(false);
      setManualTransactions(response?.data);
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const deleteLoanPaymentFile = async (file, closeModal) => {
    if (file === null || file === undefined) {
      return errorToast("All fields are required");
    }

    setLoadingDeleteLoanPaymentFile(true);
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/delete-loan-payments-file/${file?.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      setLoadingDeleteLoanPaymentFile(false);
      successToast(response?.data?.info);
      navigate("/loan-payments-files");
    } catch (e) {
      setLoadingDeleteLoanPaymentFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const deleteLoanPayment = async (transaction, closeModal) => {
    if (transaction === null || transaction === undefined) {
      return errorToast("All fields are required");
    }

    setLoadingDeleteLoanPayment(true);
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/manual-loan-payments/${transaction?.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      setLoadingDeleteLoanPayment(false);
      successToast(response?.data?.info);
    } catch (e) {
      setLoadingDeleteLoanPayment(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitNewLoanPayment = async (
    refno,
    season,
    cropType,
    tranSource,
    tranSourceID,
    tranType,
    multiplyRate,
    rate,
    tranAmount,
    tranDescription,
    tranDate,
    closeModal
  ) => {
    if (
      !refno ||
      !season ||
      !cropType ||
      !tranSource ||
      !tranSourceID ||
      !tranType ||
      !multiplyRate ||
      !rate ||
      !tranAmount ||
      !tranDescription ||
      !tranDate
    ) {
      return errorToast("Markerd fields are required");
    }
    setLoadingNewLoanPayment(true);
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/upload/loan-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: JSON.stringify({
            refno,
            season,
            cropType,
            tranSource,
            tranSourceID,
            popFileId: null,
            tranType,
            multiplyRate: multiplyRate === "true" ? true : false,
            rate: +rate,
            tranAmount: +tranAmount,
            tranDescription,
            tranDate,
            effectiveDate: tranDate,
          }),
        }
      );

      closeModal();
      setLoadingNewLoanPayment(false);
      successToast(response?.data?.info);
      getManualLoanPaymentFile(true);
    } catch (e) {
      setLoadingNewLoanPayment(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitNewFundsTransfer = async (
    id,
    balance,
    season,
    refno,
    croptype,
    targetSeason,
    targetCropType,
    targetRefno,
    amount,
    notes,
    tranDate,
    closeModal
  ) => {
    if (
      !refno ||
      !season ||
      !croptype ||
      !targetSeason ||
      !targetCropType ||
      !targetRefno ||
      !tranDate ||
      !amount ||
      !notes
    ) {
      return errorToast("Markerd fields are required");
    }
    if (amount > balance) {
      return errorToast("Amount exceeds available balance");
    }
    setLoadingNewFundsTransfer(true);
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/stage-funds-transfer/${"FTR01"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: JSON.stringify({
            id,
            refno,
            season,
            croptype,
            targetRefno,
            targetSeason,
            targetCropType,
            tranType: "FTR01",
            tranDescription: notes,
            rate: 1,
            tranAmount: +amount,
            tranDate,
          }),
        }
      );

      closeModal();
      setLoadingNewFundsTransfer(false);
      successToast(response?.data?.info);
      getManualLoanPaymentFile(true);
    } catch (e) {
      setLoadingNewFundsTransfer(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitNewFundsRefund = async (
    id,
    balance,
    season,
    refno,
    croptype,
    amount,
    notes,
    closeModal
  ) => {
    if (!refno || !season || !croptype || !amount || !notes) {
      return errorToast("Markerd fields are required");
    }
    if (amount > balance) {
      return errorToast("Amount exceeds available balance");
    }
    setLoadingNewFundsTransfer(true);
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/stage-funds-refund/${"FRN01"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: JSON.stringify({
            id,
            refno,
            season,
            croptype,
            tranType: "FRN01",
            tranDescription: notes,
            rate: 1,
            tranAmount: +amount,
          }),
        }
      );

      closeModal();
      setLoadingNewFundsTransfer(false);
      successToast(response?.data?.info);
      getManualLoanPaymentFile(true);
    } catch (e) {
      setLoadingNewFundsTransfer(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitFundsTransfer = async (
    refno,
    season,
    cropType,
    tranSource,
    tranSourceID,
    popFileId,
    tranType,
    tranAmount,
    tranDescription,
    tranDate,
    effectiveDate,
    closeModal
  ) => {
    if (
      !refno ||
      !season ||
      !cropType ||
      !tranSource ||
      !tranSourceID ||
      !tranType ||
      !tranAmount ||
      !tranDate ||
      !effectiveDate
    ) {
      return errorToast("Markerd fields are required");
    }
    setLoadingFundsTransfer(true);
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/upload/loan-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
          data: JSON.stringify({
            refno,
            season,
            cropType,
            tranSource,
            tranSourceID,
            popFileId: null,
            tranType,
            tranAmount: +tranAmount,
            tranDescription,
            tranDate,
            effectiveDate,
          }),
        }
      );

      closeModal();
      setLoadingFundsTransfer(false);
      successToast(response?.data?.info);
      getManualLoanPaymentFile(true);
    } catch (e) {
      setLoadingFundsTransfer(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitAuthorizeLoanPaymentFile = async (file, decision, closeModal) => {
    if (file === null || file === undefined || !decision) {
      return errorToast("Decision is required");
    }
    setLoadingAuthorizeLoanPaymentFile(true);
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/authorize-loan-payments/${file?.id}/${
          decision === "true" ? true : false
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      setLoadingAuthorizeLoanPaymentFile(false);
      successToast(response?.data?.info);
      closeModal();
      getLoanPaymentFileDetailed(file?.id, false);
    } catch (e) {
      setLoadingAuthorizeLoanPaymentFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const submitLoanPaymentFileForAuth = async (file, closeModal) => {
    if (file === null || file === undefined) {
      return errorToast("All fields are required");
    }

    setLoadingSubmitLoanPaymentFile(true);
    try {
      const response = await axios(
        `${BASE_URL}/loan-payments/submit-for-auth-loan-payments/${file?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(decrypt(window.sessionStorage.getItem("user")))
                ?.jwtToken
            }`,
          },
        }
      );

      closeModal();
      setLoadingSubmitLoanPaymentFile(false);
      successToast(response?.data?.info);
      getLoanPaymentFileDetailed(file?.id, false);
    } catch (e) {
      setLoadingSubmitLoanPaymentFile(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(406)) {
        navigate("/login");
        return errorToast(e?.response?.data?.error);
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const value = {
    loading,
    selected,
    cropTypes,
    farmerDto,
    unitTypes,
    inputTypes,
    detailsKyc,
    loanStatus,
    loanReport,
    kycEntries,
    loanSeasons,
    allLoanBook,
    productTypes,
    allLoansRate,
    farmerReport,
    clientDetails,
    allLoanStatus,
    kycEditEntries,
    kycManualUsers,
    loadingSelected,
    selectedDetails,
    uploadingKycFile,
    allUsersKYCFiles,
    loadingLoanStatus,
    detailsLoanPayment,
    manualTransactions,
    loadingManualUsers,
    fundsTransferSearch,
    entriesForAdjustment,
    groupedAuthorizations,
    detailsDepotTransactions,
    allUsersLoanPaymentFiles,
    uploadingLoanPaymentFile,
    paymentEntriesForAdjustment,
    uploadingDepotTransactionsFile,
    allUsersDepotTransactionsFiles,
    navigate,
    setLoading,
    setSelected,
    getKYCEdits,
    getKYCFiles,
    setFarmerDto,
    getFarmerDto,
    getCropTypes,
    getLoanState,
    getLoansRate,
    setUnitTypes,
    getUnitTypes,
    submitEditKYC,
    setInputTypes,
    setLoanReport,
    getInputTypes,
    setKycEntries,
    getLoanStatus,
    getKYCEntries,
    deleteKYCFile,
    submitNewRate,
    setDetailsKyc,
    submitKYCFile,
    setAllLoanBook,
    getLoanSeasons,
    setLoanSeasons,
    deleteDepotTran,
    setFarmerReport,
    getLoanBookData,
    setProductTypes,
    getProductTypes,
    submitNewSeason,
    getClientDetails,
    setAllLoanStatus,
    getFarmerAnalysis,
    setKycManualUsers,
    getKYCManualUsers,
    deleteLoanPayment,
    setKycEditEntries,
    getLoanLoanStatus,
    getLoanRedemptions,
    getLoanSettlements,
    getLoanLiquidations,
    setLoadingSelected,
    getSelectedDetails,
    submitActivateRate,
    submitNewDepotTran,
    getFarmerStatement,
    getKYCFileDetailed,
    getFarmerLoanStatus,
    getLoansSpecialRate,
    deleteDepotTranFile,
    setUploadingKycFile,
    submitFundsTransfer,
    getLoanPaymentFiles,
    submitAdjustPayment,
    getPaymentsReversals,
    getPaymentsBackdated,
    submitAuthorizeRate,
    getFarmerRedemptions,
    getFarmerSettlements,
    submitNewFundsRefund,
    submitManageHighRisk,
    submitKYCFileForAuth,
    submitNewSpecialRate,
    submitNewLoanPayment,
    getZWLFarmerStatement,
    getFarmerLiquidations,
    setLoadingManualUsers,
    setDetailsLoanPayment,
    submitLoanPaymentFile,
    deleteLoanPaymentFile,
    submitAuthorizeSeason,
    submitNewFundsTransfer,
    getPaymentsAdjustments,
    setFundsTransferSearch,
    submitAuthorizeRequest,
    getKYCStatementEntries,
    submitAuthorizeKYCEdit,
    submitAuthorizeKYCFile,
    setEntriesForAdjustment,
    submitAdjustTransaction,
    getEntriesForAdjustment,
    getTransactionsBackdated,
    getTransactionsReversals,
    getGroupedAuthorizations,
    getManualLoanPaymentFile,
    submitFundsTransferSearch,
    getLoanTransactionsMaster,
    getDepotTransactionsFiles,
    submitActivateSpecialRate,
    getTransactionsAdjustments,
    getFarmerPaymentsBackdated,
    getFarmerPaymentsReversals,
    submitDepotTranFileForAuth,
    submitAuthorizeSpecialRate,
    getLoanPaymentFileDetailed,
    setDetailsDepotTransactions,
    getFarmerTransactionsMaster,
    getFarmerPaymentsAdjustments,
    submitDepotTransactionsFile,
    setUploadingLoanPaymentFile,
    submitAuthorizeDepotTranFile,
    submitLoanPaymentFileForAuth,
    getFarmerTransactionsReversals,
    getManualDepotTransactionsFile,
    setPaymentEntriesForAdjustment,
    getFarmerTransactionsBackdated,
    getPaymentEntriesForAdjustment,
    submitManagePoliticallyExposed,
    submitAuthorizeLoanPaymentFile,
    submitReprocessTransactionsFile,
    getFarmerTransactionsAdjustments,
    getDepotTransactionsFileDetailed,
    setUploadingDepotTransactionsFile,
  };

  return (
    <div>
      <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
    </div>
  );
};
