import { PencilIcon } from "@heroicons/react/20/solid";

interface EditButtonProps {
  handleClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ handleClick }) => {
  return (
    <button className="btn btn-yellow" onClick={handleClick}>
      <PencilIcon width={20} />
    </button>
  );
};

export default EditButton;
