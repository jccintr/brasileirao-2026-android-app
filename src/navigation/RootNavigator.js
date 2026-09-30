import React from "react";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "../theme/ThemeContext";
import { StandingsScreen } from "../screens/StandingsScreen";
import { RoundsScreen } from "../screens/RoundsScreen";
import { TeamsScreen } from "../screens/TeamsScreen";
import { TeamDetailScreen } from "../screens/TeamDetailScreen";
import { SettingsScreen } from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const TeamsStack = createNativeStackNavigator();

const TAB_ICONS = {
  Classificacao: { on: "podium", off: "podium-outline" },
  Rodadas: { on: "calendar", off: "calendar-outline" },
  Equipes: { on: "shield", off: "shield-outline" },
  Ajustes: { on: "settings", off: "settings-outline" },
};

function TeamsStackNavigator() {
  return (
    <TeamsStack.Navigator screenOptions={{ headerShown: false }}>
      <TeamsStack.Screen name="TeamsList" component={TeamsScreen} options={{ title: "Equipes" }} />
      <TeamsStack.Screen
        name="TeamDetail"
        component={TeamDetailScreen}
        options={({ route }) => ({ title: route.params?.teamName ?? "Equipe" })}
      />
    </TeamsStack.Navigator>
  );
}

export function RootNavigator() {
  const { colors, resolvedMode } = useAppTheme();
  const baseNavTheme = resolvedMode === "dark" ? DarkTheme : DefaultTheme;

  const navTheme = {
    ...baseNavTheme,
    colors: {
      ...baseNavTheme.colors,
      background: colors.background,
      card: colors.headerBackground,
      text: colors.headerText,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: colors.headerBackground },
          headerTintColor: colors.headerText,
          headerTitleStyle: { fontWeight: "700" },
          tabBarStyle: { backgroundColor: colors.tabBarBackground, borderTopColor: colors.border },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabBarInactive,
          tabBarIcon: ({ color, size, focused }) => {
            const icon = TAB_ICONS[route.name];
            return <Ionicons name={focused ? icon.on : icon.off} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Classificacao" component={StandingsScreen} options={{ title: "Classificação" }} />
        <Tab.Screen name="Rodadas" component={RoundsScreen} options={{ title: "Rodadas" }} />
        <Tab.Screen
          name="Equipes"
          component={TeamsStackNavigator}
          options={{ title: "Equipes", headerShown: false }}
        />
        <Tab.Screen name="Ajustes" component={SettingsScreen} options={{ title: "Ajustes" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
