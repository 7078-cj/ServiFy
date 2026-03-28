import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getRequest } from '../utils/reqests/requests';

export default function Profile() {
    const {profile} = useSelector(state => state.profile);
    return (
        <div>
            {profile ? (
                <div>
                    <h1>{profile.first_name} {profile.last_name}</h1>
                    <p>Username: {profile.username}</p>
                    <p>Email: {profile.email}</p>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    )
}
