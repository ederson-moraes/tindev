import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout' // Import the Material Ic
import { useParams } from 'react-router-dom'
import './Main.css'
import api from '../services/api'
import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'
import itsamatch from '../assets/itsamatch.png'
export default function Main({ }) {
    const params = useParams()

    const [users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(null)

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: params.id
                }
            })
            console.log(response.data)

            setUsers(response.data)
        }
        loadUsers()
    }, [params.id])

    useEffect(() => {
        const socket = io('http://192.168.1.161:3333', {
            query: { user: params.id }
        })
        socket.on('match', dev => {
            setMatchDev(dev)
            console.log(dev)
        })
    }, [params.id])




    async function handleLike(id) {
        await api.post(`/devs/${id}/likes`, null, {
            headers: {
                user: params.id
            }
        })

        setUsers(users.filter(user => user._id !== id))
    }

    async function handleDislike(id) {
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: {
                user: params.id
            }
        })

        setUsers(users.filter(user => user._id !== id))
    }

    return (
        <div className='main-container'>
            <Link to="/" className="logoff-link">
                <LogoutIcon fontSize="large" />
            </Link>

            <img src={logo} alt="logo" />

            {users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar} alt={user.name} />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="Dislike" />
                                </button>
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="Like" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty">No More Matches :(</div>
            )}
            {matchDev && (
                <div className="match-container">
                    <img src={itsamatch} alt="It's a match" />
                    <img className="avatar" src={matchDev.avatar} alt="It's a match" />
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>
                    <button type="button" onClick={() => setMatchDev(null)}>Close</button>
                </div>
            )}
        </div>
    )
}

