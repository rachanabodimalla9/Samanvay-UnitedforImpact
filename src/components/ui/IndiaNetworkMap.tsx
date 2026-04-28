import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import * as d3 from "d3";

interface City {
  name: string;
  lng: number;
  lat: number;
}

const CITIES: City[] = [
  { name: "Delhi", lng: 77.2090, lat: 28.6139 },
  { name: "Mumbai", lng: 72.8777, lat: 19.0760 },
  { name: "Bengaluru", lng: 77.5946, lat: 12.9716 },
  { name: "Chennai", lng: 80.2707, lat: 13.0827 },
  { name: "Kolkata", lng: 88.3639, lat: 22.5726 },
  { name: "Hyderabad", lng: 78.4867, lat: 17.3850 },
  { name: "Guwahati", lng: 91.7362, lat: 26.1158 },
  { name: "Lucknow", lng: 80.9462, lat: 26.8467 },
  { name: "Ahmedabad", lng: 72.5714, lat: 23.0225 },
];

// Define some logical connections for the "Network of Hope"
const CONNECTIONS = [
  ["Delhi", "Mumbai"],
  ["Delhi", "Kolkata"],
  ["Delhi", "Lucknow"],
  ["Mumbai", "Bengaluru"],
  ["Mumbai", "Ahmedabad"],
  ["Kolkata", "Guwahati"],
  ["Bengaluru", "Chennai"],
  ["Bengaluru", "Hyderabad"],
  ["Chennai", "Kolkata"],
  ["Hyderabad", "Delhi"],
];

export const IndiaNetworkMap = ({ className }: { className?: string }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const loadMap = async () => {
      try {
        // Using a stable source from Code for America's public data collection
        const res = await fetch("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/india.geojson");
        if (!res.ok) throw new Error("HTTP error " + res.status);
        const data = await res.json();
        setGeoData(data);
      } catch (err) {
        console.error("Failed to load map data", err);
      }
    };
    loadMap();

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!geoData || dimensions.width === 0) {
    return (
      <div ref={containerRef} className={`${className} flex items-center justify-center bg-blue/5 rounded-[4rem]`}>
        <div className="w-12 h-12 border-4 border-blue/20 border-t-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  const projection = d3.geoMercator()
    .center([82, 22])
    .scale(dimensions.width * 1.6)
    .translate([dimensions.width / 2, dimensions.height / 2]);

  const pathGenerator = d3.geoPath().projection(projection);

  return (
    <div ref={containerRef} className={`${className} relative overflow-hidden bg-white dark:bg-gray-800 rounded-[4rem] border border-blue/10 shadow-2xl`}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff1155" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#ff1155" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff1155" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Map Paths (States) */}
        {geoData.features.map((feature: any, i: number) => (
          <motion.path
            key={i}
            d={pathGenerator(feature) || ""}
            fill="transparent"
            stroke="#0A2463" // Deep Navy/Blue matching theme
            strokeWidth="0.8"
            strokeOpacity="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: i * 0.02 }}
            className="hover:fill-blue/5 hover:stroke-ruby hover:stroke-opacity-80 transition-all cursor-pointer"
          />
        ))}

        {/* Highlighted Borders Glow */}
        <motion.path
          d={pathGenerator(geoData) || ""}
          fill="none"
          stroke="#005acd"
          strokeWidth="3"
          strokeOpacity="0.15"
          className="blur-[2px]"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3 }}
        />

        {/* Connections */}
        {CONNECTIONS.map(([fromName, toName], i) => {
          const from = CITIES.find(c => c.name === fromName);
          const to = CITIES.find(c => c.name === toName);
          if (!from || !to) return null;

          const p1 = projection([from.lng, from.lat]);
          const p2 = projection([to.lng, to.lat]);
          if (!p1 || !p2) return null;

          return (
            <motion.line
              key={i}
              x1={p1[0]}
              y1={p1[1]}
              x2={p2[0]}
              y2={p2[1]}
              stroke="url(#connectionGradient)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ delay: 1 + i * 0.1, duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
          );
        })}

        {/* City Dots */}
        {CITIES.map((city, i) => {
          const coords = projection([city.lng, city.lat]);
          if (!coords) return null;
          return (
            <g key={i}>
              <motion.circle
                cx={coords[0]}
                cy={coords[1]}
                r="3"
                className="fill-ruby"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
              />
              <motion.circle
                cx={coords[0]}
                cy={coords[1]}
                r="6"
                className="fill-ruby/20"
                animate={{ scale: [1, 2, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              />
            </g>
          );
        })}
      </svg>

      {/* Decorative Aura */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-white/10 dark:to-black/10"></div>
    </div>
  );
};
