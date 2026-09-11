#!/usr/bin/env python3
"""
Generate a premium particle portrait hero animation for GitHub profile README.

Usage:
    python3 scripts/generate_particle_hero.py

Output:
    assets/particle-hero.gif

Requirements:
    - Pillow (PIL)
    - NumPy
    - Python standard library (urllib, math, random, struct, io, os)
"""

import os
import math
import random
import struct
import io
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

# ─── Configuration ───────────────────────────────────────────────────────────

AVATAR_URL = "https://github.com/abdullah2k05.png"
AVATAR_PATH = Path(__file__).parent.parent / "assets" / "avatar.png"
OUTPUT_PATH = Path(__file__).parent.parent / "assets" / "particle-hero.gif"

# Canvas
WIDTH = 1200
HEIGHT = 650
BG_COLOR = (10, 10, 14)

# Accent color — GitHub blue
ACCENT = (88, 166, 255)  # #58A6FF
ACCENT_DIM = (40, 90, 160)
ACCENT_BRIGHT = (130, 195, 255)

# Portrait settings
PORTRAIT_WIDTH = 380
PORTRAIT_HEIGHT = 380
PORTRAIT_X = (WIDTH - PORTRAIT_WIDTH) // 2
PORTRAIT_Y = (HEIGHT - PORTRAIT_HEIGHT) // 2
PORTRAIT_CENTER_X = WIDTH // 2
PORTRAIT_CENTER_Y = HEIGHT // 2

# Particles
NUM_PORTRAIT_PARTICLES = 2200
NUM_FLOATING_PARTICLES = 30
NUM_CONNECTION_LINES = 20

# Animation
NUM_FRAMES = 24
FRAME_DURATION_MS = 80

random.seed(42)
np.random.seed(42)


def download_avatar():
    """Download avatar if not present locally."""
    if AVATAR_PATH.exists():
        print(f"Using existing avatar: {AVATAR_PATH}")
        return
    print(f"Downloading avatar from {AVATAR_URL}...")
    from urllib.request import urlretrieve
    urlretrieve(AVATAR_URL, str(AVATAR_PATH))
    print(f"Saved to {AVATAR_PATH}")


def load_and_process_avatar():
    """Load avatar, convert to grayscale, resize, return as numpy array."""
    img = Image.open(AVATAR_PATH).convert("L")
    img = img.resize((PORTRAIT_WIDTH, PORTRAIT_HEIGHT), Image.LANCZOS)
    arr = np.array(img, dtype=np.float64)
    arr = arr / 255.0
    return arr


def _convolve2d(arr, kernel):
    """Vectorized 2D convolution using numpy. Same mode, edge padding."""
    kh, kw = kernel.shape
    ph, pw = kh // 2, kw // 2
    padded = np.pad(arr, ((ph, ph), (pw, pw)), mode="edge")
    # Use numpy stride tricks for efficient sliding window
    shape = (arr.shape[0], arr.shape[1], kh, kw)
    strides = padded.strides * 2
    windows = np.lib.stride_tricks.as_strided(padded, shape=shape, strides=strides)
    return np.einsum("ijkl,kl->ij", windows, kernel)


def compute_multi_scale_edges(gray_arr):
    """Compute edge maps at two scales for fine details and broad contours."""
    sobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float64)
    sobel_y = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=np.float64)

    # Fine scale — raw image
    gx_fine = _convolve2d(gray_arr, sobel_x)
    gy_fine = _convolve2d(gray_arr, sobel_y)
    fine_edges = np.sqrt(gx_fine**2 + gy_fine**2)
    if fine_edges.max() > 0:
        fine_edges /= fine_edges.max()

    # Coarse scale — blurred image (catches broader contours)
    pil_img = Image.fromarray((gray_arr * 255).astype(np.uint8), mode="L")
    blurred = pil_img.filter(ImageFilter.GaussianBlur(radius=2.0))
    blur_arr = np.array(blurred, dtype=np.float64) / 255.0
    gx_coarse = _convolve2d(blur_arr, sobel_x)
    gy_coarse = _convolve2d(blur_arr, sobel_y)
    coarse_edges = np.sqrt(gx_coarse**2 + gy_coarse**2)
    if coarse_edges.max() > 0:
        coarse_edges /= coarse_edges.max()

    return fine_edges, coarse_edges


