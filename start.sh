#!/bin/sh

# This script ensures the application can start in Railway's environment
java -Xmx256m -Xms128m -XX:MaxMetaspaceSize=128m -jar /app/app.jar 