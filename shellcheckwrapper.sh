#!/bin/bash
export LC_CTYPE=en_US.utf8
ulimit -v 50000
ulimit -t 3
while read -r line; do
	if [[ $line = "//pathtoshellcheckbinary"* ]]; then
		scbin=${line##*=}
		break
	fi
done < "$(dirname "$0")/local-config.php"
exec "$scbin" -f json -e 2148 -
