async function checkIdMLBB({ userid, serverid }) {
  const token = process.env.STRLEYA_TOKEN;
  console.log("Strleya token loaded?", !!token, token?.slice(0, 6));
  if (!token) {
    const err = new Error("STRLEYA_TOKEN not set");
    err.status = 500;
    throw err;
  }

  const res = await fetch("https://strleyashop.pro/api/lucia_check_id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`, 
    },
    body: JSON.stringify({
      game: "mlbb_special",  
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

module.exports = { checkIdMLBB };
