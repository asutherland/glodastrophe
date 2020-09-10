import { TOGGLE_SIDEBAR } from '../actions/actionTypes';

const DEFAULT_STATE = {
  open: false
};

export default function reduceSidebar(oldState = DEFAULT_STATE, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      return {
        open: !oldState.open
      };
    }
    default: {
      return oldState;
    }
  }
}
