import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { apiURL } from './util/api';

const Main = () => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order
  const [sortAttribute, setSortAttribute] = useState('name'); // Default sort attribute
  const pageSize = 25; // Show 25 countries per page

  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${apiURL}/all`);
      if (!res.ok) throw new Error('Something went wrong!');
      const data = await res.json();
      setCountries(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSortAscending = () => {
    setSortAttribute('name');
    setSortOrder('asc');
  };

  const handleSortDescending = () => {
    setSortAttribute('name');
    setSortOrder('desc');
  };

  const sortedCountries = [...countries].sort((a, b) => {
    const comparison = a[sortAttribute].official.localeCompare(b[sortAttribute].official);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const filteredCountries = sortedCountries.filter((country) =>
    country.name.official.toLowerCase().includes(searchValue.toLowerCase())
  );

  const indexOfLastCountry = currentPage * pageSize;
  const indexOfFirstCountry = indexOfLastCountry - pageSize;
  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);

  return (
    <div>
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className='flex justify-between flex-wrap'>
        <div className="flex justify-end mt-2 space-x-4">
          <button
            onClick={handleSortAscending}
            className="btn-sm bg-green-500 hover:bg-green-600 text-white rounded px-3 py-1"
          >
            Ascending
          </button>
          <button
            onClick={handleSortDescending}
            className="btn-sm bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1"
          >
            Descending
          </button>
        </div>
        <div className="flex justify-center mt-2 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="btn-sm bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentCountries.length < pageSize}
            className="btn-sm bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {isLoading && !error && <p>Loading...</p>}
        {error && !isLoading && <p>{error}</p>}
        {currentCountries.map((country) => (
          <div key={country.ccn3} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={country.flags.png}
              alt={`${country.name.official} flag`}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <p className="text-lg font-semibold h-14 line-clamp-2">{country.name.official}</p>
              <button
                className="btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full"
                onClick={() => document.getElementById(`my_modal_${country.ccn3}`).showModal()}
              >
                See Country Details
              </button>
              <dialog id={`my_modal_${country.ccn3}`} className="modal">
                <div className="modal-box">
                  <p>CCA2: {country.cca2}</p>
                  <p>CCA3: {country.cca3}</p>
                  <p>Alternative Spellings: {country.altSpellings.join(', ') + '.'}</p>
                  <p>IDD: {country.idd.root + country.idd.suffixes}</p>
                  <div className="modal-action">
                    <form method="dialog">
                      <button
                        className="btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full"
                        onClick={() =>
                          document.getElementById(`my_modal_${country.ccn3}`).close()
                        }
                      >
                        Close
                      </button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
