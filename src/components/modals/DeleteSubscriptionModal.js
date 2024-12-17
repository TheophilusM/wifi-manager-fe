import { ModalsContexts } from "../../context/ModalsContexts";
import { theme_green } from "../../constants/colors";
import { useEffect } from "react";
import { BeatLoader } from "react-spinners";
import Modal from "react-bootstrap/Modal";
import { useContext } from "react";
import "../../styles/modals.css";
import { ServicesContext } from "../../context/ServicesContext";

function DeleteSubscriptionModal({ subscription }) {
  const {
    loadingDeleteSubscription,
    showDeleteSubscriptionModal,
    handleCloseDeleteSubscriptionModal,
  } = useContext(ModalsContexts);

  const { deleteSubscription } = useContext(ServicesContext);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription]);

  return (
    <Modal
      className="modal"
      show={showDeleteSubscriptionModal}
      onHide={handleCloseDeleteSubscriptionModal}
    >
      <div style={{ width: 100 }} className="modal-container">
        <p className="heading" style={{ fontSize: 18 }}>
          Cancel Subscription
        </p>
        <div>
          <label className="required">MSISDN</label>
          <input defaultValue={subscription?.msisdn} type="text" disabled />
        </div>
        <div>
          <label className="required">Pan</label>
          <input defaultValue={subscription?.pan} type="text" disabled />
        </div>
        <div>
          <label className="required">Expires</label>
          <input
            defaultValue={subscription?.expiry_date}
            type="text"
            disabled
          />
        </div>
        <div className="modal-btn-section">
          <button
            className="submit-btn"
            onClick={() => {
              return handleCloseDeleteSubscriptionModal();
            }}
          >
            Cancel
          </button>
          <button
            className={`submit-btn ${
              loadingDeleteSubscription && "loading-btn"
            }`}
            disabled={loadingDeleteSubscription}
            onClick={() =>
              deleteSubscription(
                subscription,
                handleCloseDeleteSubscriptionModal
              )
            }
          >
            {!loadingDeleteSubscription ? (
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

export default DeleteSubscriptionModal;
