import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const REDASH_API_KEY = process.env.REDASH_API_KEY;
const REDASH_API_URL = process.env.REDASH_API_URL;

interface Job {
  id: string;
  status: number;
  query_result_id?: string;
}

async function RedashCallAPI(
  id: string,
  obj_params: Record<string, any> = {}
): Promise<any | false> {
  try {
    let p: Job | null = null;
    const body = { max_age: 0 };
    const params = Object.keys(obj_params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(obj_params[key])}`
      )
      .join("&");
    console.log(
      "calling refresh:",
      `${REDASH_API_URL}queries/${id}/refresh?${params}`
    );
    const res1 = await fetch(
      `${REDASH_API_URL}queries/${id}/refresh?${params}`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${REDASH_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    ).catch((e) => {
      console.error("Fetch error:", e);
      return null;
    });

    if (res1 && res1.ok) {
      const jsonResponse = await res1.json();
      p = await pool(jsonResponse.job);
    } else {
      return false;
    }

    if (p && p.status === 4) {
      return false;
    } else if (p) {
      const res2 = await fetch(
        `${REDASH_API_URL}query_results/${p.query_result_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Key ${REDASH_API_KEY}`,
          },
        }
      );
      if (!res2.ok) {
        console.error(`HTTP error! Status: ${res2.status}`);
        return false;
      }
      const jsonData = await res2.json();

      const rows = jsonData["query_result"]["data"]["rows"];
      return rows ? rows : false;
    }
    return false;
  } catch (error) {
    console.error(`error => `, error);
    return false;
  }
}

async function pool(obj: { id: string }): Promise<Job> {
  return new Promise(async (resolve, reject) => {
    let job: Job | null = null;
    while (true) {
      try {
        const response = await fetch(`${REDASH_API_URL}jobs/${obj.id}`, {
          method: "GET",
          headers: {
            Authorization: `Key ${REDASH_API_KEY}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          job = data.job as Job;
          if (job.status >= 3) {
            resolve(job);
            break;
          }
        } else {
          reject(new Error(`error status: ${response.status}`));
          break;
        }
      } catch (error) {
        reject(error);
        break;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
  });
}

export async function GET(req: NextRequest) {
  //const { searchParams } = new URL(req.url);
  const fId = "2275"; //searchParams.get("fId");

  const today = new Date();
  const endDateI = new Date(today);
  endDateI.setDate(today.getDate() - 1);

  const startDateI = new Date(endDateI);
  startDateI.setDate(endDateI.getDate() - 30);

  // Format dates to 'YYYY-MM-DD'
  const formatISODate = (date: Date) => date.toISOString().split("T")[0];

  const startDate = formatISODate(startDateI);
  const endDate = formatISODate(endDateI);
  const queryId = "435";

  try {
    if (fId && startDate && endDate && queryId) {
      const objParams = {
        p_enteredFID: fId,
        p_startDate: startDate,
        p_endDate: endDate,
      };

      const data = await RedashCallAPI(queryId, objParams);
      if (data) {
        return new NextResponse(JSON.stringify(data), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        return new NextResponse(
          JSON.stringify({ message: "Failed to fetch data from Redash" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          message: "Bad Request: Missing required query parameters",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
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
