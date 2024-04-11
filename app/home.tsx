"use client";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  useMetaMask,
  useInvokeSnap,
  useMetaMaskContext,
  useRequestSnap,
} from "./pages/hooks";
import { isLocalSnap, shouldDisplayReconnectButton, shouldDisplayInstalledButton } from "./pages/utils";

const SNAP_ORIGIN = process.env.NEXT_PUBLIC_SNAP_ORIGIN ?? `local:http://localhost:8080`;

export default function HomePage() {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  console.log("SNAP_ORIGIN", SNAP_ORIGIN);

  const isMetaMaskReady = isLocalSnap(SNAP_ORIGIN)
    ? isFlask
    : snapsDetected;
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Beautifully designed components <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Next.js 13 Ready.
        </p>
      </div>
      <div className="flex gap-4">
      </div>
      <div>
        {!isMetaMaskReady && (
          <div className="flex gap-4">
            <Link
              href="https://metamask.io/flask/"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants()}
            >
              <img src='/assets/flask_fox.svg' style={{ width: "20px", height: "20px", marginRight: "10px" }} />
              Install MetaMask Flask
            </Link>
            <Link
              href="https://snaps.metamask.io/"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              Explore Snaps
            </Link>
          </div>
        )}
        {isMetaMaskReady && !installedSnap && (
          <div className="flex gap-4">
            <Button onClick={requestSnap} disabled={!isMetaMaskReady}>
              <img src='/assets/flask_fox.svg' style={{ width: "20px", height: "20px", marginRight: "10px" }} />
              Install Snap
            </Button>
            <Link
              href="https://snaps.metamask.io/"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              Explore Snaps
            </Link>
          </div>
        )}
        {shouldDisplayInstalledButton(installedSnap) && (
          <div className="flex gap-4">
            <Button onClick={requestSnap} disabled={true}>
              <img src='/assets/flask_fox.svg' style={{ width: "20px", height: "20px", marginRight: "10px" }} />
              Snap Installed
            </Button>
            <Link
              href="https://snaps.metamask.io/"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              Explore Snaps
            </Link>
          </div>
        )}
        {shouldDisplayReconnectButton(installedSnap) && (
          <div className="flex gap-4">
            <Button onClick={requestSnap} variant="outline">
              <img src='/assets/flask_fox.svg' style={{ width: "20px", height: "20px", marginRight: "10px" }} />
              Reconnect
            </Button>
            <Link
              href="https://snaps.metamask.io/"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              Explore Snaps
            </Link>
          </div>
        )}
        {error && (
          <div className="mt-4">
            <b>An error happened:</b> {error.message}
          </div>
        )}
      </div>
    </section>
  );
}
