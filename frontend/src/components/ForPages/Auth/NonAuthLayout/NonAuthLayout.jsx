import { useEffect } from "react";

import { useLocation } from "react-router-dom";

const NonAuthLayout = ({ children }) => {
  const location = useLocation();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    // const currentage = capitalizeFirstLetter(location.pathname);
    document.title = `Reading group`;
  }, [location.pathname]);

  return <>{children}</>;
};

export default NonAuthLayout;
