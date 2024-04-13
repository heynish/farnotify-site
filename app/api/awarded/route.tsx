import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import sharp from 'sharp';
import { join } from "path";
import * as fs from "fs";
import { addAwarded, verifyAward } from '../../core/addUserNotify'

export const dynamic = "force-dynamic";

const regPath = join(process.cwd(), "public/font/AtypDisplay-Regular.ttf");
let reg = fs.readFileSync(regPath);

const boldPath = join(process.cwd(), "public/font/AtypDisplay-Semibold.ttf");
let bold = fs.readFileSync(boldPath);

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    console.log("searchParams", searchParams);
    const fid = searchParams.get('fid') ?? "";
    const lxp = searchParams.get('lxp') ?? "";

    const svg = await satori(
        <div
            style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                backgroundColor: "black",
                padding: 50,
                lineHeight: 1.2,
                color: "black",
                backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/images/lxp.png)`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: 'Atyp',
                    fontSize: 32,
                }}
            >
                <span style={{ marginBottom: 4 }}>Completed!</span>
                <br />
                <span>You won {lxp}{" "} LXP</span>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: 'Atyp',
                    fontSize: 16,
                    marginTop: 16,
                }}
            >
                It will be minted on June 1st 2024.
            </div>
        </div>,
        {
            width: 500,
            height: 500,
            fonts: [
                {
                    name: "Atyp",
                    data: reg,
                    weight: 400,
                    style: "normal",
                },
                {
                    name: "Atyp",
                    data: bold,
                    weight: 800,
                    style: "normal",
                },
            ],
        },
    );
    const img = await sharp(Buffer.from(svg))
        .resize(500)
        .toFormat("png")
        .toBuffer();
    console.log('Image Created');
    return new NextResponse(img, {
        status: 200,
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "no-store",
        },
    });
}
