import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  UIManager,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { Button, colors, ui } from "./ui";
import { isScriptureUrl } from "../utils/reader";
import type { WebViewProps } from "react-native-webview";
let NativeReader: React.ComponentType<WebViewProps> | null = null;
try {
  if (UIManager.getViewManagerConfig("RNCWebView"))
    NativeReader = require("react-native-webview").WebView;
} catch {
  /* Older development builds keep the browser fallback. */
}
export default function ScriptureReader({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const valid = isScriptureUrl(url);
  async function browser() {
    try {
      await WebBrowser.openBrowserAsync(url, {
        toolbarColor: colors.paper,
        controlsColor: colors.green,
        showTitle: true,
      });
    } catch {
      setFailed(true);
    }
  }
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.page}>
        <View style={styles.header}>
          <Text style={ui.eyebrow}>LEITURA · FONTE OFICIAL</Text>
          <Text accessibilityRole="header" style={ui.heading}>
            {title}
          </Text>
          <View style={styles.actions}>
            <View style={styles.action}>
              <Button secondary title="Voltar ao estudo" onPress={onClose} />
            </View>
            {valid && (
              <View style={styles.action}>
                <Button secondary title="No navegador ↗" onPress={browser} />
              </View>
            )}
          </View>
        </View>
        {!valid ? (
          <View style={styles.message}>
            <Text style={ui.body}>Esta referência não está disponível.</Text>
          </View>
        ) : !NativeReader ? (
          <View style={styles.message}>
            <Text style={ui.heading}>Leia sem perder sua lição</Text>
            <Text style={ui.body}>
              Abra a leitura abaixo e feche a janela do navegador para continuar
              de onde parou.
            </Text>
            <Button title="Abrir leitura" onPress={browser} />
            <Text style={ui.small}>
              A leitura diretamente nesta tela estará disponível após instalar a
              nova versão do aplicativo.
            </Text>
            {failed && (
              <Text accessibilityLiveRegion="polite" style={ui.body}>
                Não foi possível abrir. Verifique a conexão e tente novamente.
              </Text>
            )}
          </View>
        ) : failed ? (
          <View style={styles.message}>
            <Text style={ui.heading}>Não foi possível carregar</Text>
            <Text style={ui.body}>
              Verifique sua conexão. Você também pode abrir o capítulo no
              navegador.
            </Text>
            <Button
              title="Tentar novamente"
              onPress={() => {
                setFailed(false);
                setLoading(true);
                setAttempt((n) => n + 1);
              }}
            />
          </View>
        ) : (
          <View style={styles.web}>
            <NativeReader
              key={attempt}
              source={{ uri: url }}
              style={styles.web}
              originWhitelist={["https://www.churchofjesuschrist.org"]}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setFailed(true);
              }}
              onHttpError={({ nativeEvent }) => {
                if (nativeEvent.statusCode >= 400) {
                  setLoading(false);
                  setFailed(true);
                }
              }}
              onShouldStartLoadWithRequest={(request) =>
                request.url === "about:blank" || isScriptureUrl(request.url)
              }
              sharedCookiesEnabled={false}
              thirdPartyCookiesEnabled={false}
              allowsFullscreenVideo={false}
              setSupportMultipleWindows={false}
            />
            {loading && (
              <View style={styles.loading} accessibilityLiveRegion="polite">
                <ActivityIndicator color={colors.green} />
                <Text style={ui.small}>Carregando escrituras…</Text>
              </View>
            )}
          </View>
        )}
        <Text style={styles.source}>
          churchofjesuschrist.org · Leitura online · Conta independente do
          Vereda
        </Text>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  header: {
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  action: { flex: 1, minWidth: 130 },
  message: { flex: 1, padding: 24, gap: 20, justifyContent: "center" },
  web: { flex: 1 },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.paper,
  },
  source: {
    padding: 12,
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
  },
});
