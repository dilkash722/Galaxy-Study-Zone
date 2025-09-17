export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzkGdw7ophBAzIv37oAf01G-lVLGx1f9Kf-gPVaYHPzn9s_N2qwpcJH1hdDzoXr6eNm/exec",
      {
        method: "POST",
        body: JSON.stringify({ type: "admission", ...body }),
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
