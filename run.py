import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from server import app
    print(f'App loaded successfully', flush=True)
except Exception as e:
    print(f'Failed to import app: {e}', flush=True)
    print(f'sys.path: {sys.path}', flush=True)
    print(f'cwd: {os.getcwd()}', flush=True)
    print(f'dir contents: {os.listdir(".")}', flush=True)
    raise

import uvicorn

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f'Starting uvicorn on port {port}', flush=True)
    uvicorn.run(
        app,
        host='0.0.0.0',
        port=port,
    )
