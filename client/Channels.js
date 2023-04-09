import React from 'react';
import { useEffect } from 'react'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { userContext } from './App';


export const Channels = () => {
    const [currentUser, setcurrentUser] = useContext(userContext);

    const navigate = useNavigate();

    const [state,setState] = useState(false);
    const [channels,setChannels] = useState([]);
    const [newChannel,setNewChannel] = useState({
        channel_name:"",
        member_id:currentUser?.user_id
    });

    // function getToken() {
    //     const tokenString = sessionStorage.getItem('token');
    //     const userToken = JSON.parse(tokenString);
    //     return userToken?.token
    // }

    const handleChange = (e) => {
        setNewChannel((prev)=>({...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try{
            console.log(newChannel);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newChannel)
            };
            const response = await fetch('http://localhost:80/newChannel', options);
            const json = await response.json();
            console.log(json);
            setState(!state);
        }catch(err){
            console.log(err)
        }
    }

    const fetchChannels = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        };
        try{
            const res = await fetch('http://localhost:80/showChannels', options);
            const json = await res.json();
            setChannels(json);
            console.log(json);
        }catch(err){
            console.log(err)
        }
    }

    const handleDelete = async (e) => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        };
        try{
            const res = await fetch('http://localhost:80/deleteChannel/' + e.target.value, options);
            const json = await res.json();
            setState(!state);
            console.log(json);
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        if(!currentUser.user_id) {
            navigate("/")
        }
        fetchChannels()
    }, [state])

    return (
        <div>
            <div className='header'>
                <h1>Not Discord</h1>
            </div>
            <div className='greeting'>
                <h1>Hello {currentUser.user_name}!</h1>
                {currentUser.user_name=="admin" && <Link to={'/app'}>Admin Page</Link>}
            </div>

            <div className='channels'>
                <h2>Available Channels:</h2>
                <ul>
                    {channels.map((channel) => ( currentUser.user_name!="admin" ?
                        <li className='listedChannel'>
                            <Link  to={`/channels/${channel.channel_id}`}>{channel.channel_name}</Link>
                        </li>
                        :
                        <li className='listedChannel'>
                        <Link  to={`/channels/${channel.channel_id}`}>{channel.channel_name}</Link>
                        <button onClick={handleDelete} value={channel.channel_id}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='newChannel'>
                <h2>Create new Channel</h2>
                <input placeholder='Name' onChange={handleChange} name='channel_name'/>
                <button onClick={handleClick}>Create</button>
            </div>
            <div className='footer'>
                <p>In development</p>
            </div>
        </div>
    );
}