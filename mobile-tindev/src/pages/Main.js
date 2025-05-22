import { Text, View, SafeAreaView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { useEffect, useState, useLayoutEffect } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'
import Feather from 'react-native-vector-icons/Feather'
import io from 'socket.io-client'

import logo from '../assets/logo.png'
import dislike from '../assets/dislike.png'
import like from '../assets/like.png'

import itsamatch from '../assets/itsamatch.png'

export default function Main() {
    const route = useRoute()
    const navigation = useNavigation()
    const { user } = route.params || {}

    const [users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(null)

    // Add logout button to header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={async () => {
                        await AsyncStorage.clear()
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        })
                    }}
                >
                    <Feather name="log-out" style={styles.logout} />
                </TouchableOpacity>
            ),
            headerShown: true,
            title: '', // Show header to display the button
        })
    }, [navigation])

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user
                }
            })
            setUsers(response.data)
        }
        if (user) loadUsers()
    }, [user])

    useEffect(() => {
        const socket = io('http://192.168.1.161:3333', {
            query: { user }
        })
        socket.on('match', dev => {
            setMatchDev(dev)
            console.log(dev)
        })
    }, [user])

    async function handleLike() {
        const [current, ...rest] = users
        await api.post(`/devs/${current._id}/likes`, null, {
            headers: {
                user // this is the logged-in user id from route params
            }
        })

        setUsers(rest)
    }

    async function handleDislike() {
        const [current, ...rest] = users
        await api.post(`/devs/${current._id}/dislikes`, null, {
            headers: {
                user // this is the logged-in user id from route params
            }
        })

        setUsers(rest)
    }


    return (
        <SafeAreaView style={styles.container}>
            <Image source={logo} style={styles.logo} />

            <View style={styles.cardsContainer}>
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.empty}>No more matches :(</Text>
                )}
            </View>


            {
                users.length > 0 && (
                    <View style={styles.buttonsContainers}>
                        <TouchableOpacity onPress={handleDislike} style={styles.button}>
                            <Image source={dislike} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLike} style={styles.button}>
                            <Image source={like} />
                        </TouchableOpacity>
                    </View>
                )
            }
            {matchDev && (
                <View style={styles.matchContainer}>
                    <Image source={itsamatch} style={styles.matchImage}></Image>
                    <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio} numberOfLines={3}>{matchDev.bio}</Text>
                    <TouchableOpacity onPress={() => setMatchDev(null)} >
                        <Text style={styles.closeMatch}>Close</Text>
                    </TouchableOpacity>

                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        paddingTop: 50,
    },

    logo: {
        marginTop: 30,
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,

    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    avatar: {
        height: 300,
        flex: 1,

    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18,
    },
    buttonsContainers: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    button: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadownOpacity: 0.2,
        shadownRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        }
    },
    logout: {
        fontSize: 20,
        color: '#7159c1',
    },
    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
    },
    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,

    },
    matchImage: {
        height: 60,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },
    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    matchBio: {
        fontSize: 16,
        marginTop: 10,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    closeMatch: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: 'bold',
        marginTop: 30,
        padding: 10,
        backgroundColor: '#7159c1',
        borderRadius: 50,
    }

})
//         width: '100%',