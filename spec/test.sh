#!/bin/bash

cd ..

TEST_TIMEZONES=('Canada/Pacific' 'Pacific/Fiji' 'Pacific/Honolulu' 'Asia/Shanghai' 'Australia/Sydney' 'America/Havana' 'America/New_York' 
	'America/Los_Angeles' 'Asia/Dubai' 'Europe/Moscow' 'Europe/London' 'Europe/Budapest')

for timeZone in "${TEST_TIMEZONES[@]}"
do
   echo $timeZone | sudo tee /etc/timezone
   dpkg-reconfigure --frontend noninteractive tzdata
   ntpdate ntp.ubuntu.com

   jasmine
done

