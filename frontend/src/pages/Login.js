import React from 'react'
import logo from '../assets/logo.svg'
import './Login.css'

export default function Login() {
    return (
        <div className='login-container'>
            <form>
                <img src={logo} alt="logo" />
                <input type="text" placeholder="Write your username at GitHub" />
                <button type="submit">Entrar</button>
            </form>

        </div>
    )
}
