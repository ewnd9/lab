package com.ewnd9.lab;

import org.spongycastle.openssl.PEMKeyPair;
import org.spongycastle.openssl.PEMParser;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.spec.PKCS8EncodedKeySpec;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;

public class ServerHelpers {

    public static SSLContext getContext(String caPath, String certPath, String keyPath) throws Exception {
        Certificate caCert = getCert(caPath);
        Certificate clientCert = getCert(certPath);
        PrivateKey clientKey = getKey(keyPath);

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

        return context;
    }

    public static PrivateKey getKey(String path) throws Exception {
        BufferedReader r = new BufferedReader(new InputStreamReader(new FileInputStream(path)));
        PEMKeyPair clientKeyPair = (PEMKeyPair) new PEMParser(r).readObject();
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(clientKeyPair.getPrivateKeyInfo().getEncoded());

        KeyFactory kf = KeyFactory.getInstance("RSA");
        PrivateKey clientKey = kf.generatePrivate(spec);

        return clientKey;
    }

    public static Certificate getCert(String path) throws Exception {
        CertificateFactory cf = CertificateFactory.getInstance("X.509");

        InputStream caInput = new BufferedInputStream(new FileInputStream(path));
        Certificate ca = cf.generateCertificate(caInput);
        caInput.close();

        return ca;
    }

    public static String readStream(InputStream in) throws Exception {
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