def compute_local_contrast(gray_arr, block_size=15):
    """Compute local contrast (std dev) in blocks. Highlights texture regions."""
    h, w = gray_arr.shape
    local_std = np.zeros_like(gray_arr)
    pad = block_size // 2
    padded = np.pad(gray_arr, pad, mode="edge")

    # Use uniform_filter for mean, then compute local variance efficiently
    # Manual block computation for clarity
    for y in range(h):
        for x in range(w):
            block = padded[y : y + block_size, x : x + block_size]
            local_std[y, x] = np.std(block)

    if local_std.max() > 0:
        local_std /= local_std.max()
    return local_std


def compute_local_contrast_fast(gray_arr, block_size=15):
    """Fast local contrast using cumulative sums."""
    h, w = gray_arr.shape
    pad = block_size
    padded = np.pad(gray_arr, pad, mode="edge")

    # Cumulative sum approach for mean and mean-of-squares
    # Add zero row/col at top/left for clean block sum extraction
    cum = np.cumsum(np.cumsum(padded, axis=0), axis=1)
    cum_sq = np.cumsum(np.cumsum(padded**2, axis=0), axis=1)
    integral = np.zeros((cum.shape[0] + 1, cum.shape[1] + 1), dtype=np.float64)
    integral[1:, 1:] = cum
    integral_sq = np.zeros((cum_sq.shape[0] + 1, cum_sq.shape[1] + 1), dtype=np.float64)
    integral_sq[1:, 1:] = cum_sq

    # Block sum using integral image slicing
    # For each pixel (i,j), block in padded goes from (i+pad, j+pad) to (i+pad+block_size-1, j+pad+block_size-1)
    # Sum = integral[i+pad+bs, j+pad+bs] - integral[i+pad, j+pad+bs] - integral[i+pad+bs, j+pad] + integral[i+pad, j+pad]
    # Use array slicing for vectorized computation
    bs = block_size
    block_sum = (
        integral[bs:bs+h, bs:bs+w]
        - integral[:h, bs:bs+w]
        - integral[bs:bs+h, :w]
        + integral[:h, :w]
    )
    block_sum_sq = (
        integral_sq[bs:bs+h, bs:bs+w]
        - integral_sq[:h, bs:bs+w]
        - integral_sq[bs:bs+h, :w]
        + integral_sq[:h, :w]
    )

    n = block_size * block_size
    mean = block_sum / n
    mean_sq = block_sum_sq / n
    variance = np.maximum(mean_sq - mean**2, 0)
    local_std = np.sqrt(variance)

    if local_std.max() > 0:
        local_std /= local_std.max()
    return local_std


