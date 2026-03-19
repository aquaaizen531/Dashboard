import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordCell = ({ password }) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <span>{showPass ? password : "•••••••"}</span>
      <button onClick={() => setShowPass(!showPass)}>
        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

export default PasswordCell;
