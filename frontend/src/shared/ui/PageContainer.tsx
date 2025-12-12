import type { ReactNode } from "react";
import Box from "@mui/material/Box";

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return <Box sx={{ padding: 3 }}>{children}</Box>;
}
