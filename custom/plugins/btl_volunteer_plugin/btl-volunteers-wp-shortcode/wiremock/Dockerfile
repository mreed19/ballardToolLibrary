FROM openjdk:alpine

RUN wget https://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-jre8-standalone/2.27.2/wiremock-jre8-standalone-2.27.2.jar && mv wiremock-jre8-standalone-2.27.2.jar /bin/wiremock.jar

WORKDIR /wiremock
ENTRYPOINT ["java", "-jar", "/bin/wiremock.jar", "--local-response-templating"]
EXPOSE 8080