def compute_facial_zone_map():
    """Create a priority map that boosts particle density in key facial zones.
    Calibrated to the actual avatar proportions within the 380x380 frame."""
    h, w = PORTRAIT_HEIGHT, PORTRAIT_WIDTH
    zone_map = np.ones((h, w), dtype=np.float64) * 0.2  # low base — let features dominate

    y_grid, x_grid = np.mgrid[0:h, 0:w]

    def add_gaussian_zone(cx, cy, sigma_x, sigma_y, weight):
        gauss = np.exp(-((x_grid - cx) ** 2 / (2 * sigma_x**2) + (y_grid - cy) ** 2 / (2 * sigma_y**2)))
        return gauss * weight

    # --- Eyes / glasses region (upper face, ~35% from top) ---
    zone_map += add_gaussian_zone(152, 130, 22, 16, 0.8)   # left eye/glasses
    zone_map += add_gaussian_zone(228, 130, 22, 16, 0.8)   # right eye/glasses
    # Glasses bridge
    zone_map += add_gaussian_zone(190, 132, 12, 20, 0.5)
    # Glasses frames — horizontal bars above and below eyes
    zone_map += add_gaussian_zone(190, 120, 55, 6, 0.6)    # top frame
    zone_map += add_gaussian_zone(190, 142, 55, 6, 0.5)    # bottom frame

    # --- Nose (~45% from top) ---
    zone_map += add_gaussian_zone(190, 175, 14, 28, 0.55)  # bridge
    zone_map += add_gaussian_zone(190, 198, 12, 10, 0.5)   # tip
    zone_map += add_gaussian_zone(175, 195, 8, 8, 0.35)    # left nostril shadow
    zone_map += add_gaussian_zone(205, 195, 8, 8, 0.35)    # right nostril shadow

    # --- Mouth / lips (~55% from top) ---
    zone_map += add_gaussian_zone(190, 225, 28, 10, 0.65)  # upper lip
    zone_map += add_gaussian_zone(190, 233, 28, 8, 0.55)   # lower lip
    zone_map += add_gaussian_zone(190, 240, 22, 12, 0.4)   # lip shadow

    # --- Beard / chin / jaw (~60-70% from top) ---
    zone_map += add_gaussian_zone(190, 255, 35, 20, 0.5)   # beard area
    zone_map += add_gaussian_zone(190, 270, 40, 18, 0.45)  # chin
    # Jawline contours
    zone_map += add_gaussian_zone(115, 250, 20, 40, 0.4)   # left jaw
    zone_map += add_gaussian_zone(265, 250, 20, 40, 0.4)   # right jaw

    # --- Hair (top and sides) ---
    zone_map += add_gaussian_zone(190, 45, 65, 35, 0.55)   # top hair mass
    zone_map += add_gaussian_zone(100, 95, 22, 45, 0.35)   # left hair side
    zone_map += add_gaussian_zone(280, 95, 22, 45, 0.35)   # right hair side

    # --- Forehead ---
    zone_map += add_gaussian_zone(190, 90, 45, 25, 0.3)

    # --- Shoulders / coat / sweater transition ---
    # Dark coat shoulders
    zone_map += add_gaussian_zone(55, 340, 45, 40, 0.3)
    zone_map += add_gaussian_zone(325, 340, 45, 40, 0.3)
    # Coat collar / lapel lines
    zone_map += add_gaussian_zone(140, 300, 20, 30, 0.35)
    zone_map += add_gaussian_zone(240, 300, 20, 30, 0.35)
    # Sweater neckline (light area, creates contrast with dark coat)
    zone_map += add_gaussian_zone(190, 310, 30, 20, 0.4)

    zone_map = np.clip(zone_map, 0, 1)
    return zone_map


def compute_feature_map(gray_arr, fine_edges, coarse_edges, local_contrast, zone_map):
    """
    Build a comprehensive feature map that prioritizes facial recognition.

    Combines:
    - Multi-scale edges (fine for glasses/beard, coarse for face shape)
    - Local contrast (texture regions like beard, hair)
    - Facial zone priority (eyes, nose, mouth weighted higher)
    """
    h, w = gray_arr.shape

    # --- Fine edges: glasses frames, beard hairs, lip contours, eyelids ---
    fine_boost = np.clip(fine_edges * 3.0, 0, 1)

    # --- Coarse edges: face outline, jaw, coat collar ---
    coarse_boost = np.clip(coarse_edges * 2.0, 0, 1)

    # --- Local contrast: texture in beard, hair, skin ---
    texture = local_contrast.copy()

    # --- Combine with zone-aware weighting ---
    # In facial zones: fine edges are king (glasses, lips, nose)
    # Outside: coarse edges dominate (silhouette)
    in_face = zone_map > 0.4

    feature_map = np.zeros((h, w), dtype=np.float64)
    # Inside face: fine edges + texture, boosted by zone
    feature_map[in_face] = (
        fine_boost[in_face] * 0.6
        + texture[in_face] * 0.3
        + coarse_boost[in_face] * 0.2
    ) * (0.5 + 0.5 * zone_map[in_face])

    # Outside face: mainly coarse edges for silhouette
    feature_map[~in_face] = (
        coarse_boost[~in_face] * 0.5
        + fine_boost[~in_face] * 0.2
    ) * (0.3 + 0.3 * zone_map[~in_face])

    # Minimum floor — only in key facial zones, very low elsewhere
    feature_map[in_face] = np.maximum(feature_map[in_face], 0.15)
    feature_map[~in_face] = np.maximum(feature_map[~in_face], 0.02)

    return feature_map


