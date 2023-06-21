import { Grid, Box, useMediaQuery } from "@mui/material";
import { ReactNode } from "react";
import { Menu } from "../Menu";
import { MenuMobile } from "@/components/MenuMobile";

type Props = {
  children: ReactNode;
};

export const Container = ({ children }: Props) => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery(
    "(min-width: 601px) and (max-width: 960px)"
  );
  const isLargeScreen = useMediaQuery("(min-width: 961px)");
  return (
    <>
      {isLargeScreen && (
        <Box>
          <Grid container spacing={2}>
            <Menu />
            <Grid justifyContent="center" item xs={2} md={8}>
              {children}
            </Grid>
          </Grid>
        </Box>
      )}

      {isMediumScreen && (
        <Box>
          {children}
          <MenuMobile />
        </Box>
      )}

      {isSmallScreen && (
        <>
          {children}
          <MenuMobile />
        </>
      )}
    </>
  );
};
