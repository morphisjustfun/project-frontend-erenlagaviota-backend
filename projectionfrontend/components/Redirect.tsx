import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

const Redirect = (props: { to: string }) => {
  const router = useRouter();
  useEffect(() => {
    router.push(props.to);
  },[]);
  return null;
};

export default Redirect;
