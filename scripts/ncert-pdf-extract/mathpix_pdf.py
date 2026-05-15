#!/usr/bin/env python3
"""
MathPix PDF -> Mathpix Markdown (.mmd) converter.

LaTeX-preserving OCR for NCERT math PDFs. Output is .mmd (Mathpix Markdown):
inline math wrapped in \\( … \\), display math in \\[ … \\], headings and lists preserved.

After running this, point extract.py (with a small .mmd loader) at the .mmd files
to get LaTeX-clean NormalizedProblem JSON.

Setup (env vars):
    set MATHPIX_APP_ID=<your app id>
    set MATHPIX_APP_KEY=<your app key>
(Get them from mathpix.com -> Console -> API keys)

Run:
    python scripts/ncert-pdf-extract/mathpix_pdf.py \\
        --pdf "C:/Users/User/Downloads/Grade_8_Mathematics_Latest.pdf" \\
        --output scripts/ncert-pdf-extract/output/mmd

Pricing (verified 2026-05): pay-as-you-go ~$0.005/page after 1,000 free pages/mo.
6 NCERT PDFs ~= 2,099 pages -> ~$5.5-11 first run, subsequent runs free until quota.

Notes:
  - PDF upload is async: we POST then poll /v3/pdf/{id} until status=completed.
  - We force conversion_formats={mmd: True}. mathpix also offers docx/tex/html.
  - Failure modes: 401 (bad creds), 402 (out of quota), 413 (PDF too large > 512MB).
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests


API_BASE = "https://api.mathpix.com/v3"


def headers_for(app_id: str, app_key: str) -> dict:
    return {"app_id": app_id, "app_key": app_key}


def upload_pdf(pdf_path: Path, app_id: str, app_key: str) -> str:
    """Upload the PDF; return the pdf_id assigned by Mathpix."""
    options = {
        "conversion_formats": {"mmd": True},
        "math_inline_delimiters": ["\\(", "\\)"],
        "math_display_delimiters": ["\\[", "\\]"],
        "rm_spaces": True,
        "include_smiles": False,
    }
    with pdf_path.open("rb") as f:
        files = {"file": (pdf_path.name, f, "application/pdf")}
        data = {"options_json": json.dumps(options)}
        r = requests.post(
            f"{API_BASE}/pdf",
            headers=headers_for(app_id, app_key),
            files=files,
            data=data,
            timeout=120,
        )
    if r.status_code >= 400:
        raise RuntimeError(f"Upload failed: HTTP {r.status_code}: {r.text[:300]}")
    payload = r.json()
    pdf_id = payload.get("pdf_id")
    if not pdf_id:
        raise RuntimeError(f"No pdf_id in response: {payload}")
    return pdf_id


def poll_until_done(pdf_id: str, app_id: str, app_key: str, timeout_s: int = 1800) -> dict:
    """Poll the status endpoint until status=='completed' or timeout."""
    start = time.time()
    last_status = ""
    interval = 5
    while True:
        r = requests.get(
            f"{API_BASE}/pdf/{pdf_id}",
            headers=headers_for(app_id, app_key),
            timeout=30,
        )
        if r.status_code >= 400:
            raise RuntimeError(f"Status poll failed: HTTP {r.status_code}: {r.text[:300]}")
        payload = r.json()
        status = payload.get("status", "")
        pct = payload.get("percent_done", 0)
        if status != last_status or status == "split":
            print(f"  status={status} ({pct}%)  elapsed={int(time.time() - start)}s", flush=True)
            last_status = status
        if status == "completed":
            return payload
        if status in ("error", "loaded"):
            # 'loaded' without progress for long is usually stuck; treat as soft-warning
            if status == "error":
                raise RuntimeError(f"Mathpix reports error: {payload}")
        if time.time() - start > timeout_s:
            raise TimeoutError(f"Timeout after {timeout_s}s, last status={status}")
        time.sleep(interval)
        # gentle backoff up to 15s
        interval = min(interval + 1, 15)


def download_mmd(pdf_id: str, app_id: str, app_key: str) -> str:
    r = requests.get(
        f"{API_BASE}/pdf/{pdf_id}.mmd",
        headers=headers_for(app_id, app_key),
        timeout=120,
    )
    if r.status_code >= 400:
        raise RuntimeError(f"MMD download failed: HTTP {r.status_code}: {r.text[:300]}")
    return r.text


def convert_one(pdf: Path, output_dir: Path, app_id: str, app_key: str) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    out_path = output_dir / f"{pdf.stem}.mmd"
    if out_path.exists() and out_path.stat().st_size > 1000:
        print(f"  -> Already exists: {out_path.name} ({out_path.stat().st_size} bytes). Skipping.")
        return out_path
    print(f"Uploading {pdf.name} ({pdf.stat().st_size // (1024 * 1024)} MB) ...", flush=True)
    pdf_id = upload_pdf(pdf, app_id, app_key)
    print(f"  pdf_id = {pdf_id}")
    poll_until_done(pdf_id, app_id, app_key)
    print(f"  Downloading .mmd ...", flush=True)
    mmd = download_mmd(pdf_id, app_id, app_key)
    out_path.write_text(mmd, encoding="utf-8")
    print(f"  -> {out_path}  ({len(mmd):,} chars)")
    return out_path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", action="append", type=Path, help="One or more PDF paths (repeat flag)")
    parser.add_argument(
        "--pdfs-from",
        type=Path,
        help="Text file with one PDF path per line (alternative to --pdf)",
    )
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    app_id = os.environ.get("MATHPIX_APP_ID")
    app_key = os.environ.get("MATHPIX_APP_KEY")
    if not app_id or not app_key:
        print("Missing MATHPIX_APP_ID / MATHPIX_APP_KEY env vars.", file=sys.stderr)
        print("Set them via:  set MATHPIX_APP_ID=...  &&  set MATHPIX_APP_KEY=...", file=sys.stderr)
        return 2

    pdfs: list[Path] = []
    if args.pdf:
        pdfs.extend(args.pdf)
    if args.pdfs_from:
        for line in args.pdfs_from.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line:
                pdfs.append(Path(line))

    if not pdfs:
        print("No PDFs provided. Use --pdf <path> (repeatable) or --pdfs-from <file>.", file=sys.stderr)
        return 2

    failures: list[tuple[Path, str]] = []
    for p in pdfs:
        if not p.exists():
            failures.append((p, "not found"))
            continue
        try:
            convert_one(p, args.output, app_id, app_key)
        except Exception as e:
            failures.append((p, str(e)[:200]))

    print()
    print(f"Done. {len(pdfs) - len(failures)}/{len(pdfs)} succeeded.")
    if failures:
        for p, why in failures:
            print(f"  FAIL  {p}: {why}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
