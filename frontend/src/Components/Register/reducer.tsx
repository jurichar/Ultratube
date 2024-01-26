import { ReducerAction, RegisterType } from "../../types";

export function reducer(state: RegisterType, action: ReducerAction): RegisterType {
  switch (action.type) {
    case "change":
      return {
        ...state,
        [action.name]: action.value,
      };
    default:
      return state;
  }
}
