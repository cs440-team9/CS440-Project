#!/bin/bash

# Shell script to automate adding a letter to search queries

for i in {a..z}
  do
    # printf $i
    printf "================= Add letter $i to query\n"
    node /home/khoa/Classes/440cs/CS440-Project/integration/open-library.js "$char"
    printf "================= Done with $i\n\n"

  done
