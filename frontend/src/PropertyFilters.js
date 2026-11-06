import { useState } from 'react';

const EMPTY_FILTERS = {
  city: '',
  zipcode: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: '',
};

export default function PropertyFilters({onSearch}){
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    function handleChange(e){
        const {name, value} = e.target;
        setFilters((prev) => ({...prev, [name]:value}));
    }

    function handleSubmit(e){
        e.preventDefault();
        onSearch(filters);
    }

    function handleClear(){
        setFilters(EMPTY_FILTERS);
        onSearch(EMPTY_FILTERS);
    }

    return (
        <form onSubmit={handleSubmit}>
        <label htmlFor="city">City</label>
        <input
            id="city"
            name="city"
            value={filters.city}
            onChange={handleChange}
        />
        
        <label htmlFor="zipcode">Zipcode</label>
        <input 
            id="zipcode"
            name="zipcode"
            value={filters.zipcode}
            maxLength={5}
            onChange={handleChange}
        />

        <label htmlFor="minPrice">Min Price</label>
        <input 
            id="minPrice"
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
        />

        <label htmlFor="maxPrice">Max Price</label>
        <input
            id="maxPrice"
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
        />

        <label htmlFor="beds">Beds</label>
        <select id="beds" name="beds" value={filters.beds} onChange={handleChange}>
        <option value="">Any</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        </select>

        <label htmlFor="baths">Baths</label>
        <select id="baths" name="baths" value={filters.baths} onChange={handleChange}>
        <option value="">Any</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        </select>

        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>Clear Filters</button>
        </form>
  );
}