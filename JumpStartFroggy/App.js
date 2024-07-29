import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen.js";
import Login from "./screens/Login.js";
import Register from "./screens/Register.js";
import Dashboard from "./screens/Dashboard.js";
import Foodlog from "./screens/FoodLog.js";
import Chat from "./screens/Chat.js";
import Missions from "./screens/Mission.js";
import Friends from "./screens/friends.js";
import Feed from "./screens/Feed.js";
import Store from "./screens/Store.js";
import Decor from "./screens/Decor.js";
import { UserProvider } from "./UserContext.js";

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: "transparent",
            },
            headerTitle: "",
            headerTintColor: "#fff",
            headerTransparent: true,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Feed" component={Feed} />
          <Stack.Screen name="Foodlog" component={Foodlog} />
          <Stack.Screen name="Friends" component={Friends} />
          <Stack.Screen name="Store" component={Store} />
          <Stack.Screen
            name="Decor"
            component={Decor}
            options={{ headerLeft: null }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{
              cardStyleInterpolator: ({ current }) => ({
                cardStyle: {
                  opacity: current.progress,
                },
              }),
            }}
          />
          <Stack.Screen name="Missions" component={Missions} />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerLeft: null }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
