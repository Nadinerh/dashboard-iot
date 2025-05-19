import subprocess
import time
from collections import Counter
import sys
import platform

PORT = "5000"
THRESHOLD = 100 
SCAN_INTERVAL = 10  

def get_active_ips(port):
    try:
        if platform.system() == 'Windows':
            # Use netstat command which is more reliable
            cmd = f'netstat -n | findstr :{port}'
            result = subprocess.check_output(cmd, shell=True).decode('utf-8')
            
            ips = []
            for line in result.splitlines():
                parts = line.strip().split()
                if len(parts) >= 2:
                    # Format: Proto  Local Address   Foreign Address   State
                    foreign_addr = parts[2].split(':')[0]
                    if foreign_addr not in ['0.0.0.0', '*', '']:
                        ips.append(foreign_addr)
            
            print(f"Connexions actives détectées: {len(ips)}")
            if len(ips) > 0:
                print("Adresses détectées:", ips)
            return Counter(ips)
        else:
            result = subprocess.check_output(f"netstat -ntu | grep :{port}", shell=True).decode()
            ips = [line.split()[4].split(":")[0] for line in result.split('\n') if len(line.split()) >= 5]
            print(f"Connexions actives détectées: {len(ips)}")
            return Counter(ips)
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de la récupération des IPs: {e}", file=sys.stderr)
        return Counter()

def block_ip(ip):
    try:
        if platform.system() == 'Windows':
            # Simplified firewall rule creation
            cmd = f'netsh advfirewall firewall add rule name="Block_{ip}" dir=in action=block remoteip={ip}'
            subprocess.run(cmd, shell=True, check=True)
            print(f"IP {ip} bloquée avec succès")
        else:
            subprocess.run(['sudo', 'iptables', '-A', 'INPUT', '-s', ip, '-j', 'DROP'], check=True)
            print(f"IP {ip} bloquée avec succès")
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors du blocage de l'IP {ip}: {e}", file=sys.stderr)
        print("Commande: ", cmd)
        if platform.system() == 'Windows':
            print("Note: Assurez-vous d'exécuter PowerShell en tant qu'administrateur")

def main():
    # Check if running with admin privileges using a simpler command
    if platform.system() == 'Windows':
        try:
            subprocess.check_call('net session >nul 2>&1', shell=True)
        except subprocess.CalledProcessError:
            print("ERREUR: Droits administrateur requis!")
            print("Veuillez exécuter en tant qu'administrateur")
            sys.exit(1)

    print(f"Démarrage de la surveillance TCP sur le port {PORT}")
    print(f"Configuration: Seuil={THRESHOLD} connexions, Interval={SCAN_INTERVAL}s")
    blocked_ips = set()
    
    while True:
        try:
            print("\nAnalyse des connexions en cours...")
            ip_counts = get_active_ips(PORT)
            
            # Afficher les statistiques
            if ip_counts:
                print(f"Top 5 IPs par nombre de connexions:")
                for ip, count in sorted(ip_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
                    status = "BLOQUÉE" if ip in blocked_ips else "OK"
                    print(f"   {ip}: {count} connexions {status}")
            
            for ip, count in ip_counts.items():
                if count > THRESHOLD and ip not in ['127.0.0.1', '::1']:
                    if ip not in blocked_ips:
                        print(f"ALERTE: {ip} a dépassé le seuil avec {count} connexions")
                        block_ip(ip)
                        blocked_ips.add(ip)
            
            time.sleep(SCAN_INTERVAL)
            
        except Exception as e:
            print(f"Erreur: {e}", file=sys.stderr)
            time.sleep(SCAN_INTERVAL)

if __name__ == "__main__":
    main()
