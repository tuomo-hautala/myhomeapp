import React, { useState } from "react";

export const Context = React.createContext();

export const ContextProvider = ({ children }) => {
  const [wallpanels, setWallpanels] = useState(null);

  return (
    <Context.Provider
      value={{
        wallpanels,
        setWallpanels
      }}
    >
      {children}
    </Context.Provider>
  );
};
