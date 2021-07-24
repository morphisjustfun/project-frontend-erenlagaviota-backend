import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import React from "react"

const Redirect = (props: { to: string }) => {
  const router = useRouter();
  useEffect(() => {
    router.push(props.to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default Redirect;
