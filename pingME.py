import socket
import subprocess
from concurrent.futures import ThreadPoolExecutor

def check_nodejs_server(ip, port):
    try:
        # Create a socket object
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)  # Set a timeout value of 1 second

        # Attempt to connect to the IP address and port
        result = sock.connect_ex((ip, port))

        # Check if the connection was successful
        if result == 0:
            # Connection succeeded, now check if it's a Node.js server
            sock.sendall(b'GET / HTTP/1.1\r\nHost: example.com\r\n\r\n')
            response = sock.recv(1024).decode()

            if 'X-Powered-By: Node.js' in response:
                print(f"Node.js server found at {ip}:{port}")

        sock.close()

    except socket.error:
        pass

def scan_ip(ip):
    # Define the port to scan
    port = 3000

    # Perform node.js server check for the IP
    check_nodejs_server(ip, port)

def scan_ip_range(start_ip, end_ip):
    # Convert the IP addresses to integers for easier iteration
    start_ip = int(''.join(f"{int(o):03}" for o in start_ip.split('.')))
    end_ip = int(''.join(f"{int(o):03}" for o in end_ip.split('.')))

    # Create a thread pool executor with a maximum of 4 threads
    with ThreadPoolExecutor(max_workers=4) as executor:
        # Iterate over the IP range and submit scan_ip function to the executor
        for ip in range(start_ip, end_ip + 1):
            # Convert the integer back to IP format
            ip_address = '.'.join(str((ip // 10 ** i) % 10 ** 3) for i in (6, 3, 0))
            executor.submit(scan_ip, ip_address)

# Define the IP range to scan
start_ip = '192.168.2.1'
end_ip = '192.168.2.255'

# Scan the IP range for Node.js servers
scan_ip_range(start_ip, end_ip)
