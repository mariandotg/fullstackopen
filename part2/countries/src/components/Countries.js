import Country from "./Country"

const Countries = ({ countriesToShow }) => {
  const len = countriesToShow.length;
  return (
    <div>
      {len === 1 ? <Country country={countriesToShow[0]} /> : (
        len <= 10 ? (
          countriesToShow.map((country) => (
            <div key={country.name.official}>{country.name.common}</div>
          ))
        ) : <div>Too many matches, specify another filter</div>
      )}
    </div>
  )
}

export default Countries