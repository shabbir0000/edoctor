import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Navigation from './Screens/Universal/Navigation'
import Navigationwl from './Screens/Universal/Navigationwl'
// import { AppProvider } from './AppContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const App = () => {
  // const mobileid = DeviceInfo.getUniqueId();
  const [id, setid] = useState(false)
  const [flag, setflag] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem("mobileid").then((id) => {
      if (id) {
           
          setid(true)
          setflag(false)

      }
      else {
       setid(false)
       setflag(false)
      }
    })
  }, [])
  return (
    <>
      {
        flag ? 
         <ActivityIndicator style={{flex:1, justifyContent:'center' , alignSelf:'center'}} size={'large'}/>
        :
        id ?
          // <AppProvider>
            <Navigation />
          // </AppProvider>
          :
          // <AppProvider>
            <Navigationwl />
          // </AppProvider>
      }

    </>
  )
}


export default App