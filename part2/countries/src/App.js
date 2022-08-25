import { useState, useEffect } from 'react'
import axios from "axios";

import Countries from './components/Countries';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => setCountries(response.data));
  }, [])

  const filterByName = (event) => {
    const search = event.target.value
    setSearch(search)
    setCountriesToShow(
      countries.filter((country) => country.name.common.toLowerCase().includes(search.toLowerCase()))
    )
  }

  return (
    <div>
      <div>
        find countries: <input value={search} onChange={filterByName}/>
      </div>
      <div>
        <Countries countriesToShow={countriesToShow}/>
      </div>
    </div>
  )
}

export default App
