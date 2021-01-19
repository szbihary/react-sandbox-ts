import { useState, useCallback, FunctionComponent, ChangeEvent } from "react";
import { debounce } from "lodash";
import styles from "./autoComplete.module.css";

const COUNTRIES_API = "https://restcountries.eu/rest/v2/name";

const DEBOUNCE_DELAY = 300; // ms
const MIN_CHAR_COUNT = 2;

interface Country {
  name: string;
}

const AutoComplete: FunctionComponent = () => {
  const [query, setQuery] = useState("");
  const [resultSet, setResultSet] = useState([]);

  const debouncedFetch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm || searchTerm.length < MIN_CHAR_COUNT) {
        setResultSet([]);
        return;
      }
      try {
        const response = await fetch(`${COUNTRIES_API}/${searchTerm}`);
        if (response.ok) {
          const countries = await response.json();
          setResultSet(countries.map((country: Country) => country.name));
        } else {
          throw Error();
        }
      } catch (error) {
        setResultSet([]);
      }
    }, DEBOUNCE_DELAY),
    []
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchString = event.target.value.trim();
    setQuery(searchString);
    debouncedFetch(searchString);
  };

  const resultList = resultSet.map((countryName) => (
    <div className={styles.listItem} key={countryName} title={countryName}>
      {countryName}
    </div>
  ));

  return (
    <div className={styles.autoComplete}>
      <input type="text" value={query} onChange={handleInputChange} />
      <div className={styles.resultList}>{resultList}</div>
    </div>
  );
};

export default AutoComplete;
