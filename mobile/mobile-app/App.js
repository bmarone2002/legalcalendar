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
import { ClerkProvider, useAuth, useSSO } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

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
          if (typeof launchUrl === "string" && launchUrl.length > 0) {
            setCurrentUrl(launchUrl);
          }
        }
      );
    } catch (error) {
      console.warn("OneSignal non disponibile in questa build:", error);
    }
    return () => {
      if (typeof removeClickListener === "function") removeClickListener();
    };
  }, [canUseOneSignal, oneSignalAppId]);

  if (!canUseClerk) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
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
      <MobileShell webBaseUrl={webBaseUrl} currentUrl={currentUrl} setCurrentUrl={setCurrentUrl} />
    </ClerkProvider>
  );
}

function MobileShell({ webBaseUrl, currentUrl, setCurrentUrl }) {
  const webViewRef = useRef(null);
  const { getToken } = useAuth();
  const { startSSOFlow } = useSSO();
  const [oauthInFlight, setOauthInFlight] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") {
      WebBrowser.warmUpAsync();
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);

  const bridgeSessionToWebView = useCallback(async () => {
    for (let i = 0; i < 30; i += 1) {
      const token = await getToken({ skipCache: true });
      if (token) {
        const exchangeUrl = `${webBaseUrl}/api/mobile/exchange`;
        const homeUrl = `${webBaseUrl}/`;
        const signInUrl = `${webBaseUrl}/sign-in`;
        const bodyLiteral = JSON.stringify({ token });

        const script = `
          (function() {
            fetch(${JSON.stringify(exchangeUrl)}, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: ${JSON.stringify(bodyLiteral)},
              credentials: "include"
            })
              .then(function (res) {
                if (res.ok) {
                  window.location.href = ${JSON.stringify(homeUrl)};
                } else {
                  window.location.href = ${JSON.stringify(signInUrl)};
                }
              })
              .catch(function () {
                window.location.href = ${JSON.stringify(signInUrl)};
              });
          })();
          true;
        `;

        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(script);
        } else {
          // WebView not ready yet — retry on next iteration
          await new Promise((resolve) => setTimeout(resolve, 200));
          continue;
        }
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return false;
  }, [getToken, setCurrentUrl, webBaseUrl]);

  useEffect(() => {
    const callbackPrefixes = [
      "legalcalendar://oauth-native-callback",
      "legalcalendar:///oauth-native-callback",
    ];

    const maybeBridgeFromDeepLink = async (url) => {
      if (!url || !callbackPrefixes.some((prefix) => url.startsWith(prefix))) {
        return;
      }
      const bridged = await bridgeSessionToWebView();
      if (!bridged) {
        setCurrentUrl(`${webBaseUrl}/sign-in`);
      }
    };

    const sub = Linking.addEventListener("url", (event) => {
      void maybeBridgeFromDeepLink(event?.url);
    });

    void Linking.getInitialURL().then((url) => {
      void maybeBridgeFromDeepLink(url);
    });

    return () => {
      sub.remove();
    };
  }, [bridgeSessionToWebView, setCurrentUrl, webBaseUrl]);

  const handleGoogleOAuth = useCallback(async () => {
    if (oauthInFlight) return;
    setOauthInFlight(true);
    try {
      const redirectUrl = makeRedirectUri({
        scheme: "legalcalendar",
        path: "oauth-native-callback",
        isTripleSlashed: true,
      });
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
      const bridged = await bridgeSessionToWebView();
      if (!bridged) {
        setCurrentUrl(`${webBaseUrl}/sign-in`);
      }
    } catch (err) {
      console.warn("Google OAuth error:", err);
    } finally {
      setOauthInFlight(false);
    }
  }, [oauthInFlight, startSSOFlow, bridgeSessionToWebView]);

  const isGoogleOAuthUrl = useCallback((url) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("accounts.google.com")) return true;
      return false;
    } catch {
      return false;
    }
  }, []);

  const injectedGoogleBridge = `
    (function () {
      if (window.__legalCalendarGoogleBridgeInstalled) return true;
      window.__legalCalendarGoogleBridgeInstalled = true;

      function shouldInterceptGoogle(el) {
        if (!el) return false;
        var text = ((el.innerText || el.textContent || "") + "").toLowerCase();
        var href = ((el.getAttribute && el.getAttribute("href")) || "").toLowerCase();
        return text.indexOf("google") !== -1 || href.indexOf("google") !== -1;
      }

      document.addEventListener("click", function (event) {
        var node = event.target;
        var clickable = node && node.closest
          ? node.closest('button, a, [role="button"], [data-testid], [aria-label]')
          : null;

        if (!shouldInterceptGoogle(clickable)) return;

        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage("LC_GOOGLE_SSO");
        }

        event.preventDefault();
        event.stopPropagation();
      }, true);

      return true;
    })();
  `;

  const handleWebViewMessage = useCallback(
    (event) => {
      const message = event?.nativeEvent?.data;
      if (message === "LC_GOOGLE_SSO") {
        void handleGoogleOAuth();
      }
    },
    [handleGoogleOAuth]
  );

  const handleShouldStartLoad = useCallback(
    (request) => {
      const nextUrl = request?.url ?? "";
      const isHttp =
        nextUrl.startsWith("http://") ||
        nextUrl.startsWith("https://") ||
        nextUrl.startsWith("about:blank");
      if (!isHttp) return false;
      if (isGoogleOAuthUrl(nextUrl)) {
        handleGoogleOAuth();
        return false;
      }
      return true;
    },
    [handleGoogleOAuth, isGoogleOAuthUrl]
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
        injectedJavaScriptBeforeContentLoaded={injectedGoogleBridge}
        onMessage={handleWebViewMessage}
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
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
