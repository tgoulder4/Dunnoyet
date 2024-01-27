import { View, Text } from 'react-native'
import React, { createContext } from 'react'
const UserContext = createContext({});
const ContextProvider = (props: { children: React.ReactNode }) => {
    const { children } = props
    return (
        <UserContext.Provider value={ }>
            {children}
        </UserContext.Provider>
    )
}

export default ContextProvider