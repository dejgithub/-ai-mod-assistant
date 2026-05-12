#!/bin/bash
export PYTHONPATH="${PYTHONPATH}:$(dirname "$0")"
uvicorn server:app --host 0.0.0.0 --port "$PORT"
