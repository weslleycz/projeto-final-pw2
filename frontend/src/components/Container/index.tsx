import { Grid, Box, useMediaQuery} from "@mui/material";
import { ReactNode } from "react";
import { Menu } from "../Menu";
import {MenuMobile} from "@/components/MenuMobile"

type Props = {
  children: ReactNode;
};

export const Container = ({ children }: Props) => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isLargeScreen = useMediaQuery("(min-width: 961px)");
  return (
    <>
      {isLargeScreen && (
        <Box>
          <Grid container spacing={2}>
            <Menu/>
            <Grid item xs={5} md={5}>
              {children}
            </Grid>
          </Grid>
        </Box>
      )}

        {isSmallScreen && <>
        {children}
        <MenuMobile/>
        </>}
    </>
  );
};
