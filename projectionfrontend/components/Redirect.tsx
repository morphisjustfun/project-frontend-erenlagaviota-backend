import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";

const Redirect = (props: { to: string }) => {
  const router = useRouter();
  useEffect(() => {
    router.push(props.to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default Redirect;
