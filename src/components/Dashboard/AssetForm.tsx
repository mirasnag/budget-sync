// rrd imports
import { Form } from "react-router-dom";

// helper functions
import { getAllMatchingItems } from "../../api/helpers";
import { Asset } from "./Assets";

interface AssetFormProps {
  currencies: string[];
  asset_id: string;
  onClose: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({
  currencies,
  asset_id,
  onClose,
}) => {
  const isEditForm = asset_id !== "";
  const asset = getAllMatchingItems("assets", "id", asset_id)[0] as Asset;

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>{isEditForm ? "Editing Asset" : "Create New Asset"}</h3>
        <Form method="post" onSubmit={onClose}>
          <input
            type="hidden"
            name="_action"
            value={isEditForm ? "editAsset" : "createAsset"}
          />
          {isEditForm && (
            <input type="hidden" name="asset_id" value={asset.id} />
          )}
          <div className="form-group">
            <label htmlFor="assetName">Asset Name</label>
            <input
              type="text"
              name="name"
              id="assetName"
              defaultValue={isEditForm ? asset.name : ""}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="initBalance">Initial Balance</label>
            <input
              type="number"
              name="initBalance"
              id="initBalance"
              defaultValue={isEditForm ? asset.initBalance : ""}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              name="currency"
              id="currency"
              defaultValue={isEditForm ? asset.currency : "USD"}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn">
            {isEditForm ? "Edit" : "Create"}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default AssetForm;
