import { LoginType, ReducerAction } from "../../types";

export function reducer(state: LoginType, action: ReducerAction): LoginType {
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
