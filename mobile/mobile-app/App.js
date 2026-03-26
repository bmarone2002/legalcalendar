import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import { ClerkProvider } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

function appendEventId(baseUrl, eventId) {
  if (!eventId) return baseUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}eventId=${encodeURIComponent(eventId)}`;
}

export default function App() {
  const extra = Constants.expoConfig?.extra ?? {};
  const webBaseUrl = extra.webBaseUrl || "https://legal-calendar-production.up.railway.app";
  const clerkPublishableKey = extra.clerkPublishableKey || "";
  const oneSignalAppId = extra.oneSignalAppId || "";

  const [currentUrl, setCurrentUrl] = useState(webBaseUrl);
  const canUseClerk = Boolean(clerkPublishableKey);
  const canUseOneSignal = Boolean(oneSignalAppId);

  useEffect(() => {
    setCurrentUrl(webBaseUrl);
  }, [webBaseUrl]);

  useEffect(() => {
    if (!canUseOneSignal) return;
    let removeClickListener;
    try {
      // When the native OneSignal plugin is not configured, skip setup to avoid startup crashes.
      const OneSignal = require("react-native-onesignal").default;
      OneSignal.initialize(oneSignalAppId);
      OneSignal.Notifications.requestPermission(true);
      removeClickListener = OneSignal.Notifications.addClickListener((event) => {
        const launchUrl = event?.notification?.additionalData?.url;
        const launchEventId = event?.notification?.additionalData?.eventId;
        if (typeof launchUrl === "string" && launchUrl.length > 0) {
          setCurrentUrl(launchUrl);
          return;
        }
        if (typeof launchEventId === "string" && launchEventId.length > 0) {
          setCurrentUrl(appendEventId(webBaseUrl, launchEventId));
        }
      });
    } catch (error) {
      console.warn("OneSignal non disponibile in questa build:", error);
    }
    return () => {
      if (typeof removeClickListener === "function") removeClickListener();
    };
  }, [canUseOneSignal, oneSignalAppId, webBaseUrl]);

  const webView = useMemo(
    () => (
      <WebView
        source={{ uri: currentUrl }}
        originWhitelist={["*"]}
        javaScriptEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        setSupportMultipleWindows={false}
        startInLoadingState
      />
    ),
    [currentUrl]
  );

  if (!canUseClerk) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>Config mancante</Text>
          <Text style={styles.warningText}>
            Imposta `expo.extra.clerkPublishableKey` in `app.json` per abilitare Clerk.
          </Text>
        </View>
        {webView}
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <MobileShell
        webView={webView}
      />
    </ClerkProvider>
  );
}

function MobileShell({ webView }) {
  return (
    <SafeAreaView style={styles.container}>
      {webView}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  warning: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff4e5",
    borderBottomWidth: 1,
    borderBottomColor: "#facc15",
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400e",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: "#78350f",
  },
});
