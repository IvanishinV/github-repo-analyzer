import React from "react";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "../../shared/api/apolloClient";

export const AppProviders: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
