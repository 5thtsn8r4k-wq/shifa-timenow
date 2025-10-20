// server.js — Express server returning JSON for Vapi

const express = require("express");
const app = express();

app.use(express.json());

// Helper for time info
function timeData(tz = "America/Chicago") {
  const now = new Date();

  const local_time = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  return {
    ok: true,
    timezone: tz,
    utc_iso: now.toISOString(),
    unix: now.getTime(),
    date,
    local_time,
  };
}

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Shifa TimeNow running." });
});

app.get("/timenow", (req, res) => {
  const tz = req.query.timezone || "America/Chicago";
  res.json(timeData(tz));
});

// This one is what Vapi will use automatically:
app.post("/tool-calls", (req, res) => {
  try {
    const { toolName, args } = req.body || {};
    if (toolName === "timenow") {
      const tz = (args && args.timezone) || "America/Chicago";
      return res.json(timeData(tz));
    } else {
      return res.status(404).json({ ok: false, error: "Unknown tool" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "tool-calls failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on port ${PORT}`));
