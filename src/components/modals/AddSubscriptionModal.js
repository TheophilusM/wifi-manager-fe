import { ModalsContexts } from "../../context/ModalsContexts";
import { theme_green } from "../../constants/colors";
import React, { useEffect, useRef, useState } from "react";
import { TbListSearch } from "react-icons/tb";
import { BeatLoader } from "react-spinners";
import Modal from "react-bootstrap/Modal";
import { useContext } from "react";
import "../../styles/modals.css";
import { ServicesContext } from "../../context/ServicesContext";

function AddSubscriptionModal() {
  const {
    loadingAddSubscription,
    setLoadingAddSubscription,
    showAddSubscriptionModal,
    handleCloseAddSubscriptionModal,
  } = useContext(ModalsContexts);

  const {
    clientCards,
    getClientCards,
    addSubscription,
    clientCardsLoading,
    setClientCardsLoading,
  } = useContext(ServicesContext);

  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState({});

  const msisdnRef = useRef("");
  const national_idRef = useRef("");

  useEffect(() => {
    setSelectedCard({});
    if (clientCardsLoading || loadingAddSubscription) {
      setLoadingAddSubscription(false);
      setClientCardsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      className="modal"
      show={showAddSubscriptionModal}
      onHide={handleCloseAddSubscriptionModal}
    >
      <div style={{ width: 100 }} className="modal-container">
        <p className="heading" style={{ fontSize: 18 }}>
          New Ecocash Subscription
        </p>
        <div style={{ gap: 10, overflow: "hidden" }}>
          <label className="required">Search Cards</label>
          <div
            className="flex-horizontal-between"
            style={{ width: "100%", marginTop: 5, marginBottom: 5 }}
          >
            <input
              type="search"
              value={search}
              placeholder="CIF or Wallet Account..."
              autoComplete="false"
              onChange={(e) => setSearch(e.target.value)}
              style={{
                margin: 0,
                width: 350,
                fontSize: 14,
                padding: "0 5px",
                height: 30,
                borderRadius: 3,
              }}
            />
            <button
              className={`submit-btn ${
                clientCardsLoading && "loading-btn"
              } flex-horizontal-center edit-btn`}
              disabled={clientCardsLoading}
              onClick={() => {
                setSelectedCard({});
                return getClientCards(search);
              }}
              style={{
                width: 90,
                border: "0.5px solid rgba(0,0,0,0.2)",
                height: 30,
                margin: 0,
                marginLeft: 10,
              }}
            >
              {!clientCardsLoading ? (
                <>
                  <TbListSearch style={{ marginRight: 5, fontSize: 16 }} />{" "}
                  <span style={{ fontSize: 14 }}>search</span>
                </>
              ) : (
                <BeatLoader color={"#061f4f"} size={4} />
              )}
            </button>
          </div>
          <label className="required">Linkable Cards</label>
          <select onChange={(e) => setSelectedCard(JSON.parse(e.target.value))}>
            <option value={{}}>Select</option>
            {clientCards?.map((item, index) => {
              return (
                <option key={index} value={JSON.stringify(item)}>
                  {item?.pan_encrypted + " - " + item?.expiry_date}
                </option>
              );
            })}
          </select>
          <div
            style={{ width: "100%", margin: "10px 0" }}
            className="flex-vertical-center"
          >
            <div
              style={{
                width: 30,
                height: 3,
                background: "rgba(0,0,0,0.4)",
                borderRadius: 3,
                marginTop: -5,
              }}
            />
          </div>
          <table
            style={{
              marginBottom: 5,
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <td style={{ width: 150 }}>Attribute</td>
                <td>Value</td>
              </tr>
            </thead>
            <tbody>
              <tr className="task-variant tr">
                <td>Customer ID</td>
                <td>{selectedCard?.customer_id}</td>
              </tr>
              <tr className="task-variant tr">
                <td>Card Program</td>
                <td>{selectedCard?.card_program}</td>
              </tr>
              <tr className="task-variant tr">
                <td>Expires</td>
                <td>{selectedCard?.expiry_date}</td>
              </tr>
              <tr className="task-variant tr">
                <td>Pan Encrypted</td>
                <td>{selectedCard?.pan_encrypted}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ width: "100%" }}>
          <label className="required">MSISDN</label>
          <input ref={msisdnRef} type="number" />
        </div>
        <div style={{ width: "100%" }}>
          <label className="required">National ID</label>
          <input ref={national_idRef} type="text" />
        </div>
        <div className="modal-btn-section">
          <button
            className="submit-btn"
            onClick={() => {
              return handleCloseAddSubscriptionModal();
            }}
          >
            Cancel
          </button>
          <button
            className={`submit-btn ${loadingAddSubscription && "loading-btn"}`}
            disabled={loadingAddSubscription}
            onClick={() =>
              addSubscription(
                selectedCard,
                msisdnRef.current["value"],
                national_idRef.current["value"],
                handleCloseAddSubscriptionModal
              )
            }
          >
            {!loadingAddSubscription ? (
              "Submit"
            ) : (
              <BeatLoader color={theme_green} size={6} />
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AddSubscriptionModal;
