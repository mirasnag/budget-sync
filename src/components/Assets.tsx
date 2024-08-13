// react imports
import { useState } from "react";

// rrd imports
import { Form } from "react-router-dom";

// library imports
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

// helper functions
import {
  formatCurrency,
  getAllCurrencies,
  getBalanceOfAsset,
} from "../api/helpers";

// components
import AssetForm from "./AssetForm";

export interface Asset {
  id: string;
  name: string;
  initBalance: number;
  currency: string;
}

export interface AssetsTableProps {
  assets: Asset[];
  showHeader?: boolean;
}

const AssetsTable: React.FC<AssetsTableProps> = ({
  assets,
  showHeader = true,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState("");

  const closeForm = () => {
    setShowCreateForm(false);
    setShowEditForm("");
  };

  const tableHeader: string[] = ["Name", "Balance", ""];
  const currencies = getAllCurrencies();

  return (
    <div className="assets flex-sm">
      {showHeader && (
        <>
          <h2>Assets</h2>
          <button
            className="btn btn-green"
            onClick={() => setShowCreateForm(true)}
          >
            <PlusIcon width={20} />
          </button>
        </>
      )}
      <table>
        <thead>
          <tr>
            {tableHeader.map((t, index) => (
              <th key={index}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => (
            <tr key={index}>
              <td>
                <div className="frame color-aqua">{asset.name}</div>
              </td>
              <td>
                {formatCurrency(getBalanceOfAsset(asset), asset.currency)}
              </td>

              <td>
                <div className="flex-sm">
                  <button
                    onClick={() => setShowEditForm(asset.id)}
                    className="btn"
                  >
                    <PencilIcon width={20} />
                  </button>
                  <Form method="post">
                    <input type="hidden" name="_action" value="deleteAsset" />
                    <input type="hidden" name="asset_id" value={asset.id} />
                    <button type="submit" className="btn btn-red">
                      <TrashIcon width={20} />
                    </button>
                  </Form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateForm && (
        <AssetForm currencies={currencies} onClose={closeForm} asset_id="" />
      )}

      {showEditForm !== "" && (
        <AssetForm
          currencies={currencies}
          onClose={closeForm}
          asset_id={showEditForm}
        />
      )}
    </div>
  );
};

export default AssetsTable;
