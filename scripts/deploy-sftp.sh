#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/deploy-sftp.sh [--env-file FILE] [--dry-run] [--local-dir dist] [--remote-dir /path] [--host HOST] [--port 22] [--user USER]

Environment variables (optional):
  DEPLOY_ENV_FILE  Path to env file (default: scripts/.deploy-sftp.env)
  SFTP_HOST        SFTP server hostname
  SFTP_PORT        SFTP server port (default: 22)
  SFTP_USER        SFTP username
  REMOTE_PATH      Remote directory where dist contents should be uploaded
  DRY_RUN          1 = show actions only, 0 = upload files
  SFTP_LOCAL_DIR   Local directory to upload (default: dist)

Notes:
  - Password is always requested interactively.
  - Do not put the password into the env file.
  - Upload uses mirror with delete to keep remote in sync.
EOF
}

escape_lftp() {
  local value="${1-}"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\n'/}"
  printf '%s' "$value"
}

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
ENV_FILE="${DEPLOY_ENV_FILE:-${SCRIPT_DIR}/.deploy-sftp.env}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

DRY_RUN="${DRY_RUN-0}"
SFTP_HOST="${SFTP_HOST-}"
SFTP_PORT="${SFTP_PORT-22}"
SFTP_USER="${SFTP_USER-}"
REMOTE_PATH="${REMOTE_PATH-${SFTP_REMOTE_DIR-}}"
SFTP_LOCAL_DIR="${SFTP_LOCAL_DIR-dist}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file)
      ENV_FILE="${2-}"
      if [[ ! -f "$ENV_FILE" ]]; then
        echo "Error: env file '$ENV_FILE' not found." >&2
        exit 1
      fi
      set -a
      # shellcheck disable=SC1090
      . "$ENV_FILE"
      set +a
      DRY_RUN="${DRY_RUN-0}"
      SFTP_HOST="${SFTP_HOST-}"
      SFTP_PORT="${SFTP_PORT-22}"
      SFTP_USER="${SFTP_USER-}"
      REMOTE_PATH="${REMOTE_PATH-${SFTP_REMOTE_DIR-}}"
      SFTP_LOCAL_DIR="${SFTP_LOCAL_DIR-dist}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN="1"
      shift
      ;;
    --host)
      SFTP_HOST="${2-}"
      shift 2
      ;;
    --port)
      SFTP_PORT="${2-}"
      shift 2
      ;;
    --user)
      SFTP_USER="${2-}"
      shift 2
      ;;
    --remote-dir)
      REMOTE_PATH="${2-}"
      shift 2
      ;;
    --local-dir)
      SFTP_LOCAL_DIR="${2-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

case "${DRY_RUN}" in
  1|true|TRUE|yes|YES) DRY_RUN="1" ;;
  0|false|FALSE|no|NO|"") DRY_RUN="0" ;;
  *)
    echo "Error: DRY_RUN must be 0/1 (or true/false)." >&2
    exit 1
    ;;
esac

if ! command -v lftp >/dev/null 2>&1; then
  echo "Error: lftp is not installed." >&2
  exit 1
fi

if [[ ! -d "$SFTP_LOCAL_DIR" ]]; then
  echo "Error: local directory '$SFTP_LOCAL_DIR' does not exist." >&2
  echo "Run 'npm run build' first." >&2
  exit 1
fi

if [[ -z "$SFTP_HOST" ]]; then
  read -r -p "SFTP host: " SFTP_HOST
fi
if [[ -z "$SFTP_USER" ]]; then
  read -r -p "SFTP user: " SFTP_USER
fi
if [[ -z "$REMOTE_PATH" ]]; then
  read -r -p "Remote target dir (example: /path/to/webroot/melanie): " SFTP_REMOTE_DIR
  REMOTE_PATH="$SFTP_REMOTE_DIR"
fi

if [[ -z "$SFTP_HOST" || -z "$SFTP_USER" || -z "$REMOTE_PATH" ]]; then
  echo "Error: host, user, and remote dir are required." >&2
  exit 1
fi

if [[ -n "${SFTP_PASSWORD-}" ]]; then
  echo "Warning: SFTP_PASSWORD from env is ignored. Password is requested interactively." >&2
fi

read -r -s -p "SFTP password: " SFTP_PASSWORD
echo ""

LOCAL_DIR_ESC="$(escape_lftp "$SFTP_LOCAL_DIR")"
REMOTE_DIR_ESC="$(escape_lftp "$REMOTE_PATH")"
HOST_ESC="$(escape_lftp "$SFTP_HOST")"
USER_ESC="$(escape_lftp "$SFTP_USER")"
PASS_ESC="$(escape_lftp "$SFTP_PASSWORD")"
PORT_ESC="$(escape_lftp "$SFTP_PORT")"

MIRROR_CMD='mirror -R --delete --verbose --parallel=2'
if [[ "$DRY_RUN" == "1" ]]; then
  MIRROR_CMD+=' --dry-run'
fi
MIRROR_CMD+=" \"${LOCAL_DIR_ESC}/\" \"${REMOTE_DIR_ESC}\""

echo "Deploying '${SFTP_LOCAL_DIR}/' to '${SFTP_HOST}:${REMOTE_PATH}' ..."
if [[ "$DRY_RUN" == "1" ]]; then
  echo "Dry run enabled: no remote files will be changed."
fi

lftp -f /dev/stdin <<EOF
set cmd:fail-exit true
set net:max-retries 2
set net:timeout 20
set xfer:clobber true
open -p "${PORT_ESC}" "sftp://${HOST_ESC}"
user "${USER_ESC}" "${PASS_ESC}"
${MIRROR_CMD}
bye
EOF

unset SFTP_PASSWORD PASS_ESC
echo "Done."
