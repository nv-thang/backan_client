import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "react-tabs/style/react-tabs.css";
import "./MapWithPanel.css";

import MarkerClusterGroup from "react-leaflet-cluster";

import Adventure from "../../Images/adventure.png";
import Cave from "../../Images/cave.png";
import Lake from "../../Images/lake.png";
import Location from "../../Images/marker.png";
import Relic from "../../Images/relic.png";
import Reserve from "../../Images/reserve.png";
import Terraces from "../../Images/terraces.png";
import Waterfall from "../../Images/waterfall.png";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import ToolPanel from "./ToolPanel";
import ClusterModal from "./ClusterModal";

const MapWithPanel = () => {
  const center = [22.275680307028182, 105.87320519077504];
  const [info, setInfo] = useState({
    action: false,
    id: "",
    title: "",
    lat: "",
    lng: "",
    type: "",
    desc: "Chọn đối tượng để hiển thị thông tin",
  });

  const [places, setListPlace] = useState({});
  const [geoJSONData, setGeoJSONData] = useState({});
  const [originalGeoJSONData, setOriginalGeoJSONData] = useState({}); // Thêm trạng thái này

  const [showModal, setShowModal] = useState(false);
  const [clusters, setClusters] = useState({});
  const [selectedClusters, setSelectedClusters] = useState({});

  const mapRef = useRef(null);

  const checkIcon = useCallback((type) => {
    let iconUrl;
    switch (parseInt(type)) {
      case 2: // hang động
        iconUrl = Cave;
        break;
      case 7: // thác nước
        iconUrl = Waterfall;
        break;
      case 6: // sinh thái
        iconUrl = Adventure;
        break;
      case 5: // lịch sử
        iconUrl = Relic;
        break;
      case 4: // Hồ ao
        iconUrl = Lake;
        break;
      case 3: // bảo tồn
        iconUrl = Reserve;
        break;
      case 1: // cảnh quan ruộng bậc thang
        iconUrl = Terraces;
        break;
      default:
        iconUrl = Location;
    }

    return L.divIcon({
      html: `<div class="custom-icon"><img src="${iconUrl}" alt="icon" /></div>`,
      className: "", // Để tránh các lớp CSS mặc định của Leaflet
      iconSize: [40, 40],
      iconAnchor: [20, 40], // Đặt điểm neo của icon
      popupAnchor: [0, -40], // Đặt điểm neo của popup
    });
  }, []);

  const fetchData = async () => {
    const urlGetAllPlaces = `${process.env.REACT_APP_API_URL}/place/getAllPlace`;
    const urlRanhGioiHuyen = `${process.env.REACT_APP_API_URL}/place/getRanhGioiHuyen`;

    try {
      const response = await fetch(urlGetAllPlaces);
      const results = await response.json();
      setListPlace(results);
      const clusterStatuses = results.reduce((acc, place) => {
        if (!acc[place.cluster]) {
          acc[place.cluster] = true; // Ban đầu tất cả các cụm được bật
        }
        return acc;
      }, {});
      setClusters(clusterStatuses);
      setSelectedClusters(clusterStatuses);
    } catch (error) {
      console.log("error", error);
    }

    try {
      const responseRanhGioiHuyen = await fetch(urlRanhGioiHuyen);
      const resultsRanhGioiHuyen = await responseRanhGioiHuyen.json();
      setGeoJSONData(resultsRanhGioiHuyen);
      setOriginalGeoJSONData(resultsRanhGioiHuyen);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePlaceClick = (place) => {
    const { latitude, longitude } = place;
    setInfo({
      title: place.place_name,
      id: place.id,
      lat: latitude,
      lng: longitude,
      type: place.category,
      desc: place.description,
      action: true,
    });

    if (mapRef.current) {
      mapRef.current.flyTo([latitude, longitude], 14);
    }
  };

  const groupedPlaces = Object.values(places).reduce((acc, place) => {
    if (!acc[place.cluster]) {
      acc[place.cluster] = [];
    }
    acc[place.cluster].push(place);
    return acc;
  }, {});

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(center, 10);
    }
  };

  const handleDraw = () => {
    setShowModal(true);
  };

  const handleToggleCluster = (cluster, isUnCheck) => {
    const normalizedCluster = normalizeName(cluster);

    const filteredGeoJSONData = originalGeoJSONData.filter((geo) =>
      normalizedCluster.includes(normalizeName(geo.name_2))
    );

    if (!isUnCheck) {
      setGeoJSONData((prevGeoJSONData) => [
        ...prevGeoJSONData,
        ...filteredGeoJSONData.filter(
          (geo) => !prevGeoJSONData.some((prevGeo) => prevGeo.gid === geo.gid)
        )
      ]);
    } else {
      setGeoJSONData((prevGeoJSONData) =>
        prevGeoJSONData.filter(
          (geo) =>
            !filteredGeoJSONData.some(
              (filteredGeo) => filteredGeo.gid === geo.gid
            )
        )
      );
    }

    setClusters((prevClusters) => ({
      ...prevClusters,
      [cluster]: !prevClusters[cluster]
    }));

    setSelectedClusters((prevSelectedClusters) => ({
      ...prevSelectedClusters,
      [cluster]: !prevSelectedClusters[cluster]
    }));
  };
  
  
  
  

  // Hàm chuyển đổi tên cluster thành một chuỗi dễ so sánh
  const normalizeName = (name) => {
    const diacriticMap = {
      á: "a",
      à: "a",
      ả: "a",
      ã: "a",
      ạ: "a",
      ă: "a",
      ắ: "a",
      ằ: "a",
      ẳ: "a",
      ẵ: "a",
      ặ: "a",
      â: "a",
      ấ: "a",
      ầ: "a",
      ẩ: "a",
      ẫ: "a",
      ậ: "a",
      đ: "d",
      é: "e",
      è: "e",
      ẻ: "e",
      ẽ: "e",
      ẹ: "e",
      ê: "e",
      ế: "e",
      ề: "e",
      ể: "e",
      ễ: "e",
      ệ: "e",
      í: "i",
      ì: "i",
      ỉ: "i",
      ĩ: "i",
      ị: "i",
      ó: "o",
      ò: "o",
      ỏ: "o",
      õ: "o",
      ọ: "o",
      ô: "o",
      ố: "o",
      ồ: "o",
      ổ: "o",
      ỗ: "o",
      ộ: "o",
      ơ: "o",
      ớ: "o",
      ờ: "o",
      ở: "o",
      ỡ: "o",
      ợ: "o",
      ú: "u",
      ù: "u",
      ủ: "u",
      ũ: "u",
      ụ: "u",
      ư: "u",
      ứ: "u",
      ừ: "u",
      ử: "u",
      ữ: "u",
      ự: "u",
      ý: "y",
      ỳ: "y",
      ỷ: "y",
      ỹ: "y",
      ỵ: "y",
    };

    // Chuẩn hóa tên
    const normalized = name
      .toLowerCase()
      .replace(/\s+/g, "") // Loại bỏ khoảng trắng
      .trim() // Loại bỏ khoảng trắng đầu cuối
      .split(" ") // Tách thành mảng từ các khoảng trắng
      .map((part) => {
        // Loại bỏ dấu và chuẩn hóa từng phần
        return part
          .split("")
          .map((char) => diacriticMap[char] || char)
          .join("")
          .toLowerCase();
      })
      .join(""); // Ghép lại thành một chuỗi

    return normalized;
  };

  const handleSaveClusters = () => {
    setSelectedClusters(clusters);
    setShowModal(false);
  };

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LeftPanel data={places} onPlaceClick={handlePlaceClick} />
        <RightPanel data={info} />
        {Object.entries(geoJSONData).map(([id, polygon]) => (
          <GeoJSON
            key={polygon.gid}
            data={JSON.parse(polygon.geometry)}
            eventHandlers={{
              click: () => {
                setInfo({
                  title: polygon.name_2,
                  desc: polygon.name_2,
                  action: false,
                  id: "",
                  type: "",
                });
              },
            }}
          >
            <Popup>{polygon.name_2}</Popup>
          </GeoJSON>
        ))}
        <MarkerClusterGroup chunkedLoading>
          {Object.entries(places).map(
            ([key, address]) =>
              selectedClusters[address.cluster] && (
                <Marker
                  key={key}
                  position={[address.latitude, address.longitude]}
                  title={address.place_name}
                  icon={checkIcon(address.id_category)}
                  eventHandlers={{
                    click: () => {
                      setInfo({
                        title: address.place_name,
                        id: address.id,
                        lat: address.latitude,
                        lng: address.longitude,
                        type: address.category,
                        desc: address.description,
                        action: true,
                      });

                      if (mapRef.current) {
                        mapRef.current.flyTo(
                          [address.latitude, address.longitude],
                          14
                        ); // Di chuyển map đến vị trí marker
                      }
                    },
                  }}
                >
                  <Popup>{address.place_name}</Popup>
                </Marker>
              )
          )}
        </MarkerClusterGroup>
        <ToolPanel
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onDraw={handleDraw}
          onReset={handleReset}
        />
      </MapContainer>
      <ClusterModal
        show={showModal}
        onHide={() => setShowModal(false)}
        clusters={clusters}
        onToggleCluster={handleToggleCluster}
        onSave={handleSaveClusters}
      />
    </div>
  );
};

export default MapWithPanel;
