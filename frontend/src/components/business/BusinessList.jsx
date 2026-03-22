import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRequest } from '../../utils/reqests/requests'
import { setBusinesses } from '../../features/business/allBusinessSlice'
import BusinessCard from './BusinessCard';

export default function BusinessList() {
    const dispatch = useDispatch();
    const { businesses } = useSelector(state => state.allBusinesses);

    useEffect(() => {
        const fetchBusinesses = async () => {
            const res = await getRequest("all_businesses/");
            dispatch(setBusinesses(res));
        };
        fetchBusinesses();
    }, []);

    return (
        <>
            {businesses.map(b => (
                <BusinessCard key={b.id} business={b} />
            ))}
        </>
    )
}