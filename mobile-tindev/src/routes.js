import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from './pages/Login'
import Main from './pages/Main'

const Stack = createNativeStackNavigator()
export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login}
                    options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={Main}
                    options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}