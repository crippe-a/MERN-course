import React from 'react';
import {FormRow, FormRowSelect} from ".";
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';

const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
    statusOptions,
  } = useAppContext();

  const handleSearch = (e) =>{
    if(isLoading) return;
    handleChange({name: e.target.name, value: e.target.value});
  }
  const handleSubmit = (e) =>{
    e.preventDefault();
    clearFilters();
  }
  return (
    <Wrapper>
      <form className='form'>
        <h4>Search form</h4>
        <div className='form-center'>
          {/* Search by position */}
          <FormRow type="text" name="search" value={search} handleChange={handleSearch}></FormRow>
          {/* Search by status */}
          <FormRowSelect labelText="status" name="searchStatus" value={searchStatus} handleChange={handleSearch} list={["all", ...statusOptions]}/>
          {/* Search by type */}
          <FormRowSelect labelText="type" name="searchType" value={searchType} handleChange={handleSearch} list={["all", ...jobTypeOptions]}/>
          {/* Sort */}
          <FormRowSelect name="sort" value={sort} handleChange={handleSearch} list={sortOptions}/>
          <button className='btn btn-block btn-danger' disabled={isLoading} onClick={handleSubmit}>Clear filters</button>
        </div>
      </form>
      </Wrapper>
  )
}

export default SearchContainer;