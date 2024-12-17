import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import SideTopBar from "../../components/SideTopBar";
import { TbListSearch } from "react-icons/tb";
import { FaPersonShelter } from "react-icons/fa6";
import ReactPaginate from "react-paginate";
import {
  MdEditNote,
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineAccountTree,
  MdOutlineCancel,
} from "react-icons/md";
import { RingLoader } from "react-spinners";
import { withAnyHandler } from "../../hocs/_withAuthHandler";
import { ServicesContext } from "../../context/ServicesContext";
import { systemId } from "../../constants/base";
import { decrypt } from "../../services/_crypto";
import jwt_decode from "jwt-decode";
import { ModalsContexts } from "../../context/ModalsContexts";

const AddSubscriptionModal = lazy(() =>
  import("../../components/modals/AddSubscriptionModal")
);

const EditSubscriptionModal = lazy(() =>
  import("../../components/modals/EditSubscriptionModal")
);

const DeleteSubscriptionModal = lazy(() =>
  import("../../components/modals/DeleteSubscriptionModal")
);

function EcocashAccounts() {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [decoded, setDecoded] = useState({});
  const [item, setItem] = useState({});

  const { loading, setLoading, getGetLinkedAccounts, linkedAccounts } =
    useContext(ServicesContext);

  const {
    showAddSubscriptionModal,
    handleCloseAddSubscriptionModal,
    handleOpenAddSubscriptionModal,
    showDeleteSubscriptionModal,
    handleCloseDeleteSubscriptionModal,
    handleOpenDeleteSubscriptionModal,
    showEditSubscriptionModal,
    handleCloseEditSubscriptionModal,
    handleOpenEditSubscriptionModal,
  } = useContext(ModalsContexts);

  var itemsPerPage = 15;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const itemsCount = Math.ceil(
    linkedAccounts?.filter((file) => {
      if (filter === "") {
        return file;
      } else if (
        file?.firstName?.toLowerCase().includes(filter?.toLowerCase()) ||
        file?.uniqueIdentifier?.toLowerCase().includes(filter?.toLowerCase())
      ) {
        return file;
      }
      return null;
    }).length
  );
  const pageCount = Math.ceil(itemsCount / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % linkedAccounts?.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    if (
      loading ||
      showAddSubscriptionModal ||
      showEditSubscriptionModal ||
      showDeleteSubscriptionModal
    ) {
      setLoading(false);
      handleCloseAddSubscriptionModal();
      handleCloseEditSubscriptionModal();
      handleCloseDeleteSubscriptionModal();
    }
    if (window.sessionStorage.getItem("user")) {
      setDecoded(
        jwt_decode(
          JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
        )
      );
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SideTopBar page={"Ecocash Accounts"}>
      <div
        style={{
          margin: "5px 10px",
          display: "flex",
          width: "96%",
          alignItems: "center",
        }}
      >
        <div className="bread-crumb">
          <FaPersonShelter className="bread-crumb-icon" />
          <p>Ecocash Accounts</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "0 14px",
          marginBottom: 14,
        }}
      >
        {decoded?.roles?.includes(systemId + "_EcocashUser") ? (
          <button
            style={{
              width: 150,
              height: 26,
              fontWeight: 600,
              color: "white",
              display: "flex",
              justifyContent: "center",
              backgroundColor: "rgb(36, 97, 187)",
            }}
            onClick={() => handleOpenAddSubscriptionModal()}
            className="flex-horizontal-center upload-btn"
          >
            <MdOutlineAccountTree style={{ marginRight: 5, fontSize: 16 }} />{" "}
            <span style={{ fontSize: 14, letterSpacing: 0.3 }}>
              Add Subscription
            </span>
          </button>
        ) : null}
      </div>
      <div className="flex-horizontal-center-justice">
        <div
          style={{ marginBottom: 20, marginTop: 5, padding: "10px 5px" }}
          className="box-shadow container-div"
        >
          <div className="flex-horizontal-between-baseline">
            <p
              style={{ padding: 0, margin: 0, fontSize: 16, fontWeight: 500 }}
              className="all-employees-heading"
            >
              Subscription
            </p>
            <div style={{ display: "flex" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  getGetLinkedAccounts(true, search);
                }}
                className="flex-horizontal-center-justice"
              >
                <input
                  type="search"
                  value={search}
                  placeholder="Mobile Number ..."
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    margin: 0,
                    width: 300,
                    fontSize: 14,
                    padding: "0 5px",
                    height: 30,
                    borderRadius: 3,
                  }}
                />
                <button
                  style={{
                    width: 90,
                    border: "0.5px solid rgba(0,0,0,0.2)",
                    height: 30,
                    marginLeft: 10,
                  }}
                  className="flex-horizontal-center edit-btn"
                >
                  <TbListSearch style={{ marginRight: 5, fontSize: 16 }} />{" "}
                  <span style={{ fontSize: 14 }}>Search</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-horizontal-center-justice">
        <div
          style={{ marginBottom: 20, paddingBottom: 0 }}
          className="box-shadow container-div"
        >
          <div style={{ marginBottom: 10 }} className="flex-horizontal-between">
            <div>
              <p
                style={{ padding: 0, margin: 0, fontSize: 16, fontWeight: 500 }}
                className="all-employees-heading"
              >
                Linked Accounts
              </p>
              <div className="devider-min"></div>
            </div>
            <div className="flex-horizontal-center-justice">
              <input
                type="search"
                value={filter}
                placeholder="Filter ..."
                autoComplete="false"
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  margin: 0,
                  width: 300,
                  fontSize: 14,
                  padding: "0 5px",
                  height: 30,
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <td style={{ width: 35 }}>#</td>
                <td style={{ width: 150 }}>MSISDN</td>
                <td style={{ width: 150 }}>National ID</td>
                <td style={{ width: 200 }}>Pan</td>
                <td style={{ width: 150 }}>Expiry_Date</td>
                <td style={{ width: 150 }}>Date</td>
                <td style={{ width: 150 }}>Details</td>
                <td style={{ width: 150 }}>Manage</td>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                linkedAccounts
                  ?.filter((file) => {
                    if (filter === "") {
                      return file;
                    } else if (
                      file?.firstName
                        ?.toLowerCase()
                        .includes(filter?.toLowerCase()) ||
                      file?.uniqueIdentifier
                        ?.toLowerCase()
                        .includes(filter?.toLowerCase())
                    ) {
                      return file;
                    }
                    return null;
                  })
                  ?.slice(itemOffset, endOffset)
                  .map((item, index) => {
                    return (
                      <tr
                        key={index + 1 + itemOffset}
                        className={
                          (index + 1) % 2 !== 0 ? `task-variant tr` : "tr"
                        }
                      >
                        <td>{index + 1 + itemOffset}</td>
                        <td>{item?.msisdn}</td>
                        <td>{item?.national_id}</td>
                        <td>{item?.pan}</td>
                        <td>{item?.expiry_date}</td>
                        <td style={{ paddingLeft: 5 }}>
                          {item?.date_added?.substring(0, 10)}
                        </td>

                        <td
                          onClick={() => {
                            setItem(item);
                            handleOpenEditSubscriptionModal();
                          }}
                          style={{
                            paddingLeft: 5,
                            fontSize: 14,
                          }}
                          className={"edit-span"}
                        >
                          <MdEditNote
                            style={{
                              fontSize: 16,
                              marginBottom: 2,
                              marginRight: 3,
                            }}
                          />
                          update
                        </td>
                        <td
                          className="delete-span"
                          style={{
                            textAlign: "center",
                            paddingLeft: 0,
                          }}
                          onClick={() => {
                            setItem(item);
                            handleOpenDeleteSubscriptionModal();
                          }}
                        >
                          <MdOutlineCancel
                            style={{
                              fontSize: 14,
                              marginBottom: 2,
                              marginRight: 3,
                            }}
                          />
                          cancel
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          {!loading && linkedAccounts?.length > 0 && (
            <div className="flex-horizontal-between-center pagination">
              {itemsCount !== 0 && (
                <p className="count-info">
                  Showing {1} to{" "}
                  {endOffset >= itemsCount ? itemsCount : endOffset} (
                  {itemsCount} client{itemsCount === 1 ? "" : "s"})
                </p>
              )}
              <ReactPaginate
                breakLabel="..."
                nextLabel={<MdNavigateNext className="icon" />}
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                pageCount={pageCount}
                previousLabel={<MdNavigateBefore className="icon" />}
                renderOnZeroPageCount={null}
                marginPagesDisplayed={2}
                activeClassName="active"
                breakClassName="break"
                previousClassName="arrow"
                nextClassName="arrow"
                pageClassName="page"
                containerClassName="pagination-container"
              />
            </div>
          )}
          {loading && (
            <div className="loading-all-employees">
              <RingLoader
                loading={true}
                color={"#11aa11"}
                size={20}
                speedMultiplier={2}
              />
            </div>
          )}
          {!loading &&
            linkedAccounts?.filter((file) => {
              if (filter === "") {
                return file;
              } else if (
                file?.firstName
                  ?.toLowerCase()
                  .includes(filter?.toLowerCase()) ||
                file?.uniqueIdentifier
                  ?.toLowerCase()
                  .includes(filter?.toLowerCase())
              ) {
                return file;
              }
              return null;
            }).length === 0 && (
              <div className="not-found">
                <TbListSearch style={{ fontSize: 26, color: "#292929c7" }} />
              </div>
            )}
        </div>
      </div>
      <Suspense fallback={<></>}>
        <AddSubscriptionModal />
      </Suspense>
      <Suspense fallback={<></>}>
        <EditSubscriptionModal subscription={item} />
      </Suspense>
      <Suspense fallback={<></>}>
        <DeleteSubscriptionModal subscription={item} />
      </Suspense>
    </SideTopBar>
  );
}

export default withAnyHandler(EcocashAccounts);
