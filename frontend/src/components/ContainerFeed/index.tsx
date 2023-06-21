import { Box } from "@mui/material";
import { ReactNode, useRef } from "react";
import styles from "./styles.module.scss";

type Props = {
    children: ReactNode;
  };

export const ContainerFeed = ({children}:Props) => {

  const scrollableDivRef = useRef(null);

  const handleScroll = () => {
    const div = scrollableDivRef.current;
    if (div.scrollTop === 0) {
      console.log('Scroll está no topo');
    }
  };

    return<>
    <Box ref={scrollableDivRef} onScroll={handleScroll} className={styles.container}>
    {children}
    </Box>
   </>
}