import React, { useState } from "react";
import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "../theme/ThemeContext";

// Mostra o escudo da equipe; se a URL vier vazia ou falhar ao carregar,
// cai num ícone de escudo genérico em vez de deixar um espaço quebrado.
export function TeamCrest({ uri, size = 32 }) {
  const { colors } = useAppTheme();
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name="shield-outline" size={size * 0.85} color={colors.textMuted} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size }}
      resizeMode="contain"
      onError={() => setFailed(true)}
    />
  );
}
