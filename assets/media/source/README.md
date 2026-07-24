# Power to project staff — slide 1 source / audit evidence

`power-project-staff-landscape-original.gif` is the **exact approved GIF** supplied
by Farzam for slide 1 of the "Power to project staff" media slider. It is retained
here, byte-for-byte unmodified, as the audit/source master. It is **not served by the
production page** — the live page uses the optimised video derivatives in
`assets/media/` (see below). Do not delete, overwrite, crop, recolour or re-encode
this file.

## Original (preserved, unmodified)

| Property | Value |
|---|---|
| Original filename | `power-project-staff-landscape.gif` |
| Stored as | `assets/media/source/power-project-staff-landscape-original.gif` |
| SHA-256 | `b93af0bed7a5d5c7faa6c501c3b2863a6b3ef11eae337e423fb8e7a834caec02` |
| Dimensions | 1280 × 720 (16:9) |
| Duration | 6.08 s |
| Frame count | 76 |
| Frame rate | 12.5 fps (80 ms/frame) |
| Loop | Infinite (loop = 0) |
| Colour mode | RGBA (256-colour palette + dithering, per GIF) |
| File size | 23,898,190 bytes (≈ 23.9 MB) |

## Production derivatives (served by index.html)

Deterministically encoded from the original above with ffmpeg (H.264 / VP9) and
Pillow (WebP poster). Exact visible content, full frame, 1280 × 720, no crop, no
added text, no colour grade, no speed change, no audio, natural loop preserved.

| File | Codec / settings | Size | Quality vs source |
|---|---|---|---|
| `power-project-staff-landscape.webm` | VP9, `-crf 31 -b:v 0 -pix_fmt yuv420p -r 12.5 -row-mt 1 -deadline good -cpu-used 2`, no audio | 1,036,782 B (≈1.04 MB) | PSNR 40.94 dB / SSIM 0.961 |
| `power-project-staff-landscape.mp4` | H.264 high, `-crf 23 -preset slow -pix_fmt yuv420p -r 12.5 -movflags +faststart`, no audio | 1,419,354 B (≈1.42 MB) | PSNR 41.19 dB / SSIM 0.961 |
| `power-project-staff-landscape-poster.webp` | Pillow WEBP, frame 0, `quality=82 method=6` | 68,546 B (≈67 KB) | first-frame still |

Reduction vs original GIF: WebM −95.7 %, MP4 −94.1 %. SSIM is measured against a
256-colour dithered GIF, so it slightly under-reports fidelity — the derivatives
render the sky gradient more smoothly than the source (dithering noise removed),
verified by side-by-side frame inspection.

_Optimisation performed 2026-07-24. Original approved in commit c9dd28b._
