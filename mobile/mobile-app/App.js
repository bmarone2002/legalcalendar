import { useCallback, useEffect, useRef, useState } from "react";
import {
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  const { getToken } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const oauthPending = useRef(false);
  const OAUTH_CALLBACK_PREFIXES = useRef([
    "legalcalendar://oauth-native-callback",
    "legalcalendar:///oauth-native-callback",
  ]);

  const isHttpLikeUrl = useCallback((url) => {
    return (
      typeof url === "string" &&
      (url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("about:blank"))
    );
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") {
      WebBrowser.warmUpAsync();
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);

  const bridgeSessionToWebView = useCallback(async () => {
    // Clerk can need a short moment after setActive before getToken is ready.
    // Retry briefly to avoid falling back to the unauthenticated web sign-in.
    for (let i = 0; i < 8; i += 1) {
      const token = await getToken();
      if (token) {
        setCurrentUrl(
          `${webBaseUrl}/api/mobile/exchange?token=${encodeURIComponent(token)}`
        );
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return false;
  }, [getToken, setCurrentUrl, webBaseUrl]);

  useEffect(() => {
    let isMounted = true;

    const maybeBridgeFromDeepLink = async (url) => {
      if (
        !url ||
        !OAUTH_CALLBACK_PREFIXES.current.some((prefix) =>
          url.startsWith(prefix)
        )
      ) {
        return;
      }
      // Always try bridging when app is opened via OAuth callback deep link.
      // This makes login robust even when startOAuthFlow doesn't immediately
      // return createdSessionId on some iOS redirect sequences.
      await bridgeSessionToWebView();
      if (isMounted) {
        oauthPending.current = false;
      }
    };

    const sub = Linking.addEventListener("url", (event) => {
      void maybeBridgeFromDeepLink(event?.url);
    });

    void Linking.getInitialURL().then((url) => {
      void maybeBridgeFromDeepLink(url);
    });

    return () => {
      isMounted = false;
      sub.remove();
    };
  }, [bridgeSessionToWebView]);

  const handleGoogleOAuth = useCallback(async () => {
    if (oauthPending.current) return;
    try {
      oauthPending.current = true;
      const redirectUrl = makeRedirectUri({
        scheme: "legalcalendar",
        path: "oauth-native-callback",
        isTripleSlashed: true,
      });
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        const bridged = await bridgeSessionToWebView();
        if (!bridged) {
          oauthPending.current = false;
          setCurrentUrl(`${webBaseUrl}/sign-in`);
          return;
        }
        oauthPending.current = false;
      } else {
        oauthPending.current = false;
      }
    } catch (err) {
      oauthPending.current = false;
      console.warn("Google OAuth error:", err);
    }
  }, [bridgeSessionToWebView, setCurrentUrl, startOAuthFlow, webBaseUrl]);

  const handleShouldStartLoad = useCallback(
    (request) => {
      const nextUrl = request?.url ?? "";

      // Never let WebView open app/deep/custom schemes.
      // Trying to load them as a webpage causes NSURLErrorDomain -1004 on iOS.
      if (!isHttpLikeUrl(nextUrl)) {
        return false;
      }

      if (nextUrl.includes("accounts.google.com")) {
        handleGoogleOAuth();
        return false;
      }
      return true;
    },
    [handleGoogleOAuth, isHttpLikeUrl]
  );

  const handleWebViewError = useCallback(
    (event) => {
      const failedUrl = event?.nativeEvent?.url ?? "";
      const code = event?.nativeEvent?.code;

      // If iOS still reports -1004 on an unexpected non-http callback URL,
      // force recovery to the web app home instead of the error page.
      if (code === -1004 || !isHttpLikeUrl(failedUrl)) {
        setCurrentUrl(webBaseUrl);
      }
    },
    [isHttpLikeUrl, setCurrentUrl, webBaseUrl]
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
        onError={handleWebViewError}
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
