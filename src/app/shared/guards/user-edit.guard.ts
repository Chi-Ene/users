import { CanDeactivateFn } from '@angular/router';

export const userEditGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return true;
};
