import React from 'react';
import { useAppContext } from '../context/appContext';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from '../assets/wrappers/PageBtnContainer';

const PageBtnContainer = () => {
    const { numberOfPages, page, changePage } = useAppContext();

    const pages = Array.from({length:numberOfPages}, (_,index)=>{
        return index + 1;
    });


    const nextPage = ()=>{
        let newPage = page + 1;
        if(newPage > numberOfPages){
            newPage = 1;
        }
        changePage(newPage);
    }

    const prevPage = ()=>{
        let newPage = page -1;
        if(newPage < 1){
            newPage = numberOfPages;
        }
        changePage(newPage);
    } 

    return (
        <Wrapper>
            <button className='prev-btn' onClick={prevPage}>
                <HiChevronDoubleLeft/>
                Previous
            </button>
            <div className='btn-container'>{
            pages.map((pageNumber)=>{
                return (<button type='button' 
                className={pageNumber === page? "pageBtn active" : "pageBtn"}
                key={pageNumber}
                onClick={()=>changePage(pageNumber)}>{pageNumber}</button>)
            })}</div>
            <button className='prev-btn' onClick={nextPage}>
                Next
                <HiChevronDoubleRight/>
            </button>
            
        </Wrapper>
    )
}

export default PageBtnContainer