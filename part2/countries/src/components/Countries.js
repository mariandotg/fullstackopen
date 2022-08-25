import { useState } from "react";
import Country from "./Country"

const Countries = ({ countriesToShow }) => {
  const [country, setCountry] = useState("");

  const len = countriesToShow.length;

  return (
    <div>
      {len === 1 ? <Country country={countriesToShow[0]} /> : (
        len <= 10 ? (
          countriesToShow.map((country) => (
            <div key={country.name.official}>{country.name.common}<button onClick={() => setCountry(country)}>show</button></div>
          ))
        ) : <div>Too many matches, specify another filter</div>
      )}
      {country ? <Country country={country} /> : null}
    </div>
  )
}

export default Countries