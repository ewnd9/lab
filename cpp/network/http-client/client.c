// forked from https://www.thegeekstuff.com/2011/12/c-socket-programming

#include <arpa/inet.h>
#include <errno.h>
#include <netdb.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
  int sockfd = 0, n = 0;
  char recvBuff[1024];
  struct sockaddr_in serv_addr;

  memset(recvBuff, '0', sizeof(recvBuff));

  if ((sockfd = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
    printf("\n Error : Could not create socket \n");
    return 1;
  }

  memset(&serv_addr, '0', sizeof(serv_addr));

  serv_addr.sin_family = AF_INET;
  serv_addr.sin_port = htons(80);

  char *hostname = "picsum.photos";
  struct hostent *hserver = gethostbyname(hostname);
  memcpy(&serv_addr.sin_addr, hserver->h_addr, hserver->h_length);

  if (connect(sockfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
    printf("\n Error : Connect Failed \n");
    return 1;
  }

  char headers[255];
  // to use HTTP/1.1 we need to parse content-length header
  // (https://stackoverflow.com/a/12467823/2544668)
  strcpy(headers, "GET /200/300 HTTP/1.0\r\nHost: ");
  strcat(headers, hostname);
  strcat(headers, "\r\n\r\n");

  send(sockfd, headers, strlen(headers), 0);

  int parsing_headers = 1;
  FILE *output_file = fopen("img.jpeg", "w");

  while ((n = read(sockfd, recvBuff, sizeof(recvBuff) - 1)) > 0) {
    recvBuff[n] = 0;

    if (parsing_headers == 1) {
      char *res_headers_end = strstr(recvBuff, "\r\n\r\n"); // @TODO improve

      if (res_headers_end) {
        parsing_headers = 0;
        char *beginning = res_headers_end + strlen("\r\n\r\n");
        int beginning_position = beginning - recvBuff;
        fwrite(beginning, n - beginning_position, 1, output_file);
      } else {
        fwrite(recvBuff, n, 1, output_file);
      }

      int end = res_headers_end ? res_headers_end - recvBuff : strlen(recvBuff);
      for (int i = 0; i < end; i++) {
        printf("%c", recvBuff[i]);
      }
    } else {
      fwrite(recvBuff, n, 1, output_file);
    }
  }

  if (n < 0) {
    printf("\n Read error \n");
  }

  fclose(output_file);

  return 0;
}
