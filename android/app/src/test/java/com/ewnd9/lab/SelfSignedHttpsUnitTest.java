package com.ewnd9.lab;

import org.junit.Test;
import org.spongycastle.openssl.PEMKeyPair;
import org.spongycastle.openssl.PEMParser;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.spec.PKCS8EncodedKeySpec;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;

import static org.junit.Assert.*;

/**
 * https://developer.android.com/reference/java/net/HttpURLConnection.html
 * https://developer.android.com/training/articles/security-ssl.html
 * `build.gradle` also contains:
 *     compile 'com.madgag.spongycastle:core:1.54.0.0'
 *     compile 'com.madgag.spongycastle:pkix:1.54.0.0'
 */
public class SelfSignedHttpsUnitTest {
    @Test
    public void addition_isCorrect() throws Exception {
        URL url = new URL("https://localhost:8080/");

        try {
            url.openConnection();
        } catch (Exception e) {
            assertEquals(e.getClass().getCanonicalName(), "javax.net.ssl.SSLHandshakeException");
        }

        SSLContext context = ServerHelpers.getContext(
            System.getenv("HOME") + "/lab/node/server/server-self-signed/cert/ca-crt.pem",
            System.getenv("HOME") + "/lab/node/server/server-self-signed/cert/client1-crt.pem",
            System.getenv("HOME") + "/lab/node/server/server-self-signed/cert/client1-key.pem"
        );

        HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();
        urlConnection.setSSLSocketFactory(context.getSocketFactory());

        String body;

        try {
            InputStream in = new BufferedInputStream(urlConnection.getInputStream());
            body = ServerHelpers.readStream(in);
        } finally {
            urlConnection.disconnect();
        }

        assertEquals(body, "{\"url\":\"/\"}");
    }
}
