import { TrashIcon } from "@heroicons/react/20/solid";

const DeleteButton: React.FC = () => {
  return (
    <button type="submit" className="btn btn-medium btn-red">
      <TrashIcon width={20} />
    </button>
  );
};

export default DeleteButton;
