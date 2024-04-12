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
    const fid = searchParams.get('fid') ?? "";
    const lxp = searchParams.get('lxp') ?? "";
    console.log("Award image", fid, lxp);
    let isAwarded;
    const prevAwarded = await verifyAward(Number(fid));
    if (prevAwarded == 0) {
        isAwarded = await addAwarded(Number(fid), Number(lxp));
    } else {
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
                    color: "white",
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/images/lxp.png)`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: 'Atyp',
                        fontSize: 40,
                    }}
                >
                    Congrats! You got {prevAwarded}{" "} LXP
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: 'Atyp',
                        fontSize: 24,
                    }}
                >
                    It will be minted for you on June 1st 2024.
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
    if (isAwarded) {
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
                    color: "white",
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/images/lxp.png)`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: 'Atyp',
                        fontSize: 40,
                    }}
                >
                    Congrats! You got {lxp}{" "} LXP
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: 'Atyp',
                        fontSize: 24,
                    }}
                >
                    It will be minted for you on June 1st 2024.
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
    } else {
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
                    color: "white",
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/images/lxp.png)`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: 'Atyp',
                        fontSize: 24,
                    }}
                >
                    Sorry, something went wrong.
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


}