import { TrashIcon } from "@heroicons/react/20/solid";

interface DeleteButtonProps {
  handleClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ handleClick }) => {
  return (
    <button
      type="submit"
      className="btn btn-medium btn-red"
      onClick={handleClick}
    >
      <TrashIcon width={20} />
    </button>
  );
};

export default DeleteButton;
