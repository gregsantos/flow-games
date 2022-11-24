/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import "../flow/config.mjs";

export function useConfig(): fcl.Configuration | null {
  const [config, setConfig] = useState(null);
  useEffect(() => fcl.config().subscribe(setConfig), []);
  return config;
}

export function useCurrentUser(): fcl.CurrentUserObject | null {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => fcl.currentUser().subscribe(setCurrentUser), []);
  return currentUser;
}
