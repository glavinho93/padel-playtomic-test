
const TENANT_ID = "2ea46d91-f7ed-4e4a-aa5c-392ee5995ad9";
const DATE = "2026-11-20";

async function main() {
  const url =
    "https://playtomic.com/api/clubs/availability" +
    `?tenant_id=${TENANT_ID}` +
    `&date=${DATE}` +
    "&sport_id=PADEL";

  console.log("Testing Playtomic API...");
  console.log("Date:", DATE);

  try {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json"
      },
      signal: AbortSignal.timeout(15000)
    });

    console.log("HTTP status:", response.status);

    const body = await response.text();

    if (!response.ok) {
      console.log("Error response:");
      console.log(body.slice(0, 500));
      process.exitCode = 1;
      return;
    }

    const data = JSON.parse(body);

    console.log("SUCCESS: API is accessible");
    console.log("Courts returned:",
      Array.isArray(data) ? data.length : "Unexpected format"
    );

    if (Array.isArray(data)) {
      const slots90 = data.flatMap(court =>
        (court.slots || []).filter(slot =>
          slot.duration === 90
        )
      );

      console.log("90-minute slots found:", slots90.length);
    }

  } catch (error) {
    console.error("Request failed:", error.message);
    process.exitCode = 1;
  }
}

main();
