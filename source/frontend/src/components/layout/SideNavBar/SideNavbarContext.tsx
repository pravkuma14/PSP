import noop from 'lodash/noop';
import { createContext, useState } from 'react';

import { SidebarContextType } from './SideTray';

export interface ISideNavbarState {
  trayPage?: SidebarContextType;
  setTrayPage: (trayPage?: SidebarContextType) => void;
}

export const SidebarStateContext = createContext<ISideNavbarState>({
  trayPage: undefined,
  setTrayPage: noop,
});

/**
 * Context that manages the state of the sidebar, allows other components to open and close the side bar tray.
 * @param props
 */
export const SidebarStateContextProvider = (props: { children?: any }) => {
  const [trayPage, setTrayPage] = useState<SidebarContextType | undefined>();

  return (
    <SidebarStateContext.Provider value={{ trayPage, setTrayPage }}>
      {props.children}
    </SidebarStateContext.Provider>
  );
};
