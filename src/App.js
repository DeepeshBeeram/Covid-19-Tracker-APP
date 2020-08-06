import React, { useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import { useState } from "react";
import Infobox from "./Infobox";
import Map from "./Map";
import Table from "./Table";
import Linegraph from "./Linegraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setmapCountries] = useState([]);
  const [mapCaseType, setmapCaseType] = useState("cases");

  const prettyStat = (stat) =>
    stat ? `${numeral(stat).format("+0.0a")}` : "+0";

  useEffect(() => {
    const getCountriesData = async function () {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          setCountries(countries);
          const sortedData = data.sort((a, b) => b.cases - a.cases);
          setTableData(sortedData);
          setmapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  useEffect(() => {
    const fetchData = async function () {
      await fetch("https://disease.sh/v3/covid-19/all")
        .then((res) => res.json())
        .then((data) => {
          setCountryInfo(data);
        });
    };

    fetchData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        {/* header */}
        <div className="app__header">
          <h2>COVID-19 TRACKER</h2>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <Infobox
            isRed
            active={mapCaseType === "cases"}
            onClick={() => setmapCaseType("cases")}
            title="Coronavirus Cases"
            cases={prettyStat(countryInfo.todayCases)}
            total={prettyStat(countryInfo.cases)}
          />
          <Infobox
            active={mapCaseType === "recovered"}
            onClick={() => setmapCaseType("recovered")}
            title="Recovered"
            cases={prettyStat(countryInfo.todayRecovered)}
            total={prettyStat(countryInfo.recovered)}
          />
          <Infobox
            isRed
            active={mapCaseType === "deaths"}
            onClick={() => setmapCaseType("deaths")}
            title="Deaths"
            cases={prettyStat(countryInfo.todayDeaths)}
            total={prettyStat(countryInfo.deaths)}
          />
        </div>

        <Map
          caseType={mapCaseType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h4>Live Cases by Country</h4>
          <Table countries={tableData} />
          <div className="app__graph">
            <h4>World New {mapCaseType}</h4>
            <Linegraph caseType={mapCaseType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
