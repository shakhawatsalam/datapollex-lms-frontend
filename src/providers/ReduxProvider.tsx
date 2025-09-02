"use client";
import { store } from "@/redux/store";
import React from "react";
import { FC } from "react";
import { Provider } from "react-redux";

const ReduxProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