def generate_portrait_particles(feature_map, fine_edges, coarse_edges, lum, zone_map):
    """Generate particles with three tiers based on feature importance."""
    particles = []
    h, w = feature_map.shape

    # --- Tier 1: Strong structural edges (face outline, glasses, features) ---
    combined_edges = np.maximum(fine_edges, coarse_edges * 0.7)
    structural_score = combined_edges * (0.4 + 0.6 * zone_map)

    strong_mask = structural_score > 0.1
    strong_indices = np.where(strong_mask)
    strong_count = min(800, len(strong_indices[0]))

    if strong_count > 0:
        strengths = structural_score[strong_indices]
        probs = strengths / strengths.sum()
        sampled = np.random.choice(len(strengths), size=strong_count, p=probs, replace=True)

        for pos in sampled:
            ey = strong_indices[0][pos]
            ex = strong_indices[1][pos]
            strength = structural_score[ey, ex]
            lum_val = lum[ey, ex]
            zone_val = zone_map[ey, ex]

            cx = PORTRAIT_X + ex
            cy = PORTRAIT_Y + ey

            # Size scales strongly with edge strength and zone importance
            zone_boost = 0.6 + 0.4 * zone_val
            size = (1.0 + 2.5 * strength) * zone_boost

            # Color: brighter for stronger edges, higher zone = more vivid
            blend = 0.15 + 0.85 * strength
            r = int(ACCENT_DIM[0] + (ACCENT[0] - ACCENT_DIM[0]) * blend)
            g = int(ACCENT_DIM[1] + (ACCENT[1] - ACCENT_DIM[1]) * blend)
            b = int(ACCENT_DIM[2] + (ACCENT[2] - ACCENT_DIM[2]) * blend)

            alpha = 0.5 + 0.5 * min(1.0, strength * zone_boost * 1.5)

            particles.append({
                "base_x": cx, "base_y": cy,
                "x": cx, "y": cy,
                "size": size, "color": (r, g, b), "alpha": alpha,
                "brightness": lum_val,
                "phase": random.uniform(0, 2 * math.pi),
                "speed": random.uniform(0.3, 1.0),
                "amplitude": random.uniform(0.2, 1.0),
                "tier": 0,
            })

    # --- Tier 2: Feature detail particles (beard texture, hair, skin texture) ---
    detail_score = feature_map.copy()
    detail_mask = detail_score > 0.06
    detail_mask = detail_mask & ~strong_mask
    detail_indices = np.where(detail_mask)
    detail_count = min(800, len(detail_indices[0]))

    if detail_count > 0:
        strengths = detail_score[detail_indices]
        probs = strengths / strengths.sum()
        sampled = np.random.choice(len(strengths), size=detail_count, p=probs, replace=True)

        for pos in sampled:
            dy = detail_indices[0][pos]
            dx = detail_indices[1][pos]
            strength = detail_score[dy, dx]
            lum_val = lum[dy, dx]
            zone_val = zone_map[dy, dx]

            cx = PORTRAIT_X + dx
            cy = PORTRAIT_Y + dy

            size = 0.7 + 1.5 * strength * (0.5 + 0.5 * zone_val)

            blend = 0.1 + 0.65 * strength
            r = int(ACCENT_DIM[0] + (ACCENT[0] - ACCENT_DIM[0]) * blend)
            g = int(ACCENT_DIM[1] + (ACCENT[1] - ACCENT_DIM[1]) * blend)
            b = int(ACCENT_DIM[2] + (ACCENT[2] - ACCENT_DIM[2]) * blend)

            alpha = 0.25 + 0.5 * strength

            particles.append({
                "base_x": cx, "base_y": cy,
                "x": cx, "y": cy,
                "size": size, "color": (r, g, b), "alpha": alpha,
                "brightness": lum_val,
                "phase": random.uniform(0, 2 * math.pi),
                "speed": random.uniform(0.3, 1.0),
                "amplitude": random.uniform(0.3, 1.3),
                "tier": 1,
            })

    # --- Tier 3: Fill particles (uniform coverage inside face, sparse outside) ---
    remaining = NUM_PORTRAIT_PARTICLES - len(particles)
    fill_prob = feature_map.copy() ** 0.6
    fill_prob[strong_mask] *= 0.15
    fill_flat = fill_prob.flatten()
    fill_flat = np.maximum(fill_flat, 0)
    total = fill_flat.sum()
    if total > 0:
        fill_flat /= total
    else:
        fill_flat = np.ones_like(fill_flat) / len(fill_flat)

    fill_indices = np.random.choice(len(fill_flat), size=remaining, p=fill_flat, replace=True)

    for idx in fill_indices:
        fy = idx // w
        fx = idx % w
        strength = feature_map[fy, fx]
        lum_val = lum[fy, fx]
        zone_val = zone_map[fy, fx]

        cx = PORTRAIT_X + fx
        cy = PORTRAIT_Y + fy

        size = 0.4 + 1.6 * strength * (0.4 + 0.6 * zone_val)

        blend = 0.08 + 0.55 * strength
        r = int(ACCENT_DIM[0] + (ACCENT[0] - ACCENT_DIM[0]) * blend)
        g = int(ACCENT_DIM[1] + (ACCENT[1] - ACCENT_DIM[1]) * blend)
        b = int(ACCENT_DIM[2] + (ACCENT[2] - ACCENT_DIM[2]) * blend)

        alpha = 0.18 + 0.45 * strength

        particles.append({
            "base_x": cx, "base_y": cy,
            "x": cx, "y": cy,
            "size": size, "color": (r, g, b), "alpha": alpha,
            "brightness": lum_val,
            "phase": random.uniform(0, 2 * math.pi),
            "speed": random.uniform(0.3, 1.0),
            "amplitude": random.uniform(0.3, 1.8),
            "tier": 2,
        })

    return particles


