#! /bin/bash
source ${HOME}/.bashrc

cd /home/trizotto/discord-bot
# export NODE_ENV=development
npm run start


sudo systemctl stop auto-start.service
sudo systemctl daemon-reload
sudo systemctl start auto-start.service
sudo systemctl status auto-start.service