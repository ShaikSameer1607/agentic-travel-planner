export async function getWeather({ city }) {
  const res = await fetch(`http://localhost:5000/api/weather?city=${city}`);
  return await res.json();
}

export async function getPlaces({ city }) {
  const res = await fetch(`http://localhost:5000/api/places?city=${city}`);
  return await res.json();
}

export async function getFlights({ source, destination }) {
  const res = await fetch(
    `http://localhost:5000/api/flights?source=${source}&destination=${destination}`
  );
  return await res.json();
}

export async function getHotels({ city, budget }) {
  const res = await fetch(
    `http://localhost:5000/api/hotels?city=${city}&budget=${budget}`
  );
  return await res.json();
}

export async function getNews({ city }) {
  const res = await fetch(`http://localhost:5000/api/news?city=${city}`);
  return await res.json();
}
