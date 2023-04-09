import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { userContext } from './App';
import { Link } from 'react-router-dom';


export const AdminPage = () => {
    const [currentUser, setcurrentUser] = useContext(userContext);
    const [users,setUsers] = useState([]);
    const [state,setState] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        };
        try{
            const res = await fetch('http://localhost:80/showUsers', options);
            const json = await res.json();
            setUsers(json);
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
            const res = await fetch('http://localhost:80/deleteUser/' + e.target.value, options);
            const json = await res.json();
            setState(!state);
            console.log(json);
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        if(currentUser.user_name != "admin") {
            navigate("/")
        }
        fetchUsers()
    }, [state])

    return (
        <div>
            <div className="header">
                <div className="title">
                    <h1>Not Discord</h1>
                </div>
            </div>
            <div className='users'>
                <h2>Registered Users</h2>
                <ul>
                    {users.map((user) => ( user.user_name!="admin" &&
                        <li key={user.user_id}>
                            <label>{user.user_name}</label>
                            <button onClick={handleDelete} value={user.user_id}>Delete User</button>
                        </li>
                    ))}
                </ul>
            </div>

        <div className='adminChannels'>
            <Link  to='/channels'><h2>Manage Channels</h2></Link>
        </div>
            <div className="footer">
                <div className="footnote">
                    <p>In development</p>
                </div>
            </div>
        </div>
    );
}