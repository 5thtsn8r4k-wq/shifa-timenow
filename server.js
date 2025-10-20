const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint — JSON response
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "✅ Shifa TimeNow service is running",
    instructions: "Use /timenow?timezone=America/Chicago to get current time."
  });
});

// Health check endpoint
app.get("/healthz", (_req, res) => {
  res.json({ ok: true, status: "healthy" });
});

// Format time function
function getTimeData(timezone = "America/Chicago") {
  const now = new Date();

  const localTime = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).format(now);

  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);

  return {
    ok: true,
    timezone,
    utc_iso: now.toISOString(),
    unix: now.getTime(),
    date,
    local_time: localTime
  };
}

// Main endpoint
app.all("/timenow", (req, res) => {
  try {
    const tz =
      req.query.timezone ||
      req.body.timezone ||
      req.body.tz ||
      "America/Chicago";
    const data = getTimeData(tz);
    res.json(data);
  } catch (err) {
    console.error("Error in /timenow:", err);
    res.json({
      ok: false,
      error: "Something went wrong. Returning UTC time instead.",
      ...getTimeData("UTC")
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ JSON Shifa TimeNow running on port ${PORT}`);
});
