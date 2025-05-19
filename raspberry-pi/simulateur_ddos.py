import requests
import time

API_URL = "http://192.168.137.1:5000/api/analyse"  # IP backend côté Windows

donnee_ddos = {
    "src_ip": 19,
    "src_port": 39180,
    "dst_ip": 82,
    "dst_port": 8080,
    "proto": 1,
    "service": 0,
    "duration": 1.0,
    "src_bytes": 1500000,
    "dst_bytes": 800000,
    "conn_state": 9,
    "missed_bytes": 0,
    "src_pkts": 4015,
    "src_ip_bytes": 1545859,
    "dst_pkts": 1923,
    "dst_ip_bytes": 714288,
    "dns_query": 1,
    "dns_qclass": 0,
    "dns_qtype": 0,
    "dns_rcode": 0,
    "dns_AA": 0,
    "dns_RD": 0,
    "dns_RA": 0,
    "dns_rejected": 0,
    "ssl_version": 0,
    "ssl_cipher": 0,
    "ssl_resumed": 0,
    "ssl_established": 0,
    "ssl_subject": 0,
    "ssl_issuer": 0,
    "http_trans_depth": 0,
    "http_method": 0,
    "http_uri": 0,
    "http_version": 0,
    "http_request_body_len": 0,
    "http_response_body_len": 0,
    "http_status_code": 0,
    "http_user_agent": 0,
    "http_orig_mime_types": 0,
    "http_resp_mime_types": 0,
    "weird_name": 0,
    "weird_addl": 0,
    "weird_notice": 0,
    "bytes_ratio": 1.7,
    "total_pkts": 5938
}

print("🚀 Début de la simulation d'une attaque DDoS...")

for i in range(20):  # Envoie 20 fois pour simuler le flood
    try:
        res = requests.post(API_URL, json=donnee_ddos, timeout=5)
        print(f"[{i+1}] ✅ Réponse IA :", res.json())
    except Exception as e:
        print(f"[{i+1}] ❌ Erreur :", e)
    time.sleep(0.2)  # petit délai entre chaque requête (200 ms)


