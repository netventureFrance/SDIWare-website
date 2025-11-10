#!/usr/bin/env python3
"""
Upload SDIWare-Installer.exe to Cloudflare R2

Prerequisites:
    pip install boto3

Configuration:
    Set environment variables or edit config below:
    - R2_ENDPOINT
    - R2_ACCESS_KEY_ID
    - R2_SECRET_ACCESS_KEY

Usage:
    python upload-to-r2.py /path/to/SDIWare-Installer.exe
"""

import os
import sys
import boto3
from botocore.exceptions import ClientError
from pathlib import Path

# Configuration
R2_ENDPOINT = os.getenv('R2_ENDPOINT', 'https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com')
R2_ACCESS_KEY_ID = os.getenv('R2_ACCESS_KEY_ID', '')
R2_SECRET_ACCESS_KEY = os.getenv('R2_SECRET_ACCESS_KEY', '')
R2_BUCKET = 'sdiware'
R2_FILE_KEY = 'SDIWare-Installer.exe'

# Colors for terminal output
class Colors:
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color

def print_colored(text, color):
    """Print colored text to terminal"""
    print(f"{color}{text}{Colors.NC}")

def format_bytes(bytes):
    """Format bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024.0:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024.0
    return f"{bytes:.2f} TB"

def check_configuration():
    """Check if R2 credentials are configured"""
    if not R2_ACCESS_KEY_ID or not R2_SECRET_ACCESS_KEY:
        print_colored("Error: R2 credentials not configured", Colors.RED)
        print("\nPlease set environment variables:")
        print("  export R2_ENDPOINT='https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com'")
        print("  export R2_ACCESS_KEY_ID='your_access_key'")
        print("  export R2_SECRET_ACCESS_KEY='your_secret_key'")
        print("\nOr edit the configuration in this script.")
        return False

    if 'YOUR_ACCOUNT_ID' in R2_ENDPOINT:
        print_colored("Warning: R2_ENDPOINT contains placeholder", Colors.YELLOW)
        print("Please update R2_ENDPOINT with your actual Cloudflare Account ID")
        return False

    return True

def upload_file(file_path):
    """Upload file to R2"""
    # Validate file exists
    if not os.path.exists(file_path):
        print_colored(f"Error: File not found: {file_path}", Colors.RED)
        return False

    # Get file info
    file_size = os.path.getsize(file_path)
    file_name = os.path.basename(file_path)

    print_colored("Preparing to upload to Cloudflare R2...", Colors.YELLOW)
    print(f"File: {file_path} ({format_bytes(file_size)})")
    print(f"Bucket: {R2_BUCKET}")
    print(f"Key: {R2_FILE_KEY}")
    print()

    # Create S3 client (R2 is S3-compatible)
    try:
        s3_client = boto3.client(
            's3',
            endpoint_url=R2_ENDPOINT,
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            region_name='auto'
        )

        print_colored("Uploading...", Colors.YELLOW)

        # Upload file with progress
        s3_client.upload_file(
            file_path,
            R2_BUCKET,
            R2_FILE_KEY,
            Callback=ProgressPercentage(file_path)
        )

        print()
        print_colored("✓ Upload successful!", Colors.GREEN)
        print(f"The installer is now available at: {R2_BUCKET}/{R2_FILE_KEY}")
        return True

    except ClientError as e:
        print()
        print_colored(f"✗ Upload failed: {e}", Colors.RED)
        return False
    except Exception as e:
        print()
        print_colored(f"✗ Error: {e}", Colors.RED)
        return False

class ProgressPercentage:
    """Progress callback for upload"""
    def __init__(self, filename):
        self._filename = filename
        self._size = float(os.path.getsize(filename))
        self._seen_so_far = 0
        self._last_percent = 0

    def __call__(self, bytes_amount):
        self._seen_so_far += bytes_amount
        percentage = (self._seen_so_far / self._size) * 100

        # Only print every 10%
        if int(percentage / 10) > self._last_percent:
            self._last_percent = int(percentage / 10)
            sys.stdout.write(
                f"\r  Progress: {format_bytes(self._seen_so_far)} / {format_bytes(self._size)} ({percentage:.1f}%)"
            )
            sys.stdout.flush()

def main():
    """Main function"""
    # Check for file argument
    if len(sys.argv) < 2:
        print_colored("Error: No file path provided", Colors.RED)
        print(f"Usage: {sys.argv[0]} /path/to/SDIWare-Installer.exe")
        sys.exit(1)

    file_path = sys.argv[1]

    # Check configuration
    if not check_configuration():
        sys.exit(1)

    # Upload file
    success = upload_file(file_path)

    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
