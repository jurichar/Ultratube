import { toast } from "react-toastify";
import { NotifyType } from "../types";
export const notify = ({ type, msg }: NotifyType) => {
  switch (type) {
    case "success": {
      toast.success(msg);
      break;
    }
    case "error": {
      toast.error(msg);
      break;
    }
    case "warning": {
      toast.warning(msg);
      break;
    }
    default: {
      return;
    }
  }
};
