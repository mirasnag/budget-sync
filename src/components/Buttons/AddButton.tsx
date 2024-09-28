import { PlusIcon } from "@heroicons/react/20/solid";

interface AddButtonProps {
  handleClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ handleClick }) => {
  return (
    <button className="btn" onClick={handleClick}>
      <PlusIcon width={20} />
    </button>
  );
};

export default AddButton;
