#!/bin/dash
export LC_CTYPE=en_US.utf8
ulimit -v 50000
ulimit -t 3
exec shellcheck -f json -e 2148 -
