import LeafletMap from "./LeafletMap";

export default function AdvancedMap({ city, places = [] }) {
  return <LeafletMap city={city} places={places} />;
}