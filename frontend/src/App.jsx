import { useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/weather?city=${city}`);
      setWeather(res.data);
    } catch {
      setError("City not found. Try again.");
      setWeather(null);
    }
    setLoading(false);
  };

  const chartData = weather ? [
    { name: "Temp °C", value: weather.temperature, fill: "#E8590C" },
    { name: "Feels Like", value: weather.feels_like, fill: "#F4845F" },
    { name: "Humidity %", value: weather.humidity, fill: "#4A90D9" },
    { name: "Wind m/s", value: weather.wind_speed, fill: "#7BC67E" },
  ] : [];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F0F0F",
      fontFamily: "'Outfit', sans-serif",
      color: "#F0EBE0",
      padding: "48px 24px"
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <p style={{
          fontSize: 10, letterSpacing: 6,
          color: "#E8590C", textTransform: "uppercase", marginBottom: 12
        }}>Weather Intelligence</p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 52, fontWeight: 400,
          color: "#F0EBE0", margin: 0
        }}>
          Sky<span style={{ fontStyle: "italic", color: "#E8590C" }}>Cast</span>
        </h1>
        <p style={{
          fontSize: 13, color: "#5A5448",
          letterSpacing: 2, marginTop: 10,
          textTransform: "uppercase"
        }}>Real-time weather dashboard</p>
      </div>

      {/* Search */}
      <div style={{
        display: "flex", gap: 12,
        maxWidth: 480, margin: "0 auto 48px",
        justifyContent: "center"
      }}>
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchWeather()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter city name..."
          style={{
            flex: 1,
            background: "#1A1A1A",
            border: `2px solid ${focused ? "#E8590C" : "#2A2A2A"}`,
            borderRadius: 12,
            padding: "14px 20px",
            fontSize: 15,
            color: "#F0EBE0",
            fontFamily: "'Outfit', sans-serif",
            outline: "none",
            transition: "border-color 0.2s"
          }}
        />
        <button
          onClick={fetchWeather}
          disabled={loading}
          style={{
            padding: "14px 28px",
            background: loading ? "#2A2A2A" : "#E8590C",
            border: "none",
            borderRadius: 12,
            color: loading ? "#5A5448" : "#0F0F0F",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Outfit', sans-serif",
            transition: "all 0.2s"
          }}
        >
          {loading ? "..." : "Search"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p style={{
          textAlign: "center", color: "#C05050",
          fontSize: 14, marginBottom: 24
        }}>{error}</p>
      )}

      {/* Weather display */}
      {weather && (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* City header */}
          <div style={{
            textAlign: "center", marginBottom: 40
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 42, fontWeight: 400,
              color: "#F0EBE0", margin: "0 0 8px"
            }}>
              {weather.city}, <span style={{ color: "#E8590C" }}>{weather.country}</span>
            </h2>
            <p style={{
              fontSize: 16, color: "#8A8070",
              letterSpacing: 2, textTransform: "uppercase"
            }}>{weather.condition}</p>
          </div>

          {/* Stat cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16, marginBottom: 40
          }}>
            {[
              { label: "Temperature", value: `${weather.temperature}°C`, color: "#E8590C" },
              { label: "Feels Like", value: `${weather.feels_like}°C`, color: "#F4845F" },
              { label: "Humidity", value: `${weather.humidity}%`, color: "#4A90D9" },
              { label: "Wind Speed", value: `${weather.wind_speed} m/s`, color: "#7BC67E" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: 16,
                padding: "24px 20px",
                textAlign: "center"
              }}>
                <p style={{
                  fontSize: 10, letterSpacing: 3,
                  color: "#5A5448", textTransform: "uppercase",
                  marginBottom: 12
                }}>{label}</p>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 32, color,
                  margin: 0, fontWeight: 400
                }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: 16,
            padding: "32px 24px"
          }}>
            <p style={{
              fontSize: 10, letterSpacing: 4,
              color: "#5A5448", textTransform: "uppercase",
              marginBottom: 24
            }}>Visual Breakdown</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="name" tick={{ fill: "#8A8070", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8A8070", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0F0F0F", border: "1px solid #2A2A2A", borderRadius: 8 }}
                  labelStyle={{ color: "#F0EBE0" }}
                  itemStyle={{ color: "#E8590C" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <rect key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}

    </div>
  );
}