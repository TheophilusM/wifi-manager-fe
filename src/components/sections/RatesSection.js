import React, { Suspense, lazy, useContext, useEffect, useState } from "react";
import { MdEditNote, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { HiOutlineSaveAs } from "react-icons/hi";
import { TbListSearch, TbPlaylistAdd } from "react-icons/tb";
import ReactPaginate from "react-paginate";
import { RingLoader } from "react-spinners";
import { ModalsContexts } from "../../context/ModalsContexts";
import { roles } from "../../constants/roles";
import { decrypt } from "../../services/_crypto";
import { ServicesContext } from "../../context/ServicesContext";

const AuthorizeRateModal = lazy(() => import("../modals/AuthorizeRateModal"));

const ActivateRateModal = lazy(() => import("../modals/ActivateRateModal"));

const RateModal = lazy(() => import("../modals/RateModal"));

const NewRateModal = lazy(() => import("../modals/NewRateModal"));

function RatesSection() {
  const { loading, setLoading, rates, products, schemes } =
    useContext(ServicesContext);

  const {
    showRateModal,
    handleOpenRateModal,
    handleCloseRateModal,
    showNewRateModal,
    handleOpenNewRateModal,
    handleCloseNewRateModal,
    showAuthorizeRateModal,
    handleOpenAuthorizeRateModal,
    handleCloseAuthorizeRateModal,
    showActivateRateModal,
    handleOpenActivateRateModal,
    handleCloseActivateRateModal,
  } = useContext(ModalsContexts);

  const [filter, setFilter] = useState("");
  const [rate, setRate] = useState(null);

  var itemsPerPage = 15;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const itemsCount = Math.ceil(
    rates?.filter((item) => {
      if (filter === "") {
        return item;
      } else if (
        item?.season?.toLowerCase().includes(filter?.toLowerCase()) ||
        item?.rateDate?.toLowerCase().includes(filter?.toLowerCase()) ||
        item?.croptype?.toLowerCase().includes(filter?.toLowerCase())
      ) {
        return item;
      }
      return null;
    })?.length
  );
  const pageCount = Math.ceil(itemsCount / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % rates?.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    if (
      loading ||
      showAuthorizeRateModal ||
      showActivateRateModal ||
      showNewRateModal ||
      showRateModal
    ) {
      setLoading(false);
      handleCloseAuthorizeRateModal();
      handleCloseActivateRateModal();
      handleCloseRateModal();
      handleCloseNewRateModal();
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        style={{ marginBottom: 55, marginTop: 5 }}
        className="flex-horizontal-around"
      >
        <div className="container-div box-shadow">
          <div style={{ marginBottom: 10 }} className="flex-horizontal-between">
            <div>
              <h6 style={{ color: "#082e74" }}>Loan Rates</h6>
              <div style={{ marginBottom: 10 }} className="heading-line" />
            </div>
            <div className="flex-horizontal-baseline">
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
              {JSON.parse(
                decrypt(window.sessionStorage.getItem("user"))
              )?.isp?.includes(roles.VIEWER) && (
                <button
                  className={`assign-modal-btn`}
                  style={{
                    width: 64,
                    marginLeft: 10,
                    borderRadius: 5,
                    height: 26,
                    color: "darkgreen",
                    border: "0.5px solid rgba(0,0,0,0.3)",
                  }}
                  onClick={() => {
                    //handleOpenActivateRateModal();
                  }}
                >
                  <HiOutlineSaveAs
                    style={{ marginRight: 3, fontSize: 18, marginBottom: 2 }}
                  />
                  csv
                </button>
              )}
              {JSON.parse(
                decrypt(window.sessionStorage.getItem("user"))
              )?.isp?.includes(roles.MAKER) && (
                <button
                  className={`assign-modal-btn`}
                  style={{
                    width: 64,
                    marginLeft: 10,
                    borderRadius: 5,
                    height: 26,
                    border: "0.5px solid rgba(0,0,0,0.3)",
                  }}
                  onClick={() => {
                    setRate(null);
                    handleOpenNewRateModal();
                  }}
                >
                  <TbPlaylistAdd
                    style={{ marginRight: 3, fontSize: 18, marginBottom: 2 }}
                  />
                  new
                </button>
              )}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <td style={{ width: 35 }}>#</td>
                <td style={{ width: 100 }}>Product</td>
                <td style={{ width: 100 }}>Scheme</td>
                <td style={{ width: 100 }}>
                  Price (m<sup>2</sup>)
                </td>
                <td style={{ width: 90 }}>Tenure (m)</td>
                <td style={{ width: 90 }}>Once-Off</td>
                <td style={{ width: 90 }}>Admin</td>
                <td style={{ width: 90 }}>Valuation</td>
                <td style={{ width: 90 }}>Interest</td>
                <td style={{ width: 90 }}>Default Int</td>
                <td style={{ width: 90 }}>Penalty Int</td>
                <td style={{ width: 100 }}>Created</td>
                {JSON.parse(
                  decrypt(window.sessionStorage.getItem("user"))
                )?.isp?.includes(roles.MAKER) ? (
                  <td style={{ width: 90 }}>Manage</td>
                ) : null}
                <td style={{ width: 90 }}>Approval</td>
                {JSON.parse(
                  decrypt(window.sessionStorage.getItem("user"))
                )?.isp?.includes(roles.CHECKER) && (
                  <td style={{ width: 90 }}>Status</td>
                )}
              </tr>
            </thead>
            <tbody>
              {!loading &&
                rates
                  ?.filter((item) => {
                    if (filter === "") {
                      return item;
                    } else if (
                      item?.season
                        ?.toLowerCase()
                        .includes(filter?.toLowerCase()) ||
                      item?.rateDate
                        ?.toLowerCase()
                        .includes(filter?.toLowerCase()) ||
                      item?.croptype
                        ?.toLowerCase()
                        .includes(filter?.toLowerCase())
                    ) {
                      return item;
                    }
                    return null;
                  })
                  ?.slice(itemOffset, endOffset)
                  ?.sort((a, b) => b?.season?.localeCompare(a?.season))
                  .map((item, index) => {
                    return (
                      <tr
                        key={index + 1 + itemOffset}
                        className={
                          (index + 1) % 2 !== 0 ? `task-variant tr` : "tr"
                        }
                      >
                        <td>{index + 1 + itemOffset}</td>
                        <td>
                          {
                            products?.filter((product) => {
                              if (
                                product?.id ===
                                schemes?.filter((scheme) => {
                                  if (scheme?.id === item?.schemeId) {
                                    return scheme;
                                  }
                                  return null;
                                })?.[0]?.productID
                              ) {
                                return product;
                              }
                              return null;
                            })?.[0]?.name
                          }
                        </td>
                        <td
                          onClick={() => {
                            setRate(item);
                            return handleOpenRateModal();
                          }}
                          className="trancate"
                        >
                          {
                            schemes?.filter((scheme) => {
                              if (scheme?.id === item?.schemeId) {
                                return scheme;
                              }
                              return null;
                            })?.[0]?.name
                          }
                        </td>
                        <td style={{ fontSize: 13 }}>
                          {item?.pricePerSquareMeter}
                        </td>
                        <td>{item?.tenure}</td>
                        <td style={{ paddingLeft: 5 }}>
                          {item?.establishment_fee}%
                        </td>
                        <td>{item?.annual_renewal_fee}%</td>
                        <td>{item?.valuation_fee}%</td>
                        <td>{item?.normal_interest}%</td>
                        <td>{item?.default_interest}%</td>
                        <td style={{ paddingLeft: 5 }}>
                          {item?.excess_penalty}
                        </td>

                        <td style={{ paddingLeft: 5 }}>
                          {item?.rate_created_date?.substring(0, 10)}
                        </td>
                        {JSON.parse(
                          decrypt(window.sessionStorage.getItem("user"))
                        )?.isp?.includes(roles.MAKER) ? (
                          <td>
                            <span
                              onClick={() => {
                                setRate(item);
                                return handleOpenNewRateModal();
                              }}
                              style={{
                                cursor: "pointer",
                                paddingLeft: 5,
                                display: "inline-block",
                              }}
                              className="edit-span"
                            >
                              <MdEditNote /> edit
                            </span>
                          </td>
                        ) : null}
                        <td
                          onClick={() => {
                            if (
                              !JSON.parse(
                                decrypt(window.sessionStorage.getItem("user"))
                              )?.isp?.includes(roles.CHECKER) ||
                              item?.authorized
                            )
                              return;
                            setRate(item);
                            return handleOpenAuthorizeRateModal();
                          }}
                          style={{
                            paddingLeft: 5,
                            fontSize: 14,
                            cursor: item?.authorized ? "default" : "pointer",
                          }}
                          className={
                            item?.authorized
                              ? "granted-span"
                              : item?.authorized === null
                              ? "resend-span"
                              : "inactive-span"
                          }
                        >
                          {item?.authorized === null
                            ? "pending"
                            : item?.authorized
                            ? "authorized"
                            : !item?.authorized
                            ? "rejected"
                            : null}
                        </td>
                        {JSON.parse(
                          decrypt(window.sessionStorage.getItem("user"))
                        )?.isp?.includes(roles.CHECKER) && (
                          <td
                            onClick={() => {
                              if (
                                !JSON.parse(
                                  decrypt(window.sessionStorage.getItem("user"))
                                )?.isp?.includes(roles.CHECKER) ||
                                !item?.authorized
                              ) {
                                return;
                              }
                              setRate(item);
                              return handleOpenActivateRateModal();
                            }}
                            style={{
                              paddingLeft: 5,
                              fontSize: 14,
                            }}
                            className={
                              item?.isRateActive ? "edit-span" : "inactive-span"
                            }
                          >
                            {item?.isRateActive ? "active" : "inactive"}
                          </td>
                        )}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          {!loading && rates?.length > 0 && (
            <div className="flex-horizontal-between-center pagination">
              {itemsCount !== 0 && (
                <p className="count-info">
                  Showing {1} to{" "}
                  {endOffset >= itemsCount ? itemsCount : endOffset} (
                  {itemsCount} rate{itemsCount === 1 ? "" : "s"})
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
            <div style={{ height: 200 }} className="loading-all-employees">
              <RingLoader
                loading={true}
                color={"#11aa11"}
                size={20}
                speedMultiplier={2}
              />
            </div>
          )}
          {!loading &&
            rates?.filter((item) => {
              if (filter === "") {
                return item;
              } else if (
                item?.season?.toLowerCase().includes(filter?.toLowerCase()) ||
                item?.rateDate?.toLowerCase().includes(filter?.toLowerCase()) ||
                item?.croptype?.toLowerCase().includes(filter?.toLowerCase())
              ) {
                return item;
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
        <AuthorizeRateModal rate={rate} />
      </Suspense>{" "}
      <Suspense fallback={<></>}>
        <ActivateRateModal rate={rate} />
      </Suspense>{" "}
      <Suspense fallback={<></>}>
        <RateModal rate={rate} />
      </Suspense>{" "}
      <Suspense fallback={<></>}>
        <NewRateModal rate={rate} />
      </Suspense>{" "}
    </>
  );
}

export default RatesSection;
