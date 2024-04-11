import { NextRequest, NextResponse } from "next/server";
import { init, fetchQuery } from "@airstack/node";

interface TrendingMintsData {
  data: {
    TrendingMints: {
      TrendingMint: {
        address: string;
        blockchain: string;
        timeFrom: string;
        timeTo: string;
        token: {
          name: string;
          totalSupply: string;
          type: string;
        }[];
      }[];
    };
  };
}

init(`${process.env.AIRSTACK_API_KEY}`);

const query = `query MyQuery() {
    TrendingMints(
      input: {timeFrame: one_hour, audience: farcaster, criteria: unique_wallets, blockchain: base, limit: 5}
    ) {
      TrendingMint {
        address
        blockchain
        timeFrom
        timeTo
        token {
          name
          totalSupply
          type
        }
      }
    }
  }`;

async function fetchElementData(sdk: any, address: string) {
  try {
    const { data } = await sdk.contract({
      chain: "base",
      contract_address: address,
    });
    const elementURL = `https://element.market/collections/${data.data.collection.slug}`;
    return elementURL;
  } catch (err) {
    console.error(err);
    return "";
  }
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    //fetch from airstack
    const { data, error } = await fetchQuery(query);

    const sdk = require("api")("@element/v1.0#fvvdrg25ltccp1nr");
    sdk.auth(process.env.ELEMENT_API_KEY);

    const enrichedData = await Promise.all(
      data.TrendingMints.TrendingMint.map(async (mint: any) => {
        const elementURL = await fetchElementData(sdk, mint.address);
        return { ...mint, elementURL };
      })
    );
    console.log(JSON.stringify(enrichedData));
    return new NextResponse(JSON.stringify(enrichedData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
