import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import './Login.css'

import api from '../services/api'

export default function Login() {
    const [github_username, setUsername] = useState('')
    const [loading, setLoading] = useState(false) // State for loading spinner

    const history = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true) // Show spinner

        try {
            const response = await api.post('/devs', {
                github_username
            })

            const { _id } = response.data

            history(`/dev/${_id}`) // Redirect to main page with the created ID
        } catch (error) {
            console.error('Error during login:', error)
            alert('An error occurred. Please try again.')
        } finally {
            setLoading(false) // Hide spinner
        }
    }

    return (
        <div className='login-container'>
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="logo" />
                <input
                    type="text"
                    placeholder="Write your username at GitHub"
                    value={github_username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Entrar'}
                </button>
            </form>

            {loading && <div className="spinner"></div>} {/* Spinner */}
        </div>
    )
}