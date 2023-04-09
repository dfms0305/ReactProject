import './Landing.css'
import React from 'react';
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userContext } from './App';

export const Landing = () => {
    const [currentUser, setcurrentUser] = useContext(userContext);

    const [user,setUser] = useState({
        user_name:"",
        user_password:""
    });

    // function setToken(userToken) {
    //     sessionStorage.setItem('token', JSON.stringify(userToken));
    //   }

    const handleChange = (e) => {
        setUser((prev)=>({...prev, [e.target.name]: e.target.value }));
    };

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            };
            if(user.user_name != "" && user.user_password != "" ) {
                const response = await fetch('http://localhost:80/newUser', options);
                const json = await response.json();
                console.log(json);
                if(json.length == 0) {
                    alert('Wrong username or password. Try Again')
                    navigate("/")
                    
                }
                else {
                    setcurrentUser({user_id:json.insertId ,user_name:user.user_name})
                    // setToken({user_id:json.insertId ,user_name:user.user_name})
                    navigate("/channels")
                }
            }
            else {
                alert('Empty username or password. Try Again')
                navigate("/")
            }
        }catch(err){
            console.log(err);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            };
            if(user.user_name != "" && user.user_password != "" ) {
                const response = await fetch('http://localhost:80/oldUser', options);
                const json = await response.json();
                if(json[0].user_name == "admin") {
                    setcurrentUser(json[0])
                    // setToken(json[0])
                    navigate("/app")
                }
                else if(json.length == 1) {
                    setcurrentUser(json[0])
                    // setToken(json[0])
                    navigate("/channels")
                }
                else {
                    alert('Wrong username or password. Try Again')
                    navigate("/")
                }
            }
            else {
                alert('Empty username or password. Try Again')
                navigate("/")
            }

        }catch(err){
            console.log(err)
        }

    }

    return (
        <div className='Landing'>
            <div className='header'>
                <h1>Not Discord</h1>
            </div>
            <div className='Login'>
                <form>
                    <label>Enter your username: </label> 
                    <input onChange={handleChange} name='user_name'/>
                    <br></br>
                    <label>Enter your password: </label>
                    <input type='password' onChange={handleChange} name='user_password'/>
                    <br></br>
                    <button onClick={handleLogin}>Log in</button>
                </form>
            </div>
            <div className='Register'>
                <form>
                    <label>Enter your username: </label>
                    <input onChange={handleChange} name='user_name'/>
                    <br></br>
                    <label>Enter your password: </label>
                    <input type='password' onChange={handleChange} name='user_password'/>
                    <br></br>
                    <button onClick={handleRegister}>Register</button>
                </form>
            </div>
            <div className='About'>
                <p>A NEW Multichannel message app</p>
                <br></br>
                <p>Here you can connect with friends and interact with each other.</p>
            </div>
            <div className='footer'>
                <p>In development</p>
            </div>
        </div>
    );
}