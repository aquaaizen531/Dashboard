import React, { useEffect, useRef, useState } from "react";
import "@/css/map.css";
import { ImLocation } from "react-icons/im";
import { divIcon } from "leaflet";
import ReactDOMServer from "react-dom/server";
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiArrowDownWideLine } from "react-icons/ri";
import { useBotData } from "@/context/BotContext";
import {
  Activity,
  BatteryCharging,
  Bot,
  IdCard,
  MapPinned,
  MonitorCog,
  Timer,
  Trash2,
  Wrench,
} from "lucide-react";
import StatCard from "@/features/custom/components/stat-card";
import RuntimeCard from "@/features/custom/components/Run-time-Card";
import TempHumidityCard from "@/features/custom/components/Temp-Hum-card";

const Map = () => {
  const iconMarkup = ReactDOMServer.renderToString(
    <ImLocation size={30} color="#7393b3  " />,
  );
  const customIcon = divIcon({
    html: iconMarkup,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
  const [bots, setbots] = useState([]);
  const { botData } = useBotData();
  useEffect(() => {
    setbots(botData);
  }, [botData]);
  const [zoomTo, setzoomTo] = useState(null);
  const [selectedPin, setselectedPin] = useState(null);
  const statsRef = useRef(null);
  const ZoomToMarker = ({ position, z }) => {
    const map = useMap();
    useEffect(() => {
      if (position[0] === 13.0827 && position[1] === 80.2707) {
        z = 12;
      }
      map.flyTo(position, z, {
        animate: true,
        duration: 3,
        easeLinearity: 0.25,
      });
    }, [position, map]);
    return null;
  };
  const chennaiCenter = [13.0827, 80.2707];
  const kochiCenter = [9.9312, 76.2673];
  const FlyToCity = React.memo(({ city }) => {
    const map = useMap();
    useEffect(() => {
      if (!city || city === "All") {
        return;
      }
      let center = chennaiCenter;
      if (city.toLowerCase() === "kochi") center = kochiCenter;
      map.flyTo(center, 11, {
        animate: true,
        duration: 3,
        easeLinearity: 0.25,
      });
    }, [city, map]);
    return null;
  });

  const uniqueCities = ["All", "Chennai", "Kochi"];
  const [selectedCity, setselectedCity] = useState("All");
  const [filteredBots, setfilteredBots] = useState([]);
  const [filtervalue, setfiltervalue] = useState("All");
  const handleApplyBtn = () => {
    setselectedCity(filtervalue);
  };
  useEffect(() => {
    const handleFilteredBots = () => {
      let filtered = bots;
      if (selectedCity && selectedCity !== "All") {
        filtered = filtered.filter(
          (bot) =>
            bot?.data?.[0]?.position?.city?.toLowerCase() ===
            selectedCity.toLowerCase(),
        );
      }
      setfilteredBots(filtered);
    };
    handleFilteredBots();
  }, [bots, selectedCity]);
  useEffect(() => {
    setzoomTo(null);
    setselectedPin(null);
  }, [selectedCity]);
  return (
    <div className="m-2 flex flex-1 flex-col ">
      <div className="flex mb-1 gap-1">
        {/* city dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[130px] justify-between">
              {selectedCity === "All" ? "City" : selectedCity}
              <RiArrowDownWideLine />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[130px] p-1">
            {uniqueCities.map((city, idx) => (
              <DropdownMenuItem key={idx} onClick={() => setfiltervalue(city)}>
                {city}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button onClick={handleApplyBtn} className="apply-btn">
          Apply
        </button>
      </div>
      <div className="w-full h-[calc(100vh-160px)] flex gap-2 flex-col md:flex-row overflow-y-auto ">
        <div
          className={` w-full overflow-hidden rounded-md shadow-md border ${selectedPin ? "w-2/3 md:h-full" : "flex-1"} `}
        >
          <MapContainer
            center={chennaiCenter}
            zoom={13}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <LayersControl position="bottomleft">
              <LayersControl.BaseLayer checked name="OpenSreetMap">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="sataliteMap">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={20}
                  subdomains={["mt1", "mt2", "mt3"]}
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            {filteredBots?.map((bot, idx) => (
              <Marker
                icon={customIcon}
                key={idx}
                position={[
                  Number(bot.data[0].position.lat),
                  Number(bot.data[0].position.lng),
                ]}
                eventHandlers={{
                  click: () => {
                    setzoomTo([
                      bot.data[0].position.lat,
                      bot.data[0].position.lng,
                    ]);
                    setselectedPin(bot);
                    setTimeout(() => {
                      statsRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }, 100);
                  },
                  popupclose: () => {
                    setselectedPin(null);
                    setzoomTo(null);
                  },
                }}
              >
                <Popup>{bot.name}</Popup>
              </Marker>
            ))}
            <FlyToCity city={selectedCity} />
            {zoomTo && <ZoomToMarker position={zoomTo} z={16} />}
          </MapContainer>
        </div>
        {selectedPin && (
          <div
            ref={statsRef}
            className="  lg:m-2 grid grid-cols-1 lg:grid-cols-2 gap-2"
          >
            <StatCard
              className="text-xs"
              title="Id"
              value={selectedPin?.UniqueCode || "__"}
              icon={IdCard}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <StatCard
              className="text-xs"
              title="Bot Name"
              value={selectedPin?.name || "__"}
              icon={Bot}
              iconColor="text-blue-600"
              iconBg="bg-purple-50"
            />
            <StatCard
              className="text-xs"
              title="Status"
              value={selectedPin?.data[0]?.Status || "__"}
              icon={Activity}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <StatCard
              className="text-xs"
              title="Operator"
              value={selectedPin?.data?.[0]?.operator?.name || "__"}
              icon={Wrench}
              iconColor="text-blue-600"
              iconBg="bg-purple-50"
            />
            <StatCard
              className="text-xs"
              title="Robot Uptime"
              value={selectedPin?.data?.[0]?.Robotuptime || "__"}
              icon={Timer}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <StatCard
              className="text-xs"
              title="Battery Level"
              value={`${Math.floor(selectedPin.data[0].Battery) || "__"}%`}
              icon={BatteryCharging}
              iconColor="text-blue-600"
              iconBg="bg-purple-50"
            />
            <StatCard
              className="text-xs"
              title="Distance Covered"
              value={`${Math.round(selectedPin.data[0].DistanceCovered)} KM`}
              icon={MapPinned}
              iconColor="text-blue-600"
              iconBg="bg-purple-50"
            />
            <StatCard
              className="text-xs"
              title="Waste Tray Status"
              value={selectedPin.data[0].Wastetraystatus}
              icon={Trash2}
              iconColor="text-blue-600"
              iconBg="bg-purple-50"
            />
            <div className="col-span-2">
              <RuntimeCard operators={selectedPin.operators} />
            </div>
            <div className="col-span-2">
              <TempHumidityCard data={selectedPin.data} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
