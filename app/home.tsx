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
import { addVerify } from '../app/core/addUserNotify'
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Image from 'next/image';
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import { defaultSnapOrigin } from "./pages/config";

//const SNAP_ORIGIN = process.env.NEXT_PUBLIC_SNAP_ORIGIN ?? `local:http://localhost:8080`;

export default function HomePage() {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  const [fid, setFid] = useState('');

  useEffect(() => {
    // Use URLSearchParams to parse the query string
    const queryParams = new URLSearchParams(window.location.search);
    const fidValue = queryParams.get('fid') || '';
    setFid(fidValue);
  }, []);


  useEffect(() => {
    async function checkAndVerify() {
      console.log("fid", fid);
      if (fid && installedSnap) {
        //if (fid) {
        console.log("add verify");
        await addVerify(Number(fid));
      }
    }
    checkAndVerify();
  }, [fid, installedSnap]);

  return (
    <section className="container mx-auto items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="flex flex-col justify-center h-full">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-8xl font-extrabold leading-tight tracking-tighter md:text-8xl">
              FarNotify <br className="hidden sm:inline" />
            </h1>
            <p className="max-w-[500px] text-2xl text-muted-foreground">
              Get hourly notifications about trending mints among Farcaster users
              and view trending casts directly on MetaMask.
            </p>
            <p className="max-w-[500px] text-2xl text-muted-foreground">
              Snaps is an open source system that allows anyone to safely extend the
              functionality of MetaMask, creating new web3 end user experiences.
            </p>
          </div>
          <div className="mt-8">
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
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2" />
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
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2" />
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
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2" />
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
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2" />
                </Link>
              </div>
            )}
            {error && (
              <div className="mt-4">
                <b>An error happened:</b> {error.message}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center h-full">
          <Image
            src={`${process.env.NEXT_PUBLIC_HOST}/assets/hero.png`}
            alt="Hero image"
            width={500}
            height={300}
            layout='responsive'
          />
        </div>
      </div>
    </section>
  );
}
