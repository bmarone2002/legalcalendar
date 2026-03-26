import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";
import { ClerkProvider, useAuth, useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

function appendEventId(baseUrl, eventId) {
  if (!eventId) return baseUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}eventId=${encodeURIComponent(eventId)}`;
}

export default function App() {
  const extra = Constants.expoConfig?.extra ?? {};
  const webBaseUrl =
    extra.webBaseUrl || "https://legalcalendar-production.up.railway.app";
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
      const OneSignal = require("react-native-onesignal").default;
      OneSignal.initialize(oneSignalAppId);
      OneSignal.Notifications.requestPermission(true);
      removeClickListener = OneSignal.Notifications.addClickListener(
        (event) => {
          const launchUrl = event?.notification?.additionalData?.url;
          const launchEventId = event?.notification?.additionalData?.eventId;
          if (typeof launchUrl === "string" && launchUrl.length > 0) {
            setCurrentUrl(launchUrl);
            return;
          }
          if (
            typeof launchEventId === "string" &&
            launchEventId.length > 0
          ) {
            setCurrentUrl(appendEventId(webBaseUrl, launchEventId));
          }
        }
      );
    } catch (error) {
      console.warn("OneSignal non disponibile in questa build:", error);
    }
    return () => {
      if (typeof removeClickListener === "function") removeClickListener();
    };
  }, [canUseOneSignal, oneSignalAppId, webBaseUrl]);

  if (!canUseClerk) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>Config mancante</Text>
          <Text style={styles.warningText}>
            Imposta expo.extra.clerkPublishableKey in app.json per abilitare
            Clerk.
          </Text>
        </View>
        <WebView
          source={{ uri: currentUrl }}
          originWhitelist={["*"]}
          javaScriptEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          setSupportMultipleWindows={false}
          startInLoadingState
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <MobileShell
        webBaseUrl={webBaseUrl}
        currentUrl={currentUrl}
        setCurrentUrl={setCurrentUrl}
      />
    </ClerkProvider>
  );
}

function MobileShell({ webBaseUrl, currentUrl, setCurrentUrl }) {
  const webViewRef = useRef(null);
  const { isSignedIn, getToken } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const oauthPending = useRef(false);

  useEffect(() => {
    if (Platform.OS !== "web") {
      WebBrowser.warmUpAsync();
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);

  // After native Clerk OAuth succeeds, bridge the session into the WebView
  // by navigating to the exchange endpoint that sets the __session cookie.
  useEffect(() => {
    if (isSignedIn && oauthPending.current) {
      oauthPending.current = false;
      getToken().then((token) => {
        if (token) {
          setCurrentUrl(
            `${webBaseUrl}/api/mobile/exchange?token=${encodeURIComponent(token)}`
          );
        }
      });
    }
  }, [isSignedIn, getToken, webBaseUrl, setCurrentUrl]);

  const handleGoogleOAuth = useCallback(async () => {
    if (oauthPending.current) return;
    try {
      oauthPending.current = true;
      const redirectUrl = makeRedirectUri({
        scheme: "legalcalendar",
        path: "oauth-native-callback",
      });
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else {
        oauthPending.current = false;
      }
    } catch (err) {
      oauthPending.current = false;
      console.warn("Google OAuth error:", err);
    }
  }, [startOAuthFlow]);

  const handleShouldStartLoad = useCallback(
    (request) => {
      if (request.url.includes("accounts.google.com")) {
        handleGoogleOAuth();
        return false;
      }
      return true;
    },
    [handleGoogleOAuth]
  );

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        originWhitelist={["*"]}
        javaScriptEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        setSupportMultipleWindows={false}
        startInLoadingState
        onShouldStartLoadWithRequest={handleShouldStartLoad}
      />
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
