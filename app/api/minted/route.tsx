import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import sharp from 'sharp';
import { join } from "path";
import * as fs from "fs";

export const dynamic = "force-dynamic";

const regPath = join(process.cwd(), "public/font/AtypDisplay-Regular.ttf");
let reg = fs.readFileSync(regPath);

const boldPath = join(process.cwd(), "public/font/AtypDisplay-Semibold.ttf");
let bold = fs.readFileSync(boldPath);

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const address = searchParams.get('address') ?? "";
    const status = searchParams.get('status') ?? "";

    console.log("Minted Image", address, status);

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
                backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/images/mintimage.png)`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',

            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    padding: "4px 8px",
                    borderRadius: "4px"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        fontFamily: 'Atyp',
                        fontSize: 24,

                    }}
                >
                    {status}
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        fontFamily: 'Atyp',
                        fontSize: 16,
                        marginTop: 12
                    }}
                >
                    {address}
                </div>

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