import React from "react";
import { Map as LeafletMap, TileLayer, Circle, Popup } from "react-leaflet";
import "./Map.css";
import numeral from "numeral";

function Map({ countries, center, zoom, caseType }) {
  const caseTypeColor = {
    cases: {
      hex: "#CC1034",
      multiplier: 800,
    },
    recovered: {
      hex: "#7dd71d",
      multiplier: 1200,
    },
    deaths: {
      hex: "#fb4443",
      multiplier: 2000,
    },
  };

  const showDataonMap = (data, caseType = "cases") =>
    data.map((country) => (
      <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.4}
        color={caseTypeColor[caseType].hex}
        fillColor={caseTypeColor[caseType].hex}
        radius={
          Math.sqrt(country[caseType]) * caseTypeColor[caseType].multiplier
        }
      >
        <Popup>
          <div className="info-container">
            <div
              className="info-flag"
              style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            ></div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#555" }}
            >
              {country.country}
            </div>
            <div className="info-cases">
              Cases: {numeral(country.cases).format("0,0")}
            </div>
            <div className="info-recovered">
              Recovered: {numeral(country.recovered).format("0,0")}
            </div>
            <div className="info-deaths">
              Deaths: {numeral(country.cases).format("0,0")}
            </div>
          </div>
        </Popup>
      </Circle>
    ));

  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright >
                OpenStreetMap </a> contributors '
        ></TileLayer>
        {showDataonMap(countries, caseType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
