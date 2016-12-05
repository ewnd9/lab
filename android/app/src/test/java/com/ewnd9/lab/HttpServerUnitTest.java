package com.ewnd9.lab;

import org.junit.Test;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

/**
 * https://docs.oracle.com/javase/7/docs/api/java/net/ServerSocket.html
 * https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html
 */
public class HttpServerUnitTest {
    @Test
    public void addition_isCorrect() throws Exception {
        ServerSocket ss = new ServerSocket(3000);
        Socket socket = ss.accept();

        InputStreamReader isr = new InputStreamReader(socket.getInputStream());
        BufferedReader reader = new BufferedReader(isr);
        String line = reader.readLine();

        String method = "";
        String path = "";
        Map<String, String> headers = new HashMap<>();

        for (int i = 0 ; !line.isEmpty() ; i++) {
            if (i == 0) {
                // Request-Line = Method SP Request-URI SP HTTP-Version CRLF
                String[] data = line.split("\\s");
                method = data[0];
                path = data[1];
            } else {
                int delimiterIndex = line.indexOf(":");
                String key = line.substring(0, delimiterIndex);
                String value = line.substring(delimiterIndex + 2);
                headers.put(key, value);
            }

            System.out.println(line);
            line = reader.readLine();
        }

        System.out.println("method: " + method);
        System.out.println("path: " + path);
        System.out.println(headers.toString());

        String httpResponse = "HTTP/1.1 200 OK\r\n\r\n" + "today";
        socket.getOutputStream().write(httpResponse.getBytes("UTF-8"));
    }
}
