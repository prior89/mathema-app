# =============================================================
#  Mathēma math-helper — Python FastAPI + LangGraph service.
#
#  Build context = repo root (so we can COPY both services/math-helper/
#  and services/data/). Karvy's curriculum_data.py uses APP_DIR-relative
#  paths to find services/data/ncert/*.json, so we keep the on-disk
#  layout identical to the repo and just change WORKDIR.
# =============================================================

FROM python:3.14-slim

WORKDIR /app

# curl for HEALTHCHECK; rm apt cache to keep image small
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

# Python deps cached separately from app code so requirements changes
# don't invalidate the COPY layer below.
COPY services/math-helper/app/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# App + curriculum data — paths preserved so curriculum_data.py finds
# services/data/ncert/*.json relative to its own __file__ location.
COPY services/math-helper/ ./services/math-helper/
COPY services/data/         ./services/data/

# uvicorn entrypoint and load_dotenv() both resolve relative to cwd.
# WORKDIR matches how `npm run dev:math-helper` runs locally so behaviour
# is identical between dev and prod.
WORKDIR /app/services/math-helper/app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
