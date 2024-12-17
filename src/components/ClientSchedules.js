import React, { useContext, useEffect, useState } from "react";
import { TbListSearch } from "react-icons/tb";
import ReactPaginate from "react-paginate";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { RingLoader } from "react-spinners";
import { capitalize } from "../services/capitalize";
import { AiOutlineNodeExpand } from "react-icons/ai";
import { ServicesContext } from "../context/ServicesContext";
import { twoDP } from "../services/twoDP";

function ClientSchedules() {
  const [filter, setFilter] = useState("");
  const { loading, navigate, schedules } = useContext(ServicesContext);

  var itemsPerPage = 15;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const itemsCount = Math.ceil(
    schedules?.filter((file) => {
      if (filter === "") {
        return file;
      } else if (file?.loanID?.toLowerCase().includes(filter?.toLowerCase())) {
        return file;
      }
      return null;
    }).length
  );
  const pageCount = Math.ceil(itemsCount / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % schedules?.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, schedules);

  return (
    <div>
      <div className="flex-horizontal-center-justice">
        <div
          style={{ marginBottom: 20, paddingBottom: 15 }}
          className="box-shadow container-div"
        >
          <div style={{ marginBottom: 10 }} className="flex-horizontal-between">
            <div>
              <p
                style={{ padding: 0, margin: 0, fontSize: 16, fontWeight: 500 }}
                className="all-employees-heading"
              >
                Clients
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
                <td style={{ width: 200 }}>Ref</td>
                <td style={{ width: 200 }}>Installement No</td>
                <td style={{ width: 200 }}>Principal Payment</td>
                <td style={{ width: 200 }}>Interest Payment</td>
                <td style={{ width: 200 }}>Total Amount</td>
                <td style={{ width: 200 }}>Remaining Balance</td>
                <td style={{ width: 200 }}>Payment Actual</td>
                <td style={{ width: 200 }}>Installment Date</td>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                schedules
                  ?.filter((file) => {
                    if (filter === "") {
                      return file;
                    } else if (
                      file?.loanID
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
                        <td
                          style={{ paddingLeft: 5 }}
                          title={item?.title}
                          className="trancate"
                        >
                          {item?.loanID}
                        </td>
                        <td style={{ paddingLeft: 5 }}>
                          {item?.installmentNumber}
                        </td>{" "}
                        <td>
                          {twoDP(item?.principalPayment + "")?.replace(
                            "NaN",
                            "0.00"
                          )}
                        </td>
                        <td>
                          {twoDP(item?.interestPayment + "")?.replace(
                            "NaN",
                            "0.00"
                          )}
                        </td>
                        <td style={{ paddingLeft: 5 }}>
                          {twoDP(item?.totalPayment + "")?.replace("NaN", "")}
                        </td>
                        <td>
                          {twoDP(item?.remainingBalance + "")?.replace(
                            "NaN",
                            "0.00"
                          )}
                        </td>
                        <td>
                          {twoDP(item?.paymentActual + "")?.replace(
                            "NaN",
                            "0.00"
                          )}
                        </td>
                        <td style={{ paddingLeft: 5 }}>
                          {item?.installmentDate?.substring(0, 10)}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          {!loading && schedules?.length > 0 && (
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
            schedules?.filter((file) => {
              if (filter === "") {
                return file;
              } else if (
                file?.loanID?.toLowerCase().includes(filter?.toLowerCase())
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
    </div>
  );
}

export default ClientSchedules;
