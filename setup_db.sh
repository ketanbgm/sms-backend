#!/bin/bash
docker cp sms.sql sms_mysql_1:/app;
docker exec -it -u root sms_mysql_1 sh -c "mysql < sms.sql";
