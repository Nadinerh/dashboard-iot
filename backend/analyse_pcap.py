from scapy.all import rdpcap, TCP, IP
import requests
import time

# Charger le fichier .pcap
fichier_pcap = "attaque_ddos.pcap"
paquets = rdpcap(fichier_pcap)

# Initialisation
frame_lengths = []
src_ports = []
dst_ports = []
ttls = []
ip_flags = []
tcp_flags = []
protocol = 6  # TCP
timestamps = []

for pkt in paquets:
    if IP in pkt and TCP in pkt:
        frame_lengths.append(len(pkt))
        src_ports.append(pkt[TCP].sport)
        dst_ports.append(pkt[TCP].dport)
        ttls.append(pkt[IP].ttl)
        ip_flags.append(pkt[IP].flags)
        tcp_flags.append(pkt[TCP].flags)
        timestamps.append(pkt.time)

if len(paquets) < 2:
    print("❌ Trop peu de paquets pour extraire des statistiques.")
    exit()

# Calcul des features
frame_length_avg = sum(frame_lengths) / len(frame_lengths)
payload_size = frame_length_avg - 40  # Supposons 20 bytes IP + 20 TCP
src_port = src_ports[0]
dst_port = dst_ports[0]
ttl = ttls[0]
ip_flag = int(ip_flags[0])
tcp_flag = int(tcp_flags[0])
duration = timestamps[-1] - timestamps[0]
packet_rate = len(paquets) / duration
byte_rate = sum(frame_lengths) / duration

# Création du dictionnaire de données
donnee_extraite = {
    "frame_length": round(frame_length_avg, 2),
    "payload_size": round(payload_size, 2),
    "src_port": src_port,
    "dst_port": dst_port,
    "ttl": ttl,
    "ip_flags": ip_flag,
    "tcp_flags": tcp_flag,
    "protocol": protocol,
    "duration": round(duration, 4),
    "packet_rate": int(packet_rate),
    "byte_rate": int(byte_rate)
}

print("📦 Donnée extraite :")
print(donnee_extraite)

# Envoi vers API IA
API_URL = "http://192.168.137.1:5000/api/analyse"
try:
    res = requests.post(API_URL, json=donnee_extraite)
    print("🤖 Réponse modèle IA :", res.json())
except Exception as e:
    print("❌ Erreur requête API :", e)
