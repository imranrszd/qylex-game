// services/strleya.service.js
async function checkId({ game, userid, serverid }) {
  const token = process.env.STRLEYA_TOKEN;
  if (!token) {
    const err = new Error("STRLEYA_TOKEN not set");
    err.status = 500;
    throw err;
  }

  if (!game) {
    const err = new Error("game is required");
    err.status = 400;
    throw err;
  }

  const res = await fetch("https://strleyashop.pro/api/lucia_check_id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      game: String(game),
      userid: String(userid),
      serverid: String(serverid),
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json?.message || "Strleya check id failed");
    err.status = res.status;
    err.raw = json;
    throw err;
  }

  return json; // { name, region, valid }
}

module.exports = { checkId };
