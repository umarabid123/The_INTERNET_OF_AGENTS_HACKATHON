// Simple store configuration - will be enhanced when Redux is properly installed
export const store = {
  getState: () => ({}),
  dispatch: (action: any) => action,
  subscribe: (listener: any) => () => {}
};

export type RootState = any;
export type AppDispatch = any;

export default store;