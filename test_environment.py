import subprocess
import sys

def check_python_version():
    print(f"Python version: {sys.version}")

def check_java_version():
    try:
        # Using capture_output=True is equivalent to setting stdout=PIPE, stderr=PIPE
        result = subprocess.run(['java', '-version'], capture_output=True)
        # Java outputs version to stderr by default
        output = result.stderr.decode('utf-8')
        print(f"Java version info:\n{output}")
    except Exception as e:
        print(f"Error checking Java version: {e}")

if __name__ == "__main__":
    print("=== Environment Check ===")
    check_python_version()
    check_java_version()