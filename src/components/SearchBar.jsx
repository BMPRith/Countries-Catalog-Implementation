import React, { useState } from "react";
const SearchBar = (props) => {
  
  return (
    <div className="top-0 left-0 w-full bg-white shadow z-10">
      <div className="mx-auto px-4 py-3">
			<input
				className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
				value={props.value}
				onChange={(event) => props.setSearchValue(event.target.value)}
				placeholder='Search By Country Name'
			></input>
		</div>
    </div>
  );
};
export default SearchBar;