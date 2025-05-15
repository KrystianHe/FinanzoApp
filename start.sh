#!/bin/sh

# This script ensures the application can start in Railway's environment
exec java -Xmx256m -Xms128m -XX:MaxMetaspaceSize=128m -jar /app/app.jar 