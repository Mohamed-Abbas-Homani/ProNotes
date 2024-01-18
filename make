#!/bin/bash

echo "Thanks for using Pronotes!"
echo "Enter the name you want for the pronotes app"
read name
sudo cp pronotes /usr/bin/$name
echo "done"
