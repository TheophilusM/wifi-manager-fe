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

const NewProductModal = lazy(() => import("../modals/NewProductModal"));

const AuthorizeProductModal = lazy(() =>
  import("../../components/modals/AuthorizeProductModal")
);

function ProductsSection() {
  const { loading, setLoading, products } = useContext(ServicesContext);

  const {
    showNewProductModal,
    handleOpenNewProductModal,
    handleCloseNewProductModal,
    showAuthorizeProductModal,
    handleCloseAuthorizeProductModal,
    handleOpenAuthorizeProductModal,
  } = useContext(ModalsContexts);

  const [filter, setFilter] = useState("");
  const [product, setProduct] = useState(null);

  var itemsPerPage = 15;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const itemsCount = Math.ceil(
    products?.filter((item) => {
      if (filter === "") {
        return item;
      } else if (
        item?.name?.toLowerCase().includes(filter?.toLowerCase()) ||
        item?.code?.toLowerCase().includes(filter?.toLowerCase()) ||
        item?.description?.toLowerCase().includes(filter?.toLowerCase())
      ) {
        return item;
      }
      return null;
    })?.length
  );
  const pageCount = Math.ceil(itemsCount / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products?.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    if (loading || showNewProductModal || showAuthorizeProductModal) {
      setLoading(false);
      handleCloseNewProductModal();
      handleCloseAuthorizeProductModal();
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, products);

  return (
    <>
      <div
        style={{ marginBottom: 55, marginTop: 5 }}
        className="flex-horizontal-around"
      >
        <div className="container-div box-shadow">
          <div style={{ marginBottom: 10 }} className="flex-horizontal-between">
            <div>
              <h6 style={{ color: "#082e74" }}>Loan Products</h6>
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
              )?.isp?.includes(roles.USER) && (
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
                    //handleOpenActivateProductModal();
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
              )?.isp?.includes(roles.VIEWER) && (
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
                    setProduct(null);
                    handleOpenNewProductModal();
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
                <td style={{ width: 100 }}>Name</td>
                <td style={{ width: 100 }}>Code</td>
                <td style={{ width: 200 }}>Description</td>
                <td style={{ width: 100 }}>Created</td>
                <td style={{ width: 100 }}>Manage</td>
                <td style={{ width: 100 }}>Status</td>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                products
                  ?.filter((item) => {
                    if (filter === "") {
                      return item;
                    } else if (
                      item?.name
                        ?.toLowerCase()
                        .includes(filter?.toLowerCase()) ||
                      item?.code
                        ?.toLowerCase()
                        .includes(filter?.toLowerCase()) ||
                      item?.description
                        ?.toLowerCase()
                        .includes(filter?.toLowerCase())
                    ) {
                      return item;
                    }
                    return null;
                  })
                  ?.slice(itemOffset, endOffset)
                  ?.sort((a, b) => b?.name?.localeCompare(a?.name))
                  .map((item, index) => {
                    return (
                      <tr
                        key={index + 1 + itemOffset}
                        className={
                          (index + 1) % 2 !== 0 ? `task-variant tr` : "tr"
                        }
                      >
                        <td>{index + 1 + itemOffset}</td>
                        <td>{item?.name}</td>
                        <td>{item?.code}</td>
                        <td className="trancate">{item?.description}</td>
                        <td style={{ paddingLeft: 5 }}>
                          {item?.created?.substring(0, 10)}
                        </td>
                        <td>
                          <span
                            onClick={() => {
                              setProduct(item);
                              return handleOpenNewProductModal();
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
                        <td style={{ paddingLeft: 5 }}>
                          {item?.authorized === null ? (
                            <span
                              onClick={() => {
                                if (
                                  !JSON.parse(
                                    decrypt(
                                      window.sessionStorage.getItem("user")
                                    )
                                  )?.isp?.includes(roles.CHECKER)
                                ) {
                                  return;
                                }
                                setProduct(item);
                                return handleOpenAuthorizeProductModal();
                              }}
                              style={{ cursor: "pointer" }}
                              className="pending"
                            >
                              pending
                            </span>
                          ) : item?.authorized === false ? (
                            <span
                              style={{ fontWeight: "normal" }}
                              className="rejected"
                            >
                              rejected
                            </span>
                          ) : item?.authorized === true ? (
                            <span
                              style={{ fontWeight: "normal" }}
                              className="authorized"
                            >
                              authorized
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          {!loading && products?.length > 0 && (
            <div className="flex-horizontal-between-center pagination">
              {itemsCount !== 0 && (
                <p className="count-info">
                  Showing {1} to{" "}
                  {endOffset >= itemsCount ? itemsCount : endOffset} (
                  {itemsCount} Product{itemsCount === 1 ? "" : "s"})
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
            products?.filter((item) => {
              if (filter === "") {
                return item;
              } else if (
                item?.name?.toLowerCase().includes(filter?.toLowerCase()) ||
                item?.code?.toLowerCase().includes(filter?.toLowerCase()) ||
                item?.description?.toLowerCase().includes(filter?.toLowerCase())
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
        <AuthorizeProductModal product={product} />
      </Suspense>
      <Suspense fallback={<></>}>
        <NewProductModal product={product} />
      </Suspense>{" "}
    </>
  );
}

export default ProductsSection;
