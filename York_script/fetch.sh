#!/bin/bash

limit=(6644 6651 2022 6106 6658 6690 5913 3676 6618 614 5956 268)
query=(O P Q R S T U V W X Y Z)
sublimit=200
current=1

for i in {0..11}
do
    sublimit=200
    current=1

    while [ ${limit[$i]} -ne $current ]
    do

        echo "Running:" ${query[$i]} $sublimit "out of" ${limit[$i]}
        #echo node Query.js E $current $sublimit $limit
        node Query.js ${query[$i]} $current $sublimit ${limit[$i]}

        current=$sublimit
        sublimit=$((sublimit+=200))

        if [ $sublimit -gt ${limit[$i]} ]
        then
            sublimit=$((sublimit=${limit[$i]}))
        fi

    done


done
