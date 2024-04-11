"use client";

import HomePage from "./home";
import { MetaMaskProvider } from './pages/hooks';

export default function IndexPage() {
  return (
    <MetaMaskProvider>
      <HomePage />
    </MetaMaskProvider>
  );
}
