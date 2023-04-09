import React from 'react';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { userContext } from './App';

export const Chatroom = () => {
    const [currentUser, setcurrentUser] = useContext(userContext);

    const navigate = useNavigate();

    const [state,setState] = useState(false);
    const { channel_id } = useParams();
    const [channel,setChannel] = useState({
        channel_name:"",
        member_id:""
    });

    const [messages,setMessages] = useState([]);

    const [message,setMessage] = useState({
        message_text:"",
        channel_id:channel_id,
        owner_id:currentUser.user_id,
        message_ref_id:null,
        message_likes:0,
        message_dislikes:0
    });


    const fetchChannel = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        };
        try{
            const res = await fetch('http://localhost:80/openChannel/' + channel_id, options);
            const json = await res.json();
            setChannel(json[0])
        }catch(err){
            console.log(err)
        }
    }

    const fetchMessages = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try{
            const res = await fetch('http://localhost:80/showMessages/' + channel_id, options);
            const json = await res.json();
            console.log(json)
            setMessages(json);
        }catch(err){
            console.log(err)
        }
    }

    const handleChange = (e) => {
        setMessage((prev)=>({...prev, message_text: e.target.value }));
    };

    const handleClick = (e) => {
        setMessage((prev)=>({...prev, message_ref_id: e.target.value}));
    }

    const handleLike = async (e) => {
        e.preventDefault();
        try{
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message_id: e.target.value})
            };

            const response = await fetch('http://localhost:80/likeMessage', options);
            const json = await response.json();
            console.log(json);
            setState(!state);
        }catch(err){
            console.log(err);
        }
    }

    const handleDislike = async (e) => {
        e.preventDefault();
        try{
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message_id: e.target.value})
            };
            const response = await fetch('http://localhost:80/dislikeMessage', options);
            const json = await response.json();
            console.log(json);
            setState(!state);
        }catch(err){
            console.log(err);
        }
    }

    const handleMessage = async (e) => {
        e.preventDefault();
        try{
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            };
            const response = await fetch('http://localhost:80/newMessage', options);
            const json = await response.json();
            console.log(json);
            setState(!state);
        }catch(err){
            console.log(err);
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
            const res = await fetch('http://localhost:80/deleteMessage/' + e.target.value, options);
            const json = await res.json();
            setState(!state);
            console.log(json);
        }catch(err){
            console.log(err)
        }
    }


    useEffect(() => {
        if(!currentUser.user_id) {
            navigate("/")
        }
        fetchChannel();
        fetchMessages();
    }, [state])

    return (
        <div className='chatroom'>
            <div className='header'>
                <h1>Not Discord</h1>
            </div>
            <div className='greeting'>
                <h1>Hello {currentUser.user_name}!</h1>
            </div>
            <div className='links'>
                {currentUser.user_name=="admin" && <Link to={'/app'}>Admin Page</Link>}
                <br></br>
                <Link to={'/channels'}>Channels</Link>
            </div>
            <div className='channelDetail'>
                <h1>{channel.channel_name}</h1>
            </div>
            <div className='messages'>
                <div className='publicMessages'>
                    {messages.map((message) => ( message.ref_text ?
                        <dl className='messageReply'>
                            <dt>{message.user_name} reply to "{message.ref_text}":</dt>
                            <dd>-{message.message_text}<input type="checkbox" onClick={handleClick} name='message_ref_id' value={message.message_id}/></dd>
                            <dd><button onClick={handleLike} value={message.message_id}>{message.message_likes} Likes</button>
                            <button onClick={handleDislike} value={message.message_id}>{message.message_dislikes} Dislikes</button>
                            {currentUser.user_name=="admin" && <button onClick={handleDelete} value={message.message_id}>Delete Message</button>}</dd>
                        </dl>
                        :
                        <dl className='message'>
                            <dt>{message.user_name}:</dt> 
                            <dd>-{message.message_text}<input type="checkbox" onClick={handleClick} name='message_ref_id' value={message.message_id}/></dd>
                            <dd><button onClick={handleLike} value={message.message_id}>{message.message_likes} Likes</button>
                            <button onClick={handleDislike} value={message.message_id}>{message.message_dislikes} Dislikes</button>
                            {currentUser.user_name=="admin" && <button onClick={handleDelete} value={message.message_id}>Delete Message</button>}</dd>
                        </dl>
                    ))}
                    <dl className='messageBox'>
                        <h3>{currentUser.user_name}:</h3>
                        <input placeholder='Type a new message' onChange={handleChange} name='message_text'/>
                        <button onClick={handleMessage}name='newMessage'>Send</button>
                    </dl>
                </div>
            </div>
            <div className='footer'>
                <p>In development</p>
            </div>
        </div>
    )
}