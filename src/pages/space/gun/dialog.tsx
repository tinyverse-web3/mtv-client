import { useState } from "react";

function Dialog({ Title, content, confirm, onConfirm, cancel, onCancel }: 
                { Title : string,
                    content : string,
                    confirm : string,
                    onConfirm : () => void,
                    cancel : string,
                    onCancel : () => void}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleDialog}>{Title}</button>
      {isOpen && (
        <div className="dialog">
          <h2>{Title}</h2>
          <p>{content}</p>
          <button onClick={onConfirm}>{confirm}</button>
          <button onClick={onCancel}>{cancel}</button>
        </div>
      )}
    </div>
  );
}

export default Dialog;
