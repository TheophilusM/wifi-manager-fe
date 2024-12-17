import { useContext } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import cbz_agrolas_logo from "../assets/cbz_logo.png";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { detailStyle } from "../constants/theme";
import { useEffect } from "react";
import { yearMonths } from "../constants/payloads";
import { capitalize } from "../services/capitalize";
import { ServicesContext } from "../context/ServicesContext";
import TableBal from "./TableBal";
import { twoDP } from "../services/twoDP";

function ClientStatement({ disclaimer }) {
  const { mortgageReport, schemes, products } = useContext(ServicesContext);

  useEffect(() => {
    return () => {};
  }, [mortgageReport]);

  return (
    <div
      style={{ marginTop: 0 }}
      className="flex-horizontal-center-justice section-to-print"
    >
      <div
        style={{ marginBottom: 20, padding: "10px 30px", paddingBottom: 25 }}
        className="box-shadow verify-employee-div"
      >
        <div
          style={{ width: "100%" }}
          className="flex-horizontal-around section-container"
        >
          <div className="flex-horizontal-between progress-cont section-container container-detail">
            <div
              style={{
                padding: "5px 0px",
                width: "50%",
                background: "white",
              }}
              className="progress-sect"
            >
              <img style={{}} width={60} src={cbz_agrolas_logo} alt="logo" />
              <p style={{ margin: "25px 0", fontSize: "22px", color: "red" }}>
                {mortgageReport?.clientKyc?.facilityId}
              </p>
            </div>
            <div
              style={{ padding: "5px 0px", width: "50%", textAlign: "right" }}
              className="leave-progress"
            >
              <h3 style={{ fontWeight: 700 }}>CBZ BANK LIMITED</h3>
              <p style={{ margin: 0 }}>
                <MdLocationOn style={{ marginBottom: 3 }} />
                60 Kwame Nkrumah Avenue, Harare, Zimbabwe.
              </p>
              <p style={{ margin: 0 }}>| P.O Box 3313</p>
              <p style={{ margin: 0 }}>
                <MdEmail />{" "}
                <a
                  style={{ textDecoration: "none" }}
                  href="mailto:info@cbz.co.zw"
                >
                  info@cbz.co.zw
                </a>
              </p>
              <p style={{ margin: 0 }}>
                <FaPhoneAlt style={{ fontSize: 12 }} />{" "}
                <a style={{ textDecoration: "none" }} href="tel:+2638677004050">
                  +263 8677004050
                </a>
              </p>
              <p style={{ margin: "15px 0" }}>
                Statement Date:{" "}
                {mortgageReport?.application?.Date?.split("-")[2]?.substring(
                  0,
                  2
                )}{" "}
                {
                  yearMonths[
                    parseInt(mortgageReport?.application?.Date?.split("-")[1]) -
                      1
                  ]
                }{" "}
                {mortgageReport?.application?.Date?.split("-")[0]}
              </p>
            </div>
          </div>
        </div>
        <h6>
          MORTGAGE LOAN STATEMENT -{" "}
          {capitalize(mortgageReport?.property?.propertyType)}
        </h6>
        <div className="statement-line"></div>
        <div
          style={{ width: "100%" }}
          className="flex-horizontal-around section-container"
        >
          <div className="flex-horizontal-between progress-cont section-container container-detail">
            <div className="progress-sect">
              <div className="div-details">
                <p className="p-detail-tag">Borrower Details:</p>
                <FarmerDetailSpan
                  value={`Name: ${capitalize(
                    mortgageReport?.clientKyc?.customerName
                  )}`}
                />
                <FarmerDetailSpan
                  value={`National ID: ${mortgageReport?.clientKyc?.identificationNumber}`}
                />
                <FarmerDetailSpan
                  value={`Phone Number: ${mortgageReport?.clientKyc?.primaryPhone}`}
                />
                <FarmerDetailSpan
                  value={`City: ${capitalize(
                    mortgageReport?.clientKyc?.primaryCity
                  )}`}
                />
              </div>
            </div>
            <div className="leave-progress">
              <div className="div-details">
                <p className="p-detail-tag">Property Details:</p>
                <FarmerDetailSpan
                  value={`Stand Number: ${capitalize(
                    mortgageReport?.property?.standNumber
                  )}`}
                />
                <FarmerDetailSpan
                  value={`Stand Size: ${mortgageReport?.property?.standSize} m2`}
                />
                <FarmerDetailSpan
                  value={`Property Address: ${mortgageReport?.property?.propertyAddress}`}
                />
                <FarmerDetailSpan
                  value={`City: ${mortgageReport?.property?.city}`}
                />
              </div>
            </div>
          </div>
        </div>
        <table id="statement-table">
          <thead>
            <tr className="task-variant">
              <td style={{ width: 70 }}>REF</td>
              <td style={{ width: 100 }}>Product</td>
              <td style={{ width: 100 }}>Scheme</td>
              <td style={{ width: 150 }}>Start Date</td>
              <td style={{ width: 150 }}>Tenure</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{mortgageReport?.loanMaster?.loanRef}</td>
              <td>
                {
                  products?.filter((product) => {
                    if (
                      product?.id ===
                      schemes?.filter((scheme) => {
                        if (
                          scheme?.id === mortgageReport?.loanMaster?.schemeID
                        ) {
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
              <td className="trancate">
                {
                  schemes?.filter((scheme) => {
                    if (scheme?.id === mortgageReport?.loanMaster?.schemeID) {
                      return scheme;
                    }
                    return null;
                  })?.[0]?.name
                }
              </td>
              <td>
                {mortgageReport?.loanMaster?.loanStartDate?.substring(0, 10)}
              </td>
              <td>{mortgageReport?.loanMaster?.tenureInMonths} months</td>
            </tr>
            <TableBal
              bold={true}
              first={true}
              title="Facility Amount"
              value={twoDP(mortgageReport?.loanMaster?.loanAmount + "")}
            />
            <TableBal
              bold={true}
              first={true}
              title="Once-Off Amount"
              value={twoDP(
                mortgageReport?.loanMaster?.establishmentAmount + ""
              )}
            />
            <TableBal
              bold={true}
              first={true}
              title="Interest Amount"
              value={twoDP("23")}
            />
            <TableBal
              bold={true}
              first={true}
              title="Closing Balance"
              value={twoDP(mortgageReport?.transactionMaster?.balance + "")}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FarmerDetailSpan({ value }) {
  return <span style={detailStyle}>{value}</span>;
}

export default ClientStatement;
