import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'

import logo from '../assets/logo.png'

export default function Login({ navigation }) {
    const [user, setUser] = useState('')

    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                navigation.replace('Main', { user })
            }
        })
    }
        , [])

    async function handleLogin() {

        console.log('Login button pressed')
        const response = await api.post('/devs', {
            github_username: user,
        })
        console.log('Response from API:' + user)
        const { _id } = response.data

        await AsyncStorage.setItem('user', _id)
        navigation.replace('Main', { user: _id })

        console.log(_id)
    }

    return (
        <View style={styles.container}>
            <Image source={logo} />
            <TextInput style={styles.input}
                autoCapitalize='none'
                autoCorrect={false}
                placeholder='Insert your username'
                placeholderTextColor='#999'
                value={user}
                onChangeText={setUser}>
            </TextInput>

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 30,
    },
    input: {
        height: 40,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginTop: 20,
        paddingHorizontal: 15,
    },
    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#7159c1',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
})