def generate_floating_particles():
    """Generate floating data particles around the portrait."""
    particles = []
    for _ in range(NUM_FLOATING_PARTICLES):
        angle = random.uniform(0, 2 * math.pi)
        radius = random.uniform(280, 460)
        x = PORTRAIT_CENTER_X + radius * math.cos(angle)
        y = PORTRAIT_CENTER_Y + radius * math.sin(angle)

        particles.append({
            "base_x": x, "base_y": y,
            "x": x, "y": y,
            "size": random.uniform(0.8, 1.8),
            "color": ACCENT_BRIGHT if random.random() > 0.5 else ACCENT_DIM,
            "alpha": random.uniform(0.15, 0.5),
            "phase": random.uniform(0, 2 * math.pi),
            "speed": random.uniform(0.2, 0.8),
            "amplitude": random.uniform(2, 6),
            "orbit_speed": random.uniform(0.001, 0.004),
        })

    return particles


def find_connections(particles, max_dist=80):
    """Find sparse connections between nearby particles."""
    connections = []
    portrait_particles = [p for p in particles if "orbit_speed" not in p]

    # Prioritize connections between structural particles for cleaner lines
    structural = [p for p in portrait_particles if p.get("tier", 2) == 0]
    others = [p for p in portrait_particles if p.get("tier", 2) > 0]

    check_set = structural + random.sample(others, min(200, len(others)))

    for i, p1 in enumerate(check_set):
        for p2 in check_set[i + 1:]:
            dx = p1["base_x"] - p2["base_x"]
            dy = p1["base_y"] - p2["base_y"]
            dist = math.sqrt(dx * dx + dy * dy)
            if dist < max_dist and random.random() < 0.12:
                connections.append((p1, p2, dist))

    return connections[:NUM_CONNECTION_LINES]


