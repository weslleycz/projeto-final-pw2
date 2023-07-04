import { Box, useMediaQuery } from "@mui/material";
import { ReactNode, useRef } from "react";
import styles from "./styles.module.scss";
import { PostCreator } from "../PostCreator";

type Props = {
  children: ReactNode;
  refetch: any;
};

export const ContainerFeed = ({
  children,
  refetch
}: Props) => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  return (
    <>
      <Box
        className={styles.container}
      >
        <PostCreator refetch={refetch} />
        {children}
      </Box>
    </>
  );
};
