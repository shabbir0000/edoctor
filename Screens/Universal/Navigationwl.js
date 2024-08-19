import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Auth/Login';
import Signup from '../Auth/Signup';
import Forget from '../Auth/Forget';
import WelcomeScreen from '../Auth/WelcomeScreen';
import Code from '../Auth/Code';
import Newpass from '../Auth/Newpass';
import Subplan from '../Auth/Subplan';
import Tabbar from './Tabbar';
import PP from './PP';
import Updateprofile from '../../Components/Profile/Updateprofile';
import Showvideo from '../../Components/Session/Showvideo';
import Showappoinments from '../../Components/Session/Showappoinments';

// import Home from '../Bottomtabs/Home';
// import Tabbar from './Tabbar';
// import Changepass from '../../Components/Setting/Changepass';
// import Sendfeedback from '../../Components/Setting/Sendfeedback';
// import Tou from '../../Components/Setting/Tou';
// import PP from '../../Components/Setting/PP';
// import Orders from '../Bottomtabs/Orders';
// import Upload from '../Bottomtabs/Upload';
// import Addproduct from '../ProductsAndCat/Addproduct';
// import Viewproduct from '../ProductsAndCat/Viewproduct';
// import Addcat from '../ProductsAndCat/Addcat';
// import Viewcat from '../ProductsAndCat/Viewcat';
// import Viewcatproduct from '../ProductsAndCat/Viewcatproduct';
// import Productdetail from '../ProductsAndCat/Productdetail';
// import Vieworder from '../Order/Vieworder';


const Stack = createNativeStackNavigator();


function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='WelcomeScreen' screenOptions={{
        headerShown: false,

      }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Forget" component={Forget} />
        <Stack.Screen name="Code" component={Code} />
        <Stack.Screen name="Newpass" component={Newpass} />
        <Stack.Screen name="Updateprofile" component={Updateprofile} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="Subplan" component={Subplan} />
        <Stack.Screen name="Tabbar" component={Tabbar} />
        <Stack.Screen name='PP' component={PP} />
        <Stack.Screen name='Subsplan' component={Subplan} />
        <Stack.Screen name='Showvideo' component={Showvideo} />
        <Stack.Screen name='Showappoinments' component={Showappoinments} />
        {/* <Stack.Screen name="Viewcatproduct" component={Viewcatproduct} /> */}
        {/* <Stack.Screen options={{
           cardStyle: { backgroundColor: '#fffff' }
        }} name="Home" component={Home} /> */}
        {/* <Stack.Screen name="Tabbar" component={Tabbar} />
        <Stack.Screen name="Vieworder" component={Vieworder} />
        <Stack.Screen name="Productdetail" component={Productdetail} />
        <Stack.Screen name='Changepass' component={Changepass} />
        <Stack.Screen name='Sendfeedback' component={Sendfeedback} />
        <Stack.Screen name='TOU' component={Tou} />
        <Stack.Screen name='PP' component={PP} />
        <Stack.Screen name='ORDER' component={Orders} />
        <Stack.Screen name='Product' component={Upload} />
        <Stack.Screen name='Addproduct' component={Addproduct} />
        <Stack.Screen name='Viewproduct' component={Viewproduct} />
        <Stack.Screen name='Addcat' component={Addcat} />
        <Stack.Screen name='Viewcat' component={Viewcat} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;