def render_frame(frame_idx, portrait_particles, floating_particles, connections, total_frames):
    """Render a single animation frame."""
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    t = frame_idx / total_frames
    angle = t * 2 * math.pi

    for p in portrait_particles:
        offset_x = math.sin(angle * p["speed"] + p["phase"]) * p["amplitude"]
        offset_y = math.cos(angle * p["speed"] * 0.7 + p["phase"]) * p["amplitude"] * 0.8
        p["x"] = p["base_x"] + offset_x
        p["y"] = p["base_y"] + offset_y

    for p in floating_particles:
        orb_angle = angle * p["orbit_speed"] * 10 + p["phase"]
        offset_x = math.sin(orb_angle) * p["amplitude"]
        offset_y = math.cos(orb_angle * 0.6) * p["amplitude"] * 1.2
        p["x"] = p["base_x"] + offset_x
        p["y"] = p["base_y"] + offset_y

    # Connection lines (subtle)
    for p1, p2, dist in connections:
        opacity = max(0.04, 0.12 * (1 - dist / 80))
        line_color = (
            int(BG_COLOR[0] + (ACCENT_DIM[0] - BG_COLOR[0]) * opacity),
            int(BG_COLOR[1] + (ACCENT_DIM[1] - BG_COLOR[1]) * opacity),
            int(BG_COLOR[2] + (ACCENT_DIM[2] - BG_COLOR[2]) * opacity),
        )
        draw.line([(p1["x"], p1["y"]), (p2["x"], p2["y"])], fill=line_color, width=1)

    # Floating particles
    for p in floating_particles:
        color = (
            int(BG_COLOR[0] + (p["color"][0] - BG_COLOR[0]) * p["alpha"]),
            int(BG_COLOR[1] + (p["color"][1] - BG_COLOR[1]) * p["alpha"]),
            int(BG_COLOR[2] + (p["color"][2] - BG_COLOR[2]) * p["alpha"]),
        )
        s = p["size"]
        draw.ellipse([p["x"] - s, p["y"] - s, p["x"] + s, p["y"] + s], fill=color)

    # Portrait particles — render by tier for proper layering
    for p in portrait_particles:
        breathe = 0.85 + 0.15 * math.sin(angle * 1.5 + p["phase"])
        a = p["alpha"] * breathe
        color = (
            int(BG_COLOR[0] + (p["color"][0] - BG_COLOR[0]) * a),
            int(BG_COLOR[1] + (p["color"][1] - BG_COLOR[1]) * a),
            int(BG_COLOR[2] + (p["color"][2] - BG_COLOR[2]) * a),
        )
        s = p["size"]
        draw.ellipse([p["x"] - s, p["y"] - s, p["x"] + s, p["y"] + s], fill=color)

    # Subtle glow around portrait center
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_alpha = int(10 + 5 * math.sin(angle * 0.5))
    for r in range(110, 15, -4):
        a = max(0, glow_alpha - r // 8)
        glow_draw.ellipse(
            [PORTRAIT_CENTER_X - r, PORTRAIT_CENTER_Y - r,
             PORTRAIT_CENTER_X + r, PORTRAIT_CENTER_Y + r],
            fill=(ACCENT[0], ACCENT[1], ACCENT[2], a),
        )
    img.paste(Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB"))

    return img


def optimize_gif(frames):
    """Optimize GIF by reducing colors for smaller file."""
    print(f"Optimizing {len(frames)} frames...")
    optimized = []
    for frame in frames:
        f = frame.quantize(colors=64, method=Image.Quantize.MEDIANCUT)
        optimized.append(f)
    return optimized


def create_gif(frames, duration_ms):
    """Create optimized GIF from frames."""
    print("Creating GIF...")
    frames[0].save(
        str(OUTPUT_PATH),
        save_all=True,
        append_images=frames[1:],
        duration=duration_ms,
        loop=0,
        optimize=True,
    )
    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"GIF saved: {OUTPUT_PATH} ({size_kb:.0f} KB)")
    return size_kb


def main():
    print("=" * 60)
    print("  Particle Portrait Hero Generator v2")
    print("=" * 60)

    download_avatar()

    print("\nProcessing avatar...")
    gray_arr = load_and_process_avatar()
    print(f"  Avatar processed: {gray_arr.shape[1]}x{gray_arr.shape[0]}")

    print("  Computing multi-scale edges...")
    fine_edges, coarse_edges = compute_multi_scale_edges(gray_arr)
    print(f"    Fine edge pixels (>0.12): {np.sum(fine_edges > 0.12)}")
    print(f"    Coarse edge pixels (>0.12): {np.sum(coarse_edges > 0.12)}")

    print("  Computing local contrast...")
    local_contrast = compute_local_contrast_fast(gray_arr, block_size=15)
    print(f"    Mean local contrast: {local_contrast.mean():.3f}")

    print("  Building facial zone map...")
    zone_map = compute_facial_zone_map()
    print(f"    Zone map range: [{zone_map.min():.2f}, {zone_map.max():.2f}]")

    print("  Building feature map...")
    feature_map = compute_feature_map(gray_arr, fine_edges, coarse_edges, local_contrast, zone_map)

    print("\nGenerating particles...")
    portrait_particles = generate_portrait_particles(
        feature_map, fine_edges, coarse_edges, gray_arr, zone_map
    )
    print(f"  Portrait particles: {len(portrait_particles)}")
    tier_counts = {}
    for p in portrait_particles:
        t = p.get("tier", -1)
        tier_counts[t] = tier_counts.get(t, 0) + 1
    print(f"    Tier 0 (structural): {tier_counts.get(0, 0)}")
    print(f"    Tier 1 (detail): {tier_counts.get(1, 0)}")
    print(f"    Tier 2 (fill): {tier_counts.get(2, 0)}")

    floating_particles = generate_floating_particles()
    print(f"  Floating particles: {len(floating_particles)}")

    all_particles = portrait_particles + floating_particles
    connections = find_connections(all_particles)
    print(f"  Connection lines: {len(connections)}")

    print(f"\nRendering {NUM_FRAMES} frames...")
    frames = []
    for i in range(NUM_FRAMES):
        frame = render_frame(i, portrait_particles, floating_particles, connections, NUM_FRAMES)
        frames.append(frame)
        if (i + 1) % 10 == 0:
            print(f"  Frame {i + 1}/{NUM_FRAMES}")

    print("\nOptimizing...")
    optimized_frames = optimize_gif(frames)

    print()
    size_kb = create_gif(optimized_frames, FRAME_DURATION_MS)

    print("\n" + "=" * 60)
    print(f"  Done! Output: {OUTPUT_PATH}")
    print(f"  Size: {size_kb:.0f} KB")
    print(f"  Frames: {NUM_FRAMES}")
    print(f"  Duration: {NUM_FRAMES * FRAME_DURATION_MS / 1000:.1f}s")
    print("=" * 60)


if __name__ == "__main__":
    main()
