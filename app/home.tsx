"use client";
import Image from "next/image";
import styled from "styled-components";

import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
  Header,
  Footer,
} from "./pages/components";
import { defaultSnapOrigin } from "./pages/config";
import {
  useMetaMask,
  useInvokeSnap,
  useMetaMaskContext,
  useRequestSnap,
} from "./pages/hooks";
import { isLocalSnap, shouldDisplayReconnectButton } from "./pages/utils";
import { MetaMaskProvider } from "./pages/hooks";

export default function HomePage() {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const invokeSnap = useInvokeSnap();

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  const handleSendHelloClick = async () => {
    await invokeSnap({ method: "hello" });
  };
  return (
    <MetaMaskProvider>
      <div>
        <div>
          Welcome to <span>template-snap</span>
        </div>
        <div>
          Get started by editing <code>src/index.ts</code>
        </div>
        <div>
          {error && (
            <div>
              <b>An error happened:</b> {error.message}
            </div>
          )}
          {!isMetaMaskReady && (
            <Card
              content={{
                title: "Install",
                description:
                  "Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.",
                button: <InstallFlaskButton />,
              }}
              fullWidth
            />
          )}
          {!installedSnap && (
            <Card
              content={{
                title: "Connect",
                description:
                  "Get started by connecting to and installing the example snap.",
                button: (
                  <ConnectButton
                    onClick={requestSnap}
                    disabled={!isMetaMaskReady}
                  />
                ),
              }}
              disabled={!isMetaMaskReady}
            />
          )}
          {shouldDisplayReconnectButton(installedSnap) && (
            <Card
              content={{
                title: "Reconnect",
                description:
                  "While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.",
                button: (
                  <ReconnectButton
                    onClick={requestSnap}
                    disabled={!installedSnap}
                  />
                ),
              }}
              disabled={!installedSnap}
            />
          )}
          <Card
            content={{
              title: "Send Hello message",
              description:
                "Display a custom message within a confirmation screen in MetaMask.",
              button: (
                <SendHelloButton
                  onClick={handleSendHelloClick}
                  disabled={!installedSnap}
                />
              ),
            }}
            disabled={!installedSnap}
            fullWidth={
              isMetaMaskReady &&
              Boolean(installedSnap) &&
              !shouldDisplayReconnectButton(installedSnap)
            }
          />
          <div>
            <p>
              Please note that the <b>snap.manifest.json</b> and{" "}
              <b>package.json</b> must be located in the server root directory
              and the bundle must be hosted at the location specified by the
              location field.
            </p>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </MetaMaskProvider>
  );
}
