import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import * as d3 from "d3";

export const IndiaMapBackground = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const markers = [
    { name: "Delhi", lng: 77.2090, lat: 28.6139, color: "#FF9933" },
    { name: "Mumbai", lng: 72.8777, lat: 19.0760, color: "#FFFFFF" },
    { name: "Bengaluru", lng: 77.5946, lat: 12.9716, color: "#138808" },
    { name: "Chennai", lng: 80.2707, lat: 13.0827, color: "#000080" },
    { name: "Kolkata", lng: 88.3639, lat: 22.5726, color: "#D4AF37" },
    { name: "Hyderabad", lng: 78.4867, lat: 17.3850, color: "#FFDF00" },
    { name: "Ahmedabad", lng: 72.5714, lat: 23.0225, color: "#FF9933" },
    { name: "Lucknow", lng: 80.9462, lat: 26.8467, color: "#FFFFFF" },
    { name: "Jaipur", lng: 75.7873, lat: 26.9124, color: "#D4AF37" },
    { name: "Thiruvananthapuram", lng: 76.9366, lat: 8.4855, color: "#138808" },
    { name: "Guwahati", lng: 91.7362, lat: 26.1158, color: "#FF9933" },
    { name: "Srinagar", lng: 74.7973, lat: 34.0837, color: "#FFFFFF" },
    { name: "Bhopal", lng: 77.4126, lat: 23.2599, color: "#138808" },
  ];

  useEffect(() => {
    // Verified stable India States GeoJSON URLs
    const PRIMARY_URL = "https://raw.githubusercontent.com/isatish/india-map-geojson/master/india.geojson";
    const FALLBACK_URL = "https://code.highcharts.com/mapdata/countries/in/in-all.geo.json";
    
    const loadMap = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setGeoData(data);
      } catch (err) {
        console.warn(`Failed to load map from ${url}:`, err);
        if (url === PRIMARY_URL) {
          console.info("Trying fallback URL...");
          loadMap(FALLBACK_URL);
        } else {
          console.error("All map data sources failed.");
        }
      }
    };

    loadMap(PRIMARY_URL);

    const handleResize = () => {
      if (svgRef.current?.parentElement) {
        setDimensions({
          width: svgRef.current.parentElement.clientWidth,
          height: svgRef.current.parentElement.clientHeight
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderPaths = () => {
    if (!geoData || !dimensions.width || !dimensions.height) return null;

    const projection = d3.geoMercator()
      .center([82, 22])
      .scale(dimensions.width * 1.5)
      .translate([dimensions.width / 2, dimensions.height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    return geoData.features.map((feature: any, i: number) => (
      <motion.path
        key={feature.id || i}
        d={pathGenerator(feature) || ""}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.01, duration: 0.5 }}
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        className="hover:fill-saffron/20 transition-colors cursor-default"
      />
    ));
  };

  return (
    <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center">
      <div className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center">
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
        >
          <g className="map-group">
            {renderPaths()}
          </g>
        </svg>

        {/* Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            {geoData && dimensions.width > 0 && markers.map((marker, index) => {
              const projection = d3.geoMercator()
                .center([82, 22])
                .scale(dimensions.width * 1.5)
                .translate([dimensions.width / 2, dimensions.height / 2]);

              const coords = projection([marker.lng, marker.lat]);
              if (!coords) return null;
              
              const [left, top] = coords;

              return (
                <motion.div
                  key={marker.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.05, duration: 0.5 }}
                  style={{ left, top }}
                  className="absolute"
                >
                  {/* Subtle Pulse Aura */}
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                    className="absolute -inset-2 rounded-full blur-sm"
                    style={{ backgroundColor: marker.color }}
                  ></motion.div>
                  
                  <div className="relative flex flex-col items-center -translate-x-1/2 -translate-y-full">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      <MapPin 
                        size={18} 
                        fill={marker.color} 
                        stroke="white" 
                        strokeWidth={1} 
                        className="opacity-80"
                      />
                    </motion.div>
                    <span 
                      className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/40 drop-shadow-sm pointer-events-none"
                    >
                      {marker.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
