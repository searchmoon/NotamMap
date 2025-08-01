import { useRef, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
interface dmsToDecimalProps {
  d: string;
  m: string;
  s: string;
  dir: string;
}

function dmsToDecimal({ d, m, s, dir }: dmsToDecimalProps) {
  let val = parseInt(d, 10) + parseInt(m, 10) / 60 + parseFloat(s) / 3600;
  if (dir === "S" || dir === "W") val *= -1;
  return val;
}

function parseCoords(input: string) {
  // 줄바꿈, 하이픈 등을 공백으로 변환 후 좌표 추출
  const regex = /(\d{4,6})([NS])\s*(\d{5,7})([EW])/g;
  const coords = [];
  let match;
  const cleaned = input.replace(/[\n\r-]/g, " ");
  while ((match = regex.exec(cleaned)) !== null) {
    const [lat_raw, lat_dir, lon_raw, lon_dir] = [
      match[1],
      match[2],
      match[3],
      match[4],
    ];
    // 6자리 lat: DDMMSS, 4~5자리 lat: DDMM
    const lat_deg = lat_raw.slice(0, 2);
    const lat_min = lat_raw.slice(2, 4);
    const lat_sec = lat_raw.length === 6 ? lat_raw.slice(4, 6) : "00";

    const lon_deg = lon_raw.slice(0, 3);
    const lon_min = lon_raw.slice(3, 5);
    const lon_sec = lon_raw.length === 7 ? lon_raw.slice(5, 7) : "00";

    const lat = dmsToDecimal({
      d: lat_deg,
      m: lat_min,
      s: lat_sec,
      dir: lat_dir,
    });
    const lon = dmsToDecimal({
      d: lon_deg,
      m: lon_min,
      s: lon_sec,
      dir: lon_dir,
    });

    coords.push([lat, lon]);
  }
  return coords;
}

const NotamMapMain = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [polygon, setPolygon] = useState<L.Polygon | null>(null);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    if (!mapRef.current) return;
    const leafletMap = L.map(mapRef.current).setView([35, 135], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(leafletMap);

    setMap(leafletMap);

    // Clean-up on unmount
    return () => {
      leafletMap.remove();
    };
  }, []);

  // polygon 삭제 (매번 새로 그림)
  const handleDraw = () => {
    if (!map) return;
    const points = parseCoords(input.trim());
    if (points.length < 3) {
      alert("유효한 좌표가 3개 이상 필요합니다.");
      return;
    }
    if (polygon) {
      polygon.remove();
    }
    const poly = L.polygon(points as L.LatLngExpression[], {
      color: "red",
    }).addTo(map);
    setPolygon(poly);
    map.fitBounds(poly.getBounds());
  };

  return (
    <div
      style={{
        padding: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "space-between",
        backgroundColor: "#f0f0f0",
        overflow: "auto",
      }}
    >
      <h2>🛫 NOTAM 좌표 지도 자동 표시기</h2>
      <p>
        좌표를 아무 형식으로 붙여넣어도 됩니다. 예시:{" "}
        <code>412500N1412945E 410440N1412400E 405008N1412402E</code>
      </p>
      <textarea
        value={input}
        name="notam-input"
        onChange={(e) => setInput(e.target.value)}
        placeholder="NOTAM 좌표 문자열을 입력하세요.(유효 좌표 3개 이상 필요)"
        style={{
          flexShrink: 0,
          width: "100%",
          maxWidth: 800,
          height: 120,
          fontSize: 14,
          borderRadius: "8px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      />
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={handleDraw}
          style={{
            margin: "10px 0",
            padding: "10px 15px",
            fontSize: 18,
            background: "#707070",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          지도에 표시
        </button>
      </div>
      <div
        id="map"
        ref={mapRef}
        style={{
          minHeight: 500,
          flexGrow: 1,
          width: "100%",
          marginTop: 10,
          borderRadius: 8,
          boxShadow: "0 2px 8px #0001",
        }}
      />
    </div>
  );
};

export default NotamMapMain;
