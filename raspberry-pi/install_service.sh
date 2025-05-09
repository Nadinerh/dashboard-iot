sudo tee /etc/systemd/system/iot-sender.service << EOF
[Unit]
Description=IoT Data Sender Service
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/moncompteiot/secure_iot/send_data.py
WorkingDirectory=/home/moncompteiot/secure_iot
User=moncompteiot
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable iot-sender
sudo systemctl start iot-sender
