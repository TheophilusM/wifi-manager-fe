import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import SideTopBar from "../../components/SideTopBar";
import { FaPersonShelter } from "react-icons/fa6";
import { MdOutlineLibraryAdd, MdPersonOutline } from "react-icons/md";
import { withAnyHandler } from "../../hocs/_withAuthHandler";
import { ModalsContexts } from "../../context/ModalsContexts";
import { baseName } from "../../constants/base";
import { ServicesContext } from "../../context/ServicesContext";
import { useParams } from "react-router-dom";
import EmptyTable from "../../components/sections/EmpltyTable";
import { RingLoader } from "react-spinners";
import { editBtnClass } from "../../constants/colors";
import { decrypt } from "../../services/_crypto";
import { roles } from "../../constants/roles";

const DeleteSubscriptionModal = lazy(() =>
  import("../../components/modals/DeleteSubscriptionModal")
);

const AddorEditSubscriptionModal = lazy(() =>
  import("../../components/modals/AddSubscriptionModal")
);

function EcocashAccountsDetails() {
  const [item, setItem] = useState({});
  const {
    showDeleteSuscriptionModal,
    handleCloseDeleteSuscriptionModal,
    handleOpenDeleteSuscriptionModal,
    showAddorEditSubscriptionModal,
    handleCloseAddorEditSubscriptionModal,
    handleOpenAddorEditSubscriptionModal,
  } = useContext(ModalsContexts);

  const { loading, navigate, setLoading, clientDetails, getDetailedClient } =
    useContext(ServicesContext);

  const { id } = useParams();

  const classDetails = (key, section, id) =>
    `${
      clientDetails?.creates?.filter((datax) => {
        if (datax?.sectionName === key && datax?.newID === id) {
          return section;
        }
        return null;
      })?.length > 0
        ? "created-record"
        : null
    } ${
      clientDetails?.edits?.filter((datax) => {
        if (datax?.sectionName === key && datax?.newID === id) {
          return section;
        }
        return null;
      })?.length > 0
        ? "updated-record"
        : null
    } ${
      clientDetails?.deletes?.filter((datax) => {
        if (datax?.sectionName === key && datax?.deletedID === id) {
          return section;
        }
        return null;
      })?.length > 0
        ? "deleted-record"
        : null
    }`;

  useEffect(() => {
    setItem({});
    if (
      loading ||
      showAddorEditSubscriptionModal ||
      showDeleteSuscriptionModal
    ) {
      setLoading(false);
      handleCloseDeleteSuscriptionModal();
      handleCloseAddorEditSubscriptionModal();
    }
    getDetailedClient(true, id);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SideTopBar page={""}>
      <div
        style={{
          margin: "5px 10px",
          display: "flex",
          width: "96%",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div
          onClick={() => navigate(baseName + "/ecocash-accounts")}
          className="bread-crumb clickable"
        >
          <FaPersonShelter className="bread-crumb-icon" />
          <p>Ecocash Accounts</p>
          <p className="bread-crumb-slush">/</p>
        </div>
        <div className="bread-crumb">
          <MdPersonOutline className="bread-crumb-icon" />
          <p>Client Details</p>
        </div>
      </div>
      {/* Details */}
      <div className="flex-horizontal-center-justice">
        <div
          style={{ marginBottom: 15, paddingBottom: 15 }}
          className="box-shadow container-div"
        >
          <div style={{ marginBottom: 10 }} className="flex-horizontal-between">
            <div>
              <p
                style={{
                  padding: 0,
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 500,
                  color: "rgb(44,66,108)",
                }}
                className="all-employees-heading"
              >
                Details
              </p>
              <div className="devider-min"></div>
            </div>
          </div>
          {!loading ? (
            <table className="infomation-table">
              <tbody>
                <tr>
                  <td>Title</td>
                  <td>{clientDetails?.clientKyc?.title}</td>
                </tr>
                <tr>
                  <td>Full Name</td>
                  <td>{clientDetails?.clientKyc?.customerName}</td>
                </tr>
                <tr>
                  <td>Identity Type</td>
                  <td>{clientDetails?.clientKyc?.identificationType}</td>
                </tr>
                <tr>
                  <td>Passport Number</td>
                  <td>{clientDetails?.clientKyc?.passportNumber}</td>
                </tr>
                <tr>
                  <td>Identity Number</td>
                  <td>{clientDetails?.clientKyc?.identificationNumber}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{clientDetails?.clientKyc?.email}</td>
                </tr>
                <tr>
                  <td>Date of Birth</td>
                  <td>
                    {clientDetails?.clientKyc?.dateOfBirth?.substring(0, 10)}
                  </td>
                </tr>
                <tr>
                  <td>Cell Phone(s)</td>
                  <td>
                    {clientDetails?.clientKyc?.primaryPhone}{" "}
                    {clientDetails?.clientKyc?.alternativePhone
                      ? " / " + clientDetails?.clientKyc?.alternativePhone
                      : null}
                  </td>
                </tr>
                <tr>
                  <td>Total Persons</td>
                  <td>
                    {clientDetails?.clientKyc?.totalPersonsIncludingSpouse}
                  </td>
                </tr>
                <tr>
                  <td>Nationality</td>
                  <td>{clientDetails?.clientKyc?.nationality}</td>
                </tr>
                <tr>
                  <td>Permanent Resident</td>
                  <td>
                    {clientDetails?.clientKyc?.isPermanentResident == null
                      ? null
                      : clientDetails?.clientKyc?.isPermanentResident
                      ? "Yes"
                      : "No"}
                  </td>
                </tr>
                <tr>
                  <td>Individual/Company</td>
                  <td
                    style={{
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                    title={clientDetails?.clientKyc?.title}
                    className="trancate"
                  >
                    {clientDetails?.clientKyc?.isCompany ? (
                      <span style={{ color: "#8c662b" }}>company</span>
                    ) : (
                      <span style={{ color: "#2d8c86" }}>individual</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Occupation</td>
                  <td>{clientDetails?.clientKyc?.occupation}</td>
                </tr>
                <tr>
                  <td>Marital Status</td>
                  <td>{clientDetails?.clientKyc?.maritalStatus}</td>
                </tr>
                <tr>
                  <td>Declare Insolvent</td>
                  <td>
                    {clientDetails?.clientKyc?.insolventDeclarations?.length > 0
                      ? "Yes"
                      : "No"}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="loading-all-employees">
              <RingLoader
                loading={true}
                color={"#11aa11"}
                size={20}
                speedMultiplier={2}
              />
            </div>
          )}
        </div>
      </div>
      {/* Ecocash Link */}
      {clientDetails?.clientKyc?.isCompany ? (
        <div className="flex-horizontal-center-justice">
          <div
            style={{ marginBottom: 15, paddingBottom: 15 }}
            className="box-shadow container-div"
          >
            <div
              style={{ marginBottom: 10 }}
              className="flex-horizontal-between"
            >
              <div>
                <p
                  style={{
                    padding: 0,
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 500,
                    color: "rgb(44,66,108)",
                  }}
                  className="all-employees-heading"
                >
                  Ecocash Link
                </p>
                <div className="devider-min"></div>
              </div>
              {window.sessionStorage.getItem("user") &&
              JSON.parse(
                decrypt(window.sessionStorage.getItem("user"))
              )?.isp?.includes(roles.MAKER) ? (
                <div
                  style={editBtnClass}
                  onClick={() => {
                    setItem({});
                    handleOpenAddorEditSubscriptionModal();
                  }}
                >
                  <MdOutlineLibraryAdd style={{ fontSize: 14 }} /> add
                </div>
              ) : null}
            </div>
            <table>
              <thead>
                <tr>
                  <td style={{ width: "2.3%" }}></td>
                  <td style={{ width: 200 }}>Full Name</td>
                  <td style={{ width: 200 }}>ID Type</td>
                  <td style={{ width: 150 }}>ID Number</td>
                  <td style={{ width: 150 }}>Phone Number</td>
                  <td style={{ width: 150 }}>Date of Birth</td>
                  {window.sessionStorage.getItem("user") &&
                  JSON.parse(
                    decrypt(window.sessionStorage.getItem("user"))
                  )?.isp?.includes(roles.MAKER) ? (
                    <td style={{ width: "10%" }}>Edit</td>
                  ) : null}
                  {window.sessionStorage.getItem("user") &&
                  JSON.parse(
                    decrypt(window.sessionStorage.getItem("user"))
                  )?.isp?.includes(roles.MAKER) ? (
                    <td style={{ width: "10%" }}>Delete</td>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {clientDetails?.clientDirectors?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className={classDetails(
                        "clientDirector",
                        clientDetails?.clientDirectors,
                        item?.id
                      )}
                    >
                      <td>{index + 1}.</td>
                      <td>{item?.fullName}</td>
                      <td style={{ paddingLeft: 5 }}>{item?.idType}</td>
                      <td style={{ paddingLeft: 5 }}>{item?.idNumber}</td>
                      <td style={{ paddingLeft: 5 }}>{item?.telephone}</td>
                      <td style={{ paddingLeft: 5 }}>
                        {item?.dateOfBirth?.substring(0, 10)}
                      </td>
                      {window.sessionStorage.getItem("user") &&
                      JSON.parse(
                        decrypt(window.sessionStorage.getItem("user"))
                      )?.isp?.includes(roles.MAKER) ? (
                        <td
                          className="edit-span"
                          style={{
                            textAlign: "center",
                            paddingLeft: 0,
                          }}
                          onClick={() => {
                            setItem(item);
                            handleOpenAddorEditSubscriptionModal();
                          }}
                        >
                          edit
                        </td>
                      ) : null}
                      {window.sessionStorage.getItem("user") &&
                      JSON.parse(
                        decrypt(window.sessionStorage.getItem("user"))
                      )?.isp?.includes(roles.MAKER) ? (
                        <td
                          className="delete-span"
                          style={{
                            textAlign: "center",
                            paddingLeft: 0,
                          }}
                          onClick={() => {
                            setItem(item);
                            handleOpenDeleteSuscriptionModal();
                          }}
                        >
                          delete
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {loading || clientDetails?.clientDirectors?.length === 0 ? (
              <EmptyTable />
            ) : null}
          </div>
        </div>
      ) : null}
      <Suspense fallback={<></>}>
        <AddorEditSubscriptionModal subscription={item} />
      </Suspense>
      <Suspense fallback={<></>}>
        <DeleteSubscriptionModal subscription={item} />
      </Suspense>
    </SideTopBar>
  );
}

export default withAnyHandler(EcocashAccountsDetails);
