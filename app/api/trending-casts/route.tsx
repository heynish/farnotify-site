import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    let casts;
    const sdk = require("api")("@neynar/v2.0#xnh1ylutax3ld");
    await sdk
      .feedTrending({
        limit: "10",
        time_window: "1h",
        api_key: `${process.env.NEYNAR_API_KEY}`,
      })
      // @ts-ignore
      .then(({ data }) => {
        //console.log(data);
        casts = data;
      })
      // @ts-ignore
      .catch((err) => console.error(err));
    return new NextResponse(JSON.stringify(casts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
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
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
