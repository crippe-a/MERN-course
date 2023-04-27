import React from 'react';
import { useAppContext } from '../context/appContext';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from '../assets/wrappers/PageBtnContainer';

const PageBtnContainer = () => {
    const { numberOfPages, page } = useAppContext();
    const nextPage = ()=>{
        console.log("Next page");
    }

    const prevPage = ()=>{
        console.log("Previous page");
    } 

    return (
        <Wrapper>
            <button className='prev-btn' onClick={prevPage}>
                <HiChevronDoubleLeft/>
                Previous
            </button>
            <div className='btn-container'>Buttons</div>
            <button className='prev-btn' onClick={nextPage}>
                <HiChevronDoubleRight/>
                Next
            </button>
            
        </Wrapper>
    )
}

export default PageBtnContainer