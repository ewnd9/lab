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

        Certificate caCert = getCert(System.getenv("HOME") + "/lab/node/server/server-self-signed/cert/ca-crt.pem");
        Certificate clientCert = getCert(System.getenv("HOME") + "/lab/node/server/server-self-signed/cert/client1-crt.pem");
        PrivateKey clientKey = getKey(System.getenv("HOME") + "/lab/node/server/server-self-signed/cert/client1-key.pem");

        KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
        trustStore.load(null, null);
        trustStore.setEntry("ca", new KeyStore.TrustedCertificateEntry(caCert), null);

        KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
        keyStore.load(null, null);
        keyStore.setCertificateEntry("client", clientCert);
        keyStore.setKeyEntry("key", clientKey, new char[0], new Certificate[] { clientCert });

        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(
                KeyManagerFactory.getDefaultAlgorithm());
        keyManagerFactory.init(keyStore, new char[0]);

        TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        trustManagerFactory.init(trustStore);

        SSLContext context = SSLContext.getInstance("TLSv1.2");
        context.init(keyManagerFactory.getKeyManagers(), trustManagerFactory.getTrustManagers(), null);

        HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();
        urlConnection.setSSLSocketFactory(context.getSocketFactory());

        String body;

        try {
            InputStream in = new BufferedInputStream(urlConnection.getInputStream());
            body = readStream(in);
        } finally {
            urlConnection.disconnect();
        }

        assertEquals(body, "{\"url\":\"/\"}");
    }

    PrivateKey getKey(String path) throws Exception {
        BufferedReader r = new BufferedReader(new InputStreamReader(new FileInputStream(path)));
        PEMKeyPair clientKeyPair = (PEMKeyPair) new PEMParser(r).readObject();
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(clientKeyPair.getPrivateKeyInfo().getEncoded());

        KeyFactory kf = KeyFactory.getInstance("RSA");
        PrivateKey clientKey = kf.generatePrivate(spec);

        return clientKey;
    }

    Certificate getCert(String path) throws Exception {
        CertificateFactory cf = CertificateFactory.getInstance("X.509");

        InputStream caInput = new BufferedInputStream(new FileInputStream(path));
        Certificate ca = cf.generateCertificate(caInput);
        caInput.close();

        return ca;
    }

    String readStream(InputStream in) throws Exception {
        StringBuilder sb = new StringBuilder();
        BufferedReader br = new BufferedReader(new InputStreamReader(in));
        String read;

        while((read = br.readLine()) != null) {
            sb.append(read);
        }

        br.close();
        return sb.toString();
    }
